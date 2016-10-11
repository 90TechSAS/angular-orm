(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//_ = require('lodash');
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
              if (_.isArray(field) && field[0].ref || field.ref) {
                if (_.isArray(field)) {
                  toSave = _this[key].map(function (entry) {
                    return typeof entry === 'string' ? entry : entry._id;
                  });
                } else {
                  toSave = typeof _this[key] === 'string' ? _this[key] : _this[key]._id;
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
              if (_this3[k]) {
                obj[k] = _this3[k];
              }
            });
          }
          /** Retrieve object saved in session to perform the diff */
          var old = session.retrieve(this._id) || {};

          _.each(model, function (field, key) {
            if (obj[key]) {
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
          var pop = _.pick(model, function (v) {
            if (_.isArray(v)) return v[0].ref;
            return v.ref;
          });

          if (populateArray === 'all') {
            return ActiveRecord.makePopObject(pop);
          }
          var toPopulate = populateArray ? _.pick(pop, function (p, k) {
            return _.contains(populateArray, k);
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
},{"./ServiceLocator":5,"./SessionManager":6,"deep-diff":14}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ServiceLocator = require('./ServiceLocator');

var _ServiceLocator2 = _interopRequireDefault(_ServiceLocator);

var DaoHelper = (function () {
    function DaoHelper() {
        _classCallCheck(this, DaoHelper);
    }

    _createClass(DaoHelper, null, [{
        key: 'getProvider',

        /**
         * Provides with a wrapper class to register a DAO in angular.
         * ex: myModule.provider('myDao', DaoHelper.getProvider(MyDAOClass))
         * @param GenericDao
         * @returns {$ES6_ANONYMOUS_CLASS$}
         */
        value: function getProvider(dao) {
            var sl = _ServiceLocator2['default'].instance;

            return (function () {
                function _class() {
                    _classCallCheck(this, _class);

                    this.dao = new dao();
                    sl.registerDao(this.dao.getModel().getName(), this.dao);
                }

                _createClass(_class, [{
                    key: 'setRootUrl',
                    value: function setRootUrl(url) {
                        this.dao.url = url;
                    }
                }, {
                    key: '$get',
                    value: function $get() {
                        return this.dao;
                    }
                }]);

                return _class;
            })();
        }
    }, {
        key: 'registerService',
        value: function registerService(module, name, dao) {
            module.provider(name, DaoHelper.getProvider(dao)).run([name, '$injector', function (service, $injector) {
                service.setInjector($injector);
            }]);
        }
    }]);

    return DaoHelper;
})();

exports['default'] = DaoHelper;
module.exports = exports['default'];
},{"./ServiceLocator":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = GenericDao;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ServiceLocator = require('./ServiceLocator');

var _ServiceLocator2 = _interopRequireDefault(_ServiceLocator);

var _QueryBuilder = require('./QueryBuilder');

var _QueryBuilder2 = _interopRequireDefault(_QueryBuilder);

function GenericDao(model, qb) {
    var sl = _ServiceLocator2['default'].instance;
    sl.registerModel(model.getName(), model);
    var myClass = (function () {
        function myClass(url) {
            _classCallCheck(this, myClass);

            //  this.$injector = $injector;
            //   this.$http     = $injector.get('$http');
            this.url = url;
            this.model = model;
        }

        _createClass(myClass, [{
            key: 'setInjector',
            value: function setInjector($injector) {
                this.$injector = $injector;
            }
        }, {
            key: 'getModel',
            value: function getModel() {
                return model;
            }
        }, {
            key: 'createModel',
            value: function createModel(options) {
                return this.create(options);
            }
        }, {
            key: 'query',
            value: function query(q) {
                return qb ? new qb(this, q) : new _QueryBuilder2['default'](this, q);
            }
        }, {
            key: 'get',
            value: function get() {
                // istanbul ignore next

                var _this = this;

                var qb = arguments.length <= 0 || arguments[0] === undefined ? this.query() : arguments[0];

                var self = this;
                return this.$http.get(this.url, { params: qb.opts }).then(function (data) {
                    return {
                        data: data.data.map(_this.build, _this), meta: { total: data.headers('X-Total-Count') }
                    };
                });
            }
        }, {
            key: 'count',
            value: function count() {
                var qb = arguments.length <= 0 || arguments[0] === undefined ? this.query() : arguments[0];

                var params = _.merge(qb.opts, { count: true });
                return this.$http.get(this.url, { params: params });
            }
        }, {
            key: 'build',
            value: function build(data) {
                if (!data) return;
                if (typeof data === 'string') {
                    return data;
                }
                if (Array.isArray(data)) {
                    return data.map(this.build, this);
                }
                return new model(this.$injector, this.url, data);
            }
        }, {
            key: 'post',
            value: function post() {
                // istanbul ignore next

                var _this2 = this;

                var qb = arguments.length <= 0 || arguments[0] === undefined ? this.query() : arguments[0];

                var options = _.clone(qb.opts) || {};
                var condition;
                switch (options.archived) {
                    case 'both':
                        condition = '(this.isArchived == false || this.isArchived == true) && (this.isDeleted == false)';
                        break;
                    case 'true':
                        condition = '(this.isArchived == true) && (this.isDeleted == false)';
                        break;
                    default:
                        condition = '(this.isArchived == false) && (this.isDeleted == false)';
                }
                _.set(options, ['conditions', '$where'], condition);
                return this.$http.post(this.url + '/filters', options).then(function (response) {
                    if (typeof response.data == 'number') {
                        return { meta: { total: response.headers('X-Total-Count') }, data: response.data };
                    } else {
                        return { meta: { total: response.headers('X-Total-Count') }, data: response.data.map(_this2.build, _this2) };
                    }
                });
            }
        }, {
            key: 'create',
            value: function create(params) {
                return new this.model(this.$injector, this.url, params);
            }
        }, {
            key: '$http',
            get: function get() {
                return this.$injector.get('$http');
            }
        }]);

        return myClass;
    })();

    function extractId(obj) {
        if (Array.isArray(obj)) return obj.map(extractId);
        if (typeof obj === 'string') return obj;
        /* TODO good idea ?
         if (!obj._id)
         throw 'Cannot find property id of object'; */
        return obj._id;
    }

    _.forIn(model.getModel(), function (value, key) {
        var v = Array.isArray(value) ? value[0] : value;
        if (key === '_id') {
            myClass.prototype['findById'] = myClass.prototype['getById'] = function (value) {
                // istanbul ignore next

                var _this3 = this;

                var qb = arguments.length <= 1 || arguments[1] === undefined ? this.query : arguments[1];

                return this.$http.get(this.url + '/' + value, { params: qb.opts }).then(function (data) {
                    return new model(_this3.$injector, _this3.url, data.data);
                });
            };
        } else {
            myClass.prototype['selectBy' + _.capitalize(key)] = function (toSelect) {
                // istanbul ignore next

                var _this4 = this;

                var qb = arguments.length <= 1 || arguments[1] === undefined ? this.query() : arguments[1];

                if (toSelect && toSelect.length) {
                    if (value.ref) {
                        toSelect = extractId(toSelect);
                    }
                    var obj = {};
                    if (typeof toSelect === 'string') {
                        obj[key] = toSelect;
                    } else if (Array.isArray(toSelect)) {
                        obj[key] = toSelect.length === 1 ? toSelect[0] : { $in: toSelect };
                    } else {
                        obj[key] = toSelect;
                    }
                    qb.setQuery(obj);
                }
                return this.$http.get(this.url, { params: qb.opts }).then(function (data) {

                    return {
                        data: data.data.map(_this4.build, _this4), meta: { total: data.headers('X-Total-Count') }
                    };
                });
            };
        }
        //myClass.prototype
    });

    return myClass;
}

module.exports = exports['default'];
},{"./QueryBuilder":4,"./ServiceLocator":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// istanbul ignore next

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var QueryBuilder = (function () {
  function QueryBuilder(dao) {
    var query = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, QueryBuilder);

    this.dao = dao;
    this.opts = query;
  }

  _createClass(QueryBuilder, [{
    key: 'setQuery',
    value: function setQuery(query) {
      this.opts = this.opts || {};
      this.opts.conditions = this.opts.conditions || {};
      _.merge(this.opts.conditions, _.cloneDeep(query));
    }
  }, {
    key: 'select',
    value: function select(ids) {
      var key = arguments.length <= 1 || arguments[1] === undefined ? '_id' : arguments[1];

      if (ids && ids.length) {
        var obj = {};
        var existing = _.get(this.opts, 'conditions.' + key);
        if (existing && typeof existing === 'string') {
          existing = { $in: [existing] };
        }
        var val = undefined;
        if (typeof ids === 'string') {
          val = ids;
          if (existing) {
            existing.$in.push(val);
          }
        } else if (ids.length === 1) {
          val = ids[0];
          if (existing) {
            existing.$in.push(val);
          }
        } else {
          val = { $in: ids };
          if (existing) {
            existing.$in = existing.$in.concat(ids);
          }
        }
        this.setQuery(_defineProperty({}, key, existing || val));
      }
      return this;
    }
  }, {
    key: 'populate',
    value: function populate(populateArray) {
      if (populateArray) {
        this.opts = this.opts || {};
        this.opts.populate = JSON.stringify(this.dao.getModel().populateParams(populateArray));
      }
      return this;
    }
  }, {
    key: 'archived',
    value: function archived(isArchived) {
      this.opts = this.opts || {};
      if (isArchived || _.isBoolean(isArchived)) {
        this.opts.archived = isArchived;
      }
      return this;
    }
  }, {
    key: 'deleted',
    value: function deleted(isDeleted) {
      this.opts = this.opts || {};
      if (isDeleted || _.isBoolean(isDeleted)) {
        this.opts.deleted = isDeleted;
      }
      return this;
    }
  }, {
    key: 'paginate',
    value: function paginate(pagination) {
      this.opts = this.opts || {};
      if (pagination) {
        this.opts = _.merge(this.opts, pagination);
      }
      return this;
    }
  }, {
    key: 'limit',
    value: function limit(_limit) {
      this.opts = this.opts || {};
      if (_limit) {
        this.opts.limit = _limit;
      }
      return this;
    }
  }, {
    key: 'sort',
    value: function sort(sortField) {
      this.opts = this.opts || {};
      if (sortField) {
        this.opts = _.merge(this.opts, { sort: sortField });
      }
      return this;
    }
  }, {
    key: 'fields',
    value: function fields(fieldsList) {
      var opts = this.opts || {};
      if (fieldsList) {
        if (_.isArray(fieldsList)) {
          fieldsList = fieldsList.join(' ');
        }
        opts.select = fieldsList;
      }
      return this;
    }
  }, {
    key: 'search',
    value: function search(term) {
      var field = arguments.length <= 1 || arguments[1] === undefined ? 'name' : arguments[1];

      if (term) {
        if (Array.isArray(field)) {
          var q = {
            $or: field.map(function (element) {
              return _defineProperty({}, element, {
                $regex: '.*' + term + '.*',
                $options: 'i'
              });
            })
          };
          this.setQuery(q);
        } else {
          this.setQuery(_defineProperty({}, field, { $regex: '.*' + term + '.*', $options: 'i' }));
        }
      }
      return this;
    }
  }]);

  return QueryBuilder;
})();

exports['default'] = QueryBuilder;
module.exports = exports['default'];
},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var singleton = Symbol();
var singletonEnforcer = Symbol();

/**
   At the moment, only used to register and find back models
    (to use in populate operations)
    Could be used for DI in the futur.
 **/

var ServiceLocator = (function () {
    function ServiceLocator(enforcer) {
        _classCallCheck(this, ServiceLocator);

        if (enforcer !== singletonEnforcer) {
            throw "Cannot construct singleton";
        }
        // TODO Maybe a separate class (no need for now)
        this.modelRegistry = {};
        this.daoRegistry = {};
    }

    _createClass(ServiceLocator, [{
        key: "getModel",
        value: function getModel(name) {
            return this.modelRegistry[name];
        }
    }, {
        key: "getDao",
        value: function getDao(name) {
            return this.daoRegistry[name];
        }
    }, {
        key: "registerDao",
        value: function registerDao(name, dao) {
            this.daoRegistry[name] = dao;
        }
    }, {
        key: "registerModel",
        value: function registerModel(name, model) {
            this.modelRegistry[name] = model;
        }
    }], [{
        key: "instance",
        get: function get() {
            if (!this[singleton]) {
                this[singleton] = new ServiceLocator(singletonEnforcer);
            }
            return this[singleton];
        }
    }]);

    return ServiceLocator;
})();

exports["default"] = ServiceLocator;
module.exports = exports["default"];
},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = SessionManager;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ServiceLocator = require('./ServiceLocator');

var _ServiceLocator2 = _interopRequireDefault(_ServiceLocator);

function SessionManager(model) {

  var SessionManager = (function () {
    function SessionManager() {
      _classCallCheck(this, SessionManager);

      this.storage = {};
    }

    _createClass(SessionManager, [{
      key: 'save',
      value: function save(obj) {
        if (!obj._id) return;
        this.storage[obj._id] = obj;
      }
    }, {
      key: 'retrieve',
      value: function retrieve(id) {
        return this.storage[id];
      }
    }, {
      key: 'clean',
      value: function clean() {
        this.storage = {};
      }
    }, {
      key: 'model',
      get: function get() {
        return model;
      }
    }]);

    return SessionManager;
  })();
  return SessionManager;
}

module.exports = exports['default'];
},{"./ServiceLocator":5}],7:[function(require,module,exports){
'use strict';

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _DaoHelper = require('./DaoHelper');

var _DaoHelper2 = _interopRequireDefault(_DaoHelper);

var _managersTstManager1 = require('./managers/tstManager1');

var _managersTstManager12 = _interopRequireDefault(_managersTstManager1);

var _managersTstManager2 = require('./managers/tstManager2');

var _managersTstManager22 = _interopRequireDefault(_managersTstManager2);

var _managersTstManager3 = require('./managers/tstManager3');

var _managersTstManager32 = _interopRequireDefault(_managersTstManager3);

var _module = angular.module('tstModule', []);

_DaoHelper2['default'].registerService(_module, 'ModelManager', _managersTstManager12['default']);
_DaoHelper2['default'].registerService(_module, 'ModelManager2', _managersTstManager22['default']);
_DaoHelper2['default'].registerService(_module, 'ModelManager3', _managersTstManager32['default']);
},{"./DaoHelper":2,"./managers/tstManager1":8,"./managers/tstManager2":9,"./managers/tstManager3":10}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
// istanbul ignore next

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// istanbul ignore next

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _modelsTstModel1Js = require('./../models/tstModel1.js');

var _modelsTstModel1Js2 = _interopRequireDefault(_modelsTstModel1Js);

var _GenericDao = require('../GenericDao');

var _GenericDao2 = _interopRequireDefault(_GenericDao);

var _QueryBuilder = require('../QueryBuilder');

var _QueryBuilder2 = _interopRequireDefault(_QueryBuilder);

var DAO = (0, _GenericDao2['default'])(_modelsTstModel1Js2['default']);

var ModelManager = (function (_DAO) {
  _inherits(ModelManager, _DAO);

  function ModelManager() {
    _classCallCheck(this, ModelManager);

    _get(Object.getPrototypeOf(ModelManager.prototype), 'constructor', this).apply(this, arguments);
  }

  return ModelManager;
})(DAO);

exports['default'] = ModelManager;
;
module.exports = exports['default'];
},{"../GenericDao":3,"../QueryBuilder":4,"./../models/tstModel1.js":11}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
// istanbul ignore next

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// istanbul ignore next

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _modelsTstModel2Js = require('./../models/tstModel2.js');

