'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = ActiveRecord;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ServiceLocator = require('./ServiceLocator');

var _ServiceLocator2 = _interopRequireDefault(_ServiceLocator);

var _SessionManager = require('./SessionManager');

var _SessionManager2 = _interopRequireDefault(_SessionManager);

var _ = require('lodash');

var deep = require('deep-diff').diff;

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

function ActiveRecord(model, name) {
  var SManager = arguments.length <= 2 || arguments[2] === undefined ? (0, _SessionManager2['default'])(model) : arguments[2];
  return (function () {
    var sl = _ServiceLocator2['default'].instance;
    var session = new SManager();

    var ActiveRecord = (function () {
      function ActiveRecord($injector, rootUrl, options) {
        _classCallCheck(this, ActiveRecord);

        this.$injector = $injector;
        this.rootUrl = rootUrl;
        this.build(options);
      }

      _createClass(ActiveRecord, [{
        key: 'build',
        value: function build(options) {
          // istanbul ignore next

          var _this = this;

          var sess = {};
          _.each(model, function (field, key) {
            if (options && (options[key] || options[key] === 0)) {
              var name = _.isArray(field) ? field[0].ref : field.ref;
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
                if (Array.isArray(options[key])) {
                  var populated = options[key].map(function (value) {
                    if (typeof value === 'string' && _this[key] && Array.isArray(_this[key])) {
                      var found = _this[key].find(function (element) {
                        return element && element._id === value;
                      });
                      if (found) return found;
                    }
                    return value;
                  });
                  _this[key] = dao.build(_.clone(populated));
                } else if (!_this[key] || typeof _this[key] === 'string' || typeof options[key] === 'object' || _this[key]._id !== options[key]) {
                  _this[key] = dao.build(_.clone(options[key]));
                }
              } else {
                _this[key] = _this.buildField(field, options[key]);
              }
            }
            /** Save state of the object for diff purpose */
            if (options && options._id && _this[key]) {
              var toSave = undefined;
              /** If the field is a ref, only save id or the ids array */
              if ((_.isArray(field) && field[0].ref || field.ref) &&
              /** Unless it is marked nested */
              !(field.nested || _.isArray(field) && field[0].nested)) {
                if (_.isArray(field)) {
                  toSave = _this[key].map(function (entry) {
                    return typeof entry === 'string' ? entry : entry._id;
                  });
                } else {
                  toSave = typeof _this[key] === 'string' ? _this[key] : _this[key]._id;
                }
              } else if (field.nested || _.isArray(field) && field[0].nested) {
                if (_.isArray(field)) {
                  toSave = _this[key].map(function (e) {
                    return e.beforeSave(null, { force: true });
                  });
                } else {
                  toSave = _this[key].beforeSave(null, { force: true });
                }
              } else {
                toSave = _this[key];
              }
              sess[key] = _.cloneDeep(toSave);
            }
          });
          session.save(sess);
          return this;
        }
      }, {
        key: 'clone',
        value: function clone() {
          var m = sl.getModel(name);
          var ob = new m(this.$injector, this.rootUrl, this);
          delete ob._id;
          return ob;
        }

        /**
         * Be careful when using this method. It will ignore non-populated fields, keeping the _id entry !
         */
      }, {
        key: 'cloneDeep',
        value: function cloneDeep() {
          var clone = this.clone();
          /** Find ref properties that need their _id to be removed */
          _.each(model, function (v, k) {
            if (clone[k]) {
              if (_.isArray(v)) {
                if (v[0].ref) {
                  /** Array of nested Objects. Need to clone each */
                  clone[k] = clone[k].map(function (e) {
                    return e.cloneDeep ? e.cloneDeep() : e;
                  });
                }
              } else if (v.ref) {
                /** Single nested object, replace it */
                clone[k] = clone[k].cloneDeep ? clone[k].cloneDeep() : clone[k];
              }
            }
          });
          return clone;
        }
      }, {
        key: 'buildField',
        value: function buildField(model, value) {
          return _.clone(value);
        }
      }, {
        key: 'archive',
        value: function archive() {
          return this.$http.put(this.rootUrl + '/' + this._id + '/archive', null);
        }
      }, {
        key: 'restore',
        value: function restore() {
          return this.$http['delete'](this.rootUrl + '/' + this._id + '/archive');
        }
      }, {
        key: 'remove',
        value: function remove() {
          return this['delete']();
        }
      }, {
        key: 'delete',
        value: function _delete() {
          return this.$http['delete'](this.rootUrl + '/' + this._id);
        }
      }, {
        key: 'populate',
        value: function populate(field, query) {
          // istanbul ignore next

          var _this2 = this;

          var $q = this.$injector.get('$q');

          if (Array.isArray(field)) {
            return $q.all(field.map(function (f) {
              return _this2.populate(f, query);
            })).then(function () {
              return _this2;
            });
          }

          var deferred = $q.defer();
          var self = this;
          if (Array.isArray(model[field]) && Array.isArray(this[field]) && this[field].length) {
            /**
             * The field is an array. It may contain mixed populated and unpopulated data.
             * first, sort it out (typeof unpopulated is string)
             */
            var grouped = _.groupBy(this[field], function (i) {
              return typeof i;
            });
            /** No string = everything is populated (or array is empty), we're all set */
            if (!grouped.string) {
              deferred.resolve(this[field]);
            } else {
              /** Resolve the model name and the corresponding DAO */
              var name = model[field][0].ref;
              if (!name) deferred.reject('Cannot Populate: unknown model');else {
                var dao = sl.getDao(name);
                if (!dao) {
                  deferred.reject('Cannot Populate: unknown DAO');
                } else {
                  return dao.get(dao.query(query).select(grouped.string)).then(function (d) {
                    /** To preserve order, we map the existing field, replacing only the populated values */
                    self[field] = self[field].map(function (f) {
                      if (typeof f === 'string') {
                        return _.find(d.data, function (foo) {
                          return foo._id === f;
                        });
                      }
                      return f;
                    });
                    return self;
                  });
                }
              }
            }
          }

          if (!this[field] || typeof this[field] === 'object') {
            // The field is empty or already populated. return.
            deferred.resolve(this[field]);
          } else {
            var name = model[field].ref;
            if (!name) deferred.reject('Cannot Populate: unknown model');else {
              var dao = sl.getDao(name);
              if (!dao) {
                deferred.reject('Cannot Populate: unknown DAO');
              } else {
                return dao.getById(this[field]).then(function (sub) {
                  self[field] = sub;
                  return self;
                });
              }
            }
          }

          return deferred.promise;
        }
      }, {
        key: 'beforeSave',
        value: function beforeSave(obj) {
          // istanbul ignore next

          var _this3 = this;

          var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

          /** If no object is provided, clone `this`
           * by copying only relevant keys (keys in model)
           * If you write your own beforeSave method, it is your responsibility to clone `this`
           * the way you want it cloned
           */
          if (!obj) {
            obj = {};
            _.each(_.keys(model), function (k) {
              if (!_.isUndefined(_this3[k])) {
                obj[k] = _this3[k];
              }
            });
          }
          /** Retrieve object saved in session to perform the diff */
          var old = session.retrieve(this._id) || {};

          _.each(model, function (field, key) {
            if (!_.isUndefined(obj[key])) {
              /** If the field is a ref to another field, replace it by its _id */
              if ((field.ref || _.isArray(field) && field[0].ref) &&
              /** Unless it is specifically marked as nested */
              !(field.nested || _.isArray(field) && field[0].nested)) {
                /** Transforms an array of refs to just an array of _ids
                 * Handles mixed arrays */
                if (_.isArray(obj[key])) {
                  obj[key] = _.compact(obj[key].map(function (val) {
                    if (typeof val === 'object') {
                      return field.nested ? val : val._id;
                    } else if (typeof val === 'string') {
                      return val;
                    }
                  }));
                } else {
                  /** Transforms just a single ref into its _id if needed */
                  obj[key] = obj[key]._id || obj[key];
                }
                /** Nested SubModel, pass it through beforeSave() so that
                 * only relevant fields are kept
                 * {force: true} so that all fields of the nested object are returned
                 * */
              } else if (field.nested || _.isArray(field) && field[0].nested) {
                  if (_.isArray(field)) {
                    obj[key] = obj[key].map(function (e) {
                      return e.beforeSave(null, { force: true });
                    });
                  } else {
                    obj[key] = obj[key].beforeSave(null, { force: true });
                  }
                } else if (_.isDate(obj[key])) {
                  /** Make sure the date is an ISOString */
                  obj[key] = new Date(obj[key]).toISOString();
                }
            }
            /** IMPORTANT this is where the diff is made. If we didn't force in the options*/
            if (!opts.force && !deep(old[key], obj[key])) {
              delete obj[key];
            }
          });
          return obj;
        }
      }, {
        key: 'save',
        value: function save() {
          // istanbul ignore next

          var _this4 = this;

          var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var toSave = this.beforeSave(null, opts);
          if (_.isEmpty(toSave)) {
            return this.$injector.get('$q')(function (resolve) {
              return resolve({ data: _this4 });
            });
          }
          var callback;
          if (opts.populate) {
            var dao = sl.getDao(name);
            callback = function () {
              return dao.getById(_this4._id, dao.query().populate(opts.populate));
            };
          } else {
            callback = function (data) {
              _this4.build(data.data);
              return data;
            };
          }

          if (this._id) {
            return this.$http.put(this.rootUrl + '/' + this._id, toSave).then(callback);
          } else {
            return this.$http.post(this.rootUrl, toSave).then(callback);
          }
        }
      }, {
        key: 'saveDeep',
        value: function saveDeep(populate) {
          // istanbul ignore next

          var _this5 = this;

          var promises = [];
          /** Find ref properties that might need to be saved */
          _.each(model, function (v, k) {
            if (_this5[k]) {
              if (_.isArray(v)) {
                if (v[0].ref) {
                  /** Array of nested Objects. Check if need to save each */
                  _this5[k].forEach(function (e) {
                    if (!e._id && e.saveDeep) promises.push(e.saveDeep());
                  });
                }
              } else if (v.ref) {
                /** Single nested object, save it if needed */
                if (!_this5[k]._id && _this5[k].saveDeep) promises.push(_this5[k].saveDeep());
              }
            }
          });
          var $q = this._injector.get('$q');
          return $q.all(promises).then(function () {
            return _this5.save(populate);
          });
        }
      }, {
        key: '$injector',
        get: function get() {
          return this._injector;
        },
        set: function set($injector) {
          this._injector = $injector;
        }
      }, {
        key: '$http',
        get: function get() {
          return this.$injector.get('$http');
        }
      }, {
        key: '$$pristine',
        get: function get() {
          return _.isEmpty(this.beforeSave());
        }
      }], [{
        key: 'getName',
        value: function getName() {
          return name;
        }
      }, {
        key: 'makePopObject',
        value: function makePopObject(pop) {
          return _.map(pop, function (p, k) {
            p = Array.isArray(p) ? p[0] : p;
            var ob = { path: k };
            var sub = ActiveRecord.findSubPopulates(p.ref);
            if (sub && sub.length) {
              ob.populate = sub;
            }
            return ob;
          });
        }
      }, {
        key: 'findSubPopulates',
        value: function findSubPopulates(ref) {
          var serviceLocator = _ServiceLocator2['default'].instance;
          var linkedModel = serviceLocator.getModel(ref);
          if (linkedModel && linkedModel !== model) {
            return linkedModel.populateParams();
          }
        }
      }, {
        key: 'populateParams',
        value: function populateParams(populateArray) {

          // Get from the model the fields that reference another object
          var pop = _.pickBy(model, function (v) {
            if (_.isArray(v)) return v[0].ref;
            return v.ref;
          });

          if (populateArray === 'all') {
            return ActiveRecord.makePopObject(pop);
          }
          var toPopulate = populateArray ? _.pickBy(pop, function (p, k) {
            return _.includes(populateArray, k);
          }) : _.pick(pop, function (v) {
            return v.populateDefault || v[0] && v[0].populateDefault;
          });
          return ActiveRecord.makePopObject(toPopulate);
        }
      }, {
        key: 'getModel',
        value: function getModel() {
          return model;
        }
      }, {
        key: 'getSession',
        value: function getSession() {
          return session;
        }
      }]);

      return ActiveRecord;
    })();

    return ActiveRecord;
  })();
}

module.exports = exports['default'];