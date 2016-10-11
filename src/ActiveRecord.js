//_ = require('lodash');
import ServiceLocator from './ServiceLocator'
import SessionManager from './SessionManager'
var deep = require('deep-diff').diff

/**
 *
 * Can be inherited or used as is. Holds the model definition,
 * Generates populate parameters.
 * Provides several helper methods
 *
 * @param model Object Mongoose Style Model
 * @param name String Name of the Model (must be the same as described in 'ref' of others models relations.
 * @returns {$ES6_CLASS$}
 */
export default function ActiveRecord (model, name, SManager = SessionManager(model)) {
  let sl = ServiceLocator.instance;
  let session = new SManager()

  let ActiveRecord = class {
    constructor ($injector, rootUrl, options) {
      this.$injector = $injector;
      this.rootUrl = rootUrl;
      this.build(options);
    }

    build (options) {
      let sess = {}
      _.each(model, (field, key)=> {
        if (options && (options[ key ] || options[ key ] === 0)) {
          var name = _.isArray(field) ? field[ 0 ].ref : field.ref;
          var dao = sl.getDao(name);
          if (dao) {
            /**
             * Deal with populated fields when building a pre-existing object
             *
             * Some fields might be populated in existing object, but not in the incoming one
             * To prevent things from disappearing, determine when new data should overwrite exiting
             *
             * In the case of an array, look at each incoming value.
             * If it is populated, keep it
             * If it isn't, try to find the populated value in the existing array, and use it instead.
             */
            if (Array.isArray(options[ key ])) {
              let populated = options[ key ].map(
                (value)=> {
                  if (typeof value === 'string' && this[ key ] && Array.isArray(this[ key ])) {
                    let found = this[ key ].find((element) => {
                      return element && element._id === value
                    });
                    if (found) return found
                  }
                  return value
                });
              this[ key ] = dao.build(_.clone(populated));
            } else if (
              !this[ key ] ||
              typeof(this[ key ]) === 'string' ||
              typeof(options[ key ]) === 'object' ||
              this[ key ]._id !== options[ key ]) {
              this[ key ] = dao.build(_.clone(options[ key ]));
            }
          } else {
            this[ key ] = this.buildField(field, options[ key ])
          }
        }
        /** Save state of the object for diff purpose */
        if (options && options._id && this[ key ]) {
          let toSave
          /** If the field is a ref, only save id or the ids array */
          if (_.isArray(field) && field[ 0 ].ref || field.ref) {
            if (_.isArray(field)) {
              toSave = this[ key ].map(entry => (typeof entry === 'string') ? entry : entry._id)
            } else {
              toSave = typeof this[ key ] === 'string' ? this[ key ] : this[ key ]._id
            }
          } else {
            toSave = this[ key ]
          }
          sess[ key ] = _.cloneDeep(toSave)
        }
      });
      session.save(sess)
      return this;

    }

    clone () {
      var m = sl.getModel(name);
      var ob = new m(this.$injector, this.rootUrl, this);
      delete ob._id;
      return ob;
    }

    /**
     * Be careful when using this method. It will ignore non-populated fields, keeping the _id entry !
     */
    cloneDeep () {
      var clone = this.clone()
      /** Find ref properties that need their _id to be removed */
      _.each(model, (v, k) => {
        if (clone[ k ]) {
          if (_.isArray(v)) {
            if (v[ 0 ].ref) {
              /** Array of nested Objects. Need to clone each */
              clone[ k ] = clone[ k ].map(e => e.cloneDeep ? e.cloneDeep() : e)
            }
          } else if (v.ref) {
            /** Single nested object, replace it */
            clone[ k ] = clone[ k ].cloneDeep ? clone[ k ].cloneDeep() : clone[ k ]
          }
        }
      })
      return clone
    }

    get $injector () {
      return this._injector;
    }

    set $injector ($injector) {
      this._injector = $injector;
    }

    get $http () {
      return this.$injector.get('$http');
    }

    buildField (model, value) {
      return _.clone(value);

    }

    archive () {
      return this.$http.put(this.rootUrl + '/' + this._id + '/archive', null);
    }

    restore () {
      return this.$http.delete(this.rootUrl + '/' + this._id + '/archive');
    }

    remove () {
      return this.delete();
    }

    delete () {
      return this.$http.delete(this.rootUrl + '/' + this._id);
    }

    populate (field, query) {
      var $q = this.$injector.get('$q');

      if (Array.isArray(field)) {
        return $q.all(field.map(f => this.populate(f, query))).then(() => this)
      }

      var deferred = $q.defer();
      var self = this;
      if (Array.isArray(model[ field ]) && Array.isArray(this[ field ]) && this[ field ].length) {
        /**
         * The field is an array. It may contain mixed populated and unpopulated data.
         * first, sort it out (typeof unpopulated is string)
         */
        var grouped = _.groupBy(this[ field ], (i) => typeof i)
        /** No string = everything is populated (or array is empty), we're all set */
        if (!grouped.string) {
          deferred.resolve(this[ field ]);
        } else {
          /** Resolve the model name and the corresponding DAO */
          var name = model[ field ][ 0 ].ref;
          if (!name)
            deferred.reject('Cannot Populate: unknown model');
          else {
            var dao = sl.getDao(name);
            if (!dao) {
              deferred.reject('Cannot Populate: unknown DAO');
            } else {
              return dao.get(dao.query(query).select(grouped.string)).then((d)=> {
                /** To preserve order, we map the existing field, replacing only the populated values */
                self[ field ] = self[ field ].map((f) => {
                  if (typeof f === 'string') {
                    return _.find(d.data, (foo) => { return (foo._id === f)})
                  }
                  return f
                })
                return self;
              })
            }
          }
        }
      }

      if (!this[ field ] || (typeof this[ field ] === 'object')) {
        // The field is empty or already populated. return.
        deferred.resolve(this[ field ]);
      } else {
        var name = model[ field ].ref;
        if (!name)
          deferred.reject('Cannot Populate: unknown model');
        else {
          var dao = sl.getDao(name);
          if (!dao) {
            deferred.reject('Cannot Populate: unknown DAO');
          } else {
            return dao.getById(this[ field ]).then(function (sub) {
              self[ field ] = sub;
              return self;
            });
          }
        }

      }

      return deferred.promise;

    }

    beforeSave (obj, opts = {}) {
      if (!obj){
        obj = {}
        _.each(_.keys(model), k => obj[k] = this[k])
      }
      let old = session.retrieve(this._id) || {}
      _.each(model, (field, key)=> {
        if (obj[ key ] && (field.ref || (_.isArray(field) && field[ 0 ].ref))) {

          if (_.isArray(obj[ key ])) {
            obj[ key ] = _.compact(obj[ key ].map((val) => {
              if (typeof(val) === 'object') {
                return field.nested ? val : val._id;
              } else if (typeof(val) === 'string') {
                return val;
              }
            }));
          } else {
            obj[ key ] = obj[ key ]._id || obj[ key ];
          }
        } else if (obj[ key ] && (field.type === Date || (_.isArray(field) && field[ 0 ].type === Date))) {
          obj[ key ] = new Date(moment(obj[ key ])).toISOString();
        }
        if (!opts.force && !deep(obj[ key ], old[ key ])) {
          delete obj[ key ]
        }
      });
      return obj;
    }

    save (opts = {}) {
      var toSave = this.beforeSave(null, opts);
      if (_.isEmpty(toSave)) {
        return this.$injector.get('$q')(resolve => resolve({ data: this }))
      }
      var callback;
      if (opts.populate) {
        var dao = sl.getDao(name);
        callback = ()=> {
          return dao.getById(this._id, dao.query().populate(opts.populate));
        }
      } else {
        callback = (data) => {
          this.build(data.data);
          return data;
        }
      }

      if (this._id) {
        return this.$http.put(this.rootUrl + '/' + this._id, toSave).then(callback)
      } else {
        return this.$http.post(this.rootUrl, toSave).then(callback);
      }
    }

    saveDeep (populate) {
      var promises = []
      /** Find ref properties that might need to be saved */
      _.each(model, (v, k) => {
        if (this[ k ]) {
          if (_.isArray(v)) {
            if (v[ 0 ].ref) {
              /** Array of nested Objects. Check if need to save each */
              this[ k ].forEach(e => {if (!e._id && e.saveDeep) promises.push(e.saveDeep())})
            }
          } else if (v.ref) {
            /** Single nested object, save it if needed */
            if (!this[ k ]._id && this[ k ].saveDeep)
              promises.push(this[ k ].saveDeep())
          }
        }
      })
      var $q = this._injector.get('$q')
      return $q.all(promises).then(() => {
        return this.save(populate)
      })
    }

    static getName () {
      return name;
    }

    static makePopObject (pop) {
      return _.map(pop, function (p, k) {
        p = Array.isArray(p) ? p[ 0 ] : p;
        var ob = { path: k };
        var sub = ActiveRecord.findSubPopulates(p.ref);
        if (sub && sub.length) {
          ob.populate = sub;
        }
        return ob;
      });
    }

    static findSubPopulates (ref) {
      let serviceLocator = ServiceLocator.instance;
      var linkedModel = serviceLocator.getModel(ref);
      if (linkedModel && linkedModel !== model) {
        return linkedModel.populateParams();
      }
    }

    static populateParams (populateArray) {

      // Get from the model the fields that reference another object
      var pop = _.pick(model, function (v) {
        if (_.isArray(v))
          return v[ 0 ].ref;
        return v.ref;
      });

      if (populateArray === 'all') {
        return ActiveRecord.makePopObject(pop);
      }
      var toPopulate = populateArray ? _.pick(pop, function (p, k) {
        return _.contains(populateArray, k);
      }) : _.pick(pop, function (v) {
        return v.populateDefault || (v[ 0 ] && v[ 0 ].populateDefault);
      });
      return ActiveRecord.makePopObject(toPopulate);

    }

    static getModel () {
      return model;
    }

    static getSession () {
      return session;
    }

  };

  return ActiveRecord;
}