var _modelsTstModel2Js2 = _interopRequireDefault(_modelsTstModel2Js);

var _GenericDao = require('../GenericDao');

var _GenericDao2 = _interopRequireDefault(_GenericDao);

var _QueryBuilder = require('../QueryBuilder');

var _QueryBuilder2 = _interopRequireDefault(_QueryBuilder);

var DAO = (0, _GenericDao2['default'])(_modelsTstModel2Js2['default']);

var ModelManager2 = (function (_DAO) {
  _inherits(ModelManager2, _DAO);

  function ModelManager2() {
    _classCallCheck(this, ModelManager2);

    _get(Object.getPrototypeOf(ModelManager2.prototype), 'constructor', this).apply(this, arguments);
  }

  return ModelManager2;
})(DAO);

exports['default'] = ModelManager2;
;
module.exports = exports['default'];
},{"../GenericDao":3,"../QueryBuilder":4,"./../models/tstModel2.js":12}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
// istanbul ignore next

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// istanbul ignore next

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _modelsTstModel3Js = require('./../models/tstModel3.js');

var _modelsTstModel3Js2 = _interopRequireDefault(_modelsTstModel3Js);

var _GenericDao = require('../GenericDao');

var _GenericDao2 = _interopRequireDefault(_GenericDao);

var _QueryBuilder = require('../QueryBuilder');

var _QueryBuilder2 = _interopRequireDefault(_QueryBuilder);

var DAO = (0, _GenericDao2['default'])(_modelsTstModel3Js2['default']);

var ModelManager3 = (function (_DAO) {
  _inherits(ModelManager3, _DAO);

  function ModelManager3() {
    _classCallCheck(this, ModelManager3);

    _get(Object.getPrototypeOf(ModelManager3.prototype), 'constructor', this).apply(this, arguments);
  }

  return ModelManager3;
})(DAO);

exports['default'] = ModelManager3;
;
module.exports = exports['default'];
},{"../GenericDao":3,"../QueryBuilder":4,"./../models/tstModel3.js":13}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
// istanbul ignore next

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// istanbul ignore next

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ActiveRecord = require('../ActiveRecord');

var _ActiveRecord2 = _interopRequireDefault(_ActiveRecord);

var model = {

    _id: {
        type: String,
        unique: true
    },

    //private: true
    when: Date,

    label: String,

    num: Number,

    models2: [{
        type: String,
        ref: 'Model2'
    }],

    model2: {
        type: String,
        ref: 'Model2'
    },

    model3: {
        ref: 'Model3',
        nested: true
    },

    models3: [{
        ref: 'Model3',
        nested: true
    }]
};

var AR = (0, _ActiveRecord2['default'])(model, 'Model1');

var Model = (function (_AR) {
    _inherits(Model, _AR);

    function Model() {
        _classCallCheck(this, Model);

        _get(Object.getPrototypeOf(Model.prototype), 'constructor', this).apply(this, arguments);
    }

    return Model;
})(AR);

exports['default'] = Model;
module.exports = exports['default'];
},{"../ActiveRecord":1}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
// istanbul ignore next

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// istanbul ignore next

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ActiveRecord = require('../ActiveRecord');

var _ActiveRecord2 = _interopRequireDefault(_ActiveRecord);

var model = {

    _id: {
        type: String,
        unique: true
    },

    //private: true
    name: String
};

var AR = (0, _ActiveRecord2['default'])(model, 'Model2');

var Model2 = (function (_AR) {
    _inherits(Model2, _AR);

    function Model2() {
        _classCallCheck(this, Model2);

        _get(Object.getPrototypeOf(Model2.prototype), 'constructor', this).apply(this, arguments);
    }

    return Model2;
})(AR);

exports['default'] = Model2;
module.exports = exports['default'];
},{"../ActiveRecord":1}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
// istanbul ignore next

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// istanbul ignore next

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ActiveRecord = require('../ActiveRecord');

var _ActiveRecord2 = _interopRequireDefault(_ActiveRecord);

var model = {

    _id: {
        type: String,
        unique: true
    },

    //private: true
    name: String
};

var AR = (0, _ActiveRecord2['default'])(model, 'Model3');

var Model3 = (function (_AR) {
    _inherits(Model3, _AR);

    function Model3() {
        _classCallCheck(this, Model3);

        _get(Object.getPrototypeOf(Model3.prototype), 'constructor', this).apply(this, arguments);
    }

    return Model3;
})(AR);

exports['default'] = Model3;
module.exports = exports['default'];
},{"../ActiveRecord":1}],14:[function(require,module,exports){
(function (global){
/*!
 * deep-diff.
 * Licensed under the MIT License.
 */
;(function(root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function() {
      return factory();
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.DeepDiff = factory();
  }
}(this, function(undefined) {
  'use strict';

  var $scope, conflict, conflictResolution = [];
  if (typeof global === 'object' && global) {
    $scope = global;
  } else if (typeof window !== 'undefined') {
    $scope = window;
  } else {
    $scope = {};
  }
  conflict = $scope.DeepDiff;
  if (conflict) {
    conflictResolution.push(
      function() {
        if ('undefined' !== typeof conflict && $scope.DeepDiff === accumulateDiff) {
          $scope.DeepDiff = conflict;
          conflict = undefined;
        }
      });
  }

  // nodejs compatible on server side and in the browser.
  function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  }

  function Diff(kind, path) {
    Object.defineProperty(this, 'kind', {
      value: kind,
      enumerable: true
    });
    if (path && path.length) {
      Object.defineProperty(this, 'path', {
        value: path,
        enumerable: true
      });
    }
  }

  function DiffEdit(path, origin, value) {
    DiffEdit.super_.call(this, 'E', path);
    Object.defineProperty(this, 'lhs', {
      value: origin,
      enumerable: true
    });
    Object.defineProperty(this, 'rhs', {
      value: value,
      enumerable: true
    });
  }
  inherits(DiffEdit, Diff);

  function DiffNew(path, value) {
    DiffNew.super_.call(this, 'N', path);
    Object.defineProperty(this, 'rhs', {
      value: value,
      enumerable: true
    });
  }
  inherits(DiffNew, Diff);

  function DiffDeleted(path, value) {
    DiffDeleted.super_.call(this, 'D', path);
    Object.defineProperty(this, 'lhs', {
      value: value,
      enumerable: true
    });
  }
  inherits(DiffDeleted, Diff);

  function DiffArray(path, index, item) {
    DiffArray.super_.call(this, 'A', path);
    Object.defineProperty(this, 'index', {
      value: index,
      enumerable: true
    });
    Object.defineProperty(this, 'item', {
      value: item,
      enumerable: true
    });
  }
  inherits(DiffArray, Diff);

  function arrayRemove(arr, from, to) {
    var rest = arr.slice((to || from) + 1 || arr.length);
    arr.length = from < 0 ? arr.length + from : from;
    arr.push.apply(arr, rest);
    return arr;
  }

  function realTypeOf(subject) {
    var type = typeof subject;
    if (type !== 'object') {
      return type;
    }

    if (subject === Math) {
      return 'math';
    } else if (subject === null) {
      return 'null';
    } else if (Array.isArray(subject)) {
      return 'array';
    } else if (Object.prototype.toString.call(subject) === '[object Date]') {
      return 'date';
    } else if (typeof subject.toString !== 'undefined' && /^\/.*\//.test(subject.toString())) {
      return 'regexp';
    }
    return 'object';
  }

  function deepDiff(lhs, rhs, changes, prefilter, path, key, stack) {
    path = path || [];
    var currentPath = path.slice(0);
    if (typeof key !== 'undefined') {
      if (prefilter) {
        if (typeof(prefilter) === 'function' && prefilter(currentPath, key)) { return; }
        else if (typeof(prefilter) === 'object') {
          if (prefilter.prefilter && prefilter.prefilter(currentPath, key)) { return; }
          if (prefilter.normalize) {
            var alt = prefilter.normalize(currentPath, key, lhs, rhs);
            if (alt) {
              lhs = alt[0];
              rhs = alt[1];
            }
          }
        }
      }
      currentPath.push(key);
    }

    // Use string comparison for regexes
    if (realTypeOf(lhs) === 'regexp' && realTypeOf(rhs) === 'regexp') {
      lhs = lhs.toString();
      rhs = rhs.toString();
    }

    var ltype = typeof lhs;
    var rtype = typeof rhs;
    if (ltype === 'undefined') {
      if (rtype !== 'undefined') {
        changes(new DiffNew(currentPath, rhs));
      }
    } else if (rtype === 'undefined') {
      changes(new DiffDeleted(currentPath, lhs));
    } else if (realTypeOf(lhs) !== realTypeOf(rhs)) {
      changes(new DiffEdit(currentPath, lhs, rhs));
    } else if (Object.prototype.toString.call(lhs) === '[object Date]' && Object.prototype.toString.call(rhs) === '[object Date]' && ((lhs - rhs) !== 0)) {
      changes(new DiffEdit(currentPath, lhs, rhs));
    } else if (ltype === 'object' && lhs !== null && rhs !== null) {
      stack = stack || [];
      if (stack.indexOf(lhs) < 0) {
        stack.push(lhs);
        if (Array.isArray(lhs)) {
          var i, len = lhs.length;
          for (i = 0; i < lhs.length; i++) {
            if (i >= rhs.length) {
              changes(new DiffArray(currentPath, i, new DiffDeleted(undefined, lhs[i])));
            } else {
              deepDiff(lhs[i], rhs[i], changes, prefilter, currentPath, i, stack);
            }
          }
          while (i < rhs.length) {
            changes(new DiffArray(currentPath, i, new DiffNew(undefined, rhs[i++])));
          }
        } else {
          var akeys = Object.keys(lhs);
          var pkeys = Object.keys(rhs);
          akeys.forEach(function(k, i) {
            var other = pkeys.indexOf(k);
            if (other >= 0) {
              deepDiff(lhs[k], rhs[k], changes, prefilter, currentPath, k, stack);
              pkeys = arrayRemove(pkeys, other);
            } else {
              deepDiff(lhs[k], undefined, changes, prefilter, currentPath, k, stack);
            }
          });
          pkeys.forEach(function(k) {
            deepDiff(undefined, rhs[k], changes, prefilter, currentPath, k, stack);
          });
        }
        stack.length = stack.length - 1;
      }
    } else if (lhs !== rhs) {
      if (!(ltype === 'number' && isNaN(lhs) && isNaN(rhs))) {
        changes(new DiffEdit(currentPath, lhs, rhs));
      }
    }
  }

  function accumulateDiff(lhs, rhs, prefilter, accum) {
    accum = accum || [];
    deepDiff(lhs, rhs,
      function(diff) {
        if (diff) {
          accum.push(diff);
        }
      },
      prefilter);
    return (accum.length) ? accum : undefined;
  }

  function applyArrayChange(arr, index, change) {
    if (change.path && change.path.length) {
      var it = arr[index],
          i, u = change.path.length - 1;
      for (i = 0; i < u; i++) {
        it = it[change.path[i]];
      }
      switch (change.kind) {
        case 'A':
          applyArrayChange(it[change.path[i]], change.index, change.item);
          break;
        case 'D':
          delete it[change.path[i]];
          break;
        case 'E':
        case 'N':
          it[change.path[i]] = change.rhs;
          break;
      }
    } else {
      switch (change.kind) {
        case 'A':
          applyArrayChange(arr[index], change.index, change.item);
          break;
        case 'D':
          arr = arrayRemove(arr, index);
          break;
        case 'E':
        case 'N':
          arr[index] = change.rhs;
          break;
      }
    }
    return arr;
  }

  function applyChange(target, source, change) {
    if (target && source && change && change.kind) {
      var it = target,
          i = -1,
          last = change.path ? change.path.length - 1 : 0;
      while (++i < last) {
        if (typeof it[change.path[i]] === 'undefined') {
          it[change.path[i]] = (typeof change.path[i] === 'number') ? [] : {};
        }
        it = it[change.path[i]];
      }
      switch (change.kind) {
        case 'A':
          applyArrayChange(change.path ? it[change.path[i]] : it, change.index, change.item);
          break;
        case 'D':
          delete it[change.path[i]];
          break;
        case 'E':
        case 'N':
          it[change.path[i]] = change.rhs;
          break;
      }
    }
  }

  function revertArrayChange(arr, index, change) {
    if (change.path && change.path.length) {
      // the structure of the object at the index has changed...
      var it = arr[index],
          i, u = change.path.length - 1;
      for (i = 0; i < u; i++) {
        it = it[change.path[i]];
      }
      switch (change.kind) {
        case 'A':
          revertArrayChange(it[change.path[i]], change.index, change.item);
          break;
        case 'D':
          it[change.path[i]] = change.lhs;
          break;
        case 'E':
          it[change.path[i]] = change.lhs;
          break;
        case 'N':
          delete it[change.path[i]];
          break;
      }
    } else {
      // the array item is different...
      switch (change.kind) {
        case 'A':
          revertArrayChange(arr[index], change.index, change.item);
          break;
        case 'D':
          arr[index] = change.lhs;
          break;
        case 'E':
          arr[index] = change.lhs;
          break;
        case 'N':
          arr = arrayRemove(arr, index);
          break;
      }
    }
    return arr;
  }

  function revertChange(target, source, change) {
    if (target && source && change && change.kind) {
      var it = target,
          i, u;
      u = change.path.length - 1;
      for (i = 0; i < u; i++) {
        if (typeof it[change.path[i]] === 'undefined') {
          it[change.path[i]] = {};
        }
        it = it[change.path[i]];
      }
      switch (change.kind) {
        case 'A':
          // Array was modified...
          // it will be an array...
          revertArrayChange(it[change.path[i]], change.index, change.item);
          break;
        case 'D':
          // Item was deleted...
          it[change.path[i]] = change.lhs;
          break;
        case 'E':
          // Item was edited...
          it[change.path[i]] = change.lhs;
          break;
        case 'N':
          // Item is new...
          delete it[change.path[i]];
          break;
      }
    }
  }

  function applyDiff(target, source, filter) {
    if (target && source) {
      var onChange = function(change) {
        if (!filter || filter(target, source, change)) {
          applyChange(target, source, change);
        }
      };
      deepDiff(target, source, onChange);
    }
  }

  Object.defineProperties(accumulateDiff, {

    diff: {
      value: accumulateDiff,
      enumerable: true
    },
    observableDiff: {
      value: deepDiff,
      enumerable: true
    },
    applyDiff: {
      value: applyDiff,
      enumerable: true
    },
    applyChange: {
      value: applyChange,
      enumerable: true
    },
    revertChange: {
      value: revertChange,
      enumerable: true
    },
    isConflict: {
      value: function() {
        return 'undefined' !== typeof conflict;
      },
      enumerable: true
    },
    noConflict: {
      value: function() {
        if (conflictResolution) {
          conflictResolution.forEach(function(it) {
            it();
          });
          conflictResolution = null;
        }
        return accumulateDiff;
      },
      enumerable: true
    }
  });

  return accumulateDiff;
}));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[7]);
