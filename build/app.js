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

/**
 *
 * Can be inherited or used as is. Holds the model definition,
 * Generates populate parameters.
 * Provides several helper methods
 *
 * @param Object Mongoose Style Model
 * @param String Name of the Model (must be the same as described in 'ref' of others models relations.
 * @returns {$ES6_CLASS$}
 */

function ActiveRecord(model, name) {
    var sl = _ServiceLocator2['default'].instance;
    var ActiveRecord = (function () {
        function ActiveRecord($injector, rootUrl, options) {
            _classCallCheck(this, ActiveRecord);

            this.$injector = $injector;
            //  this.$http     = $injector.get('$http');
            this.rootUrl = rootUrl;
            this.build(options);
        }

        _createClass(ActiveRecord, [{
            key: 'build',
            value: function build(options) {
                // istanbul ignore next

                var _this = this;

                _.each(model, function (field, key) {
                    if (options && (options[key] || options[key] === 0)) {
                        var name = _.isArray(field) ? field[0].ref : field.ref;
                        var dao = sl.getDao(name);
                        if (dao) {
                            if (!_this[key] || typeof _this[key] === 'string' || typeof options[key] === 'object') {
                                // If new object contains unpopulated fields, but previous object had the info, don't delete it.
                                // Happens a lot during savings, since you can't specify populates on save.
                                _this[key] = dao.build(_.clone(options[key]));
                            }
                        } else {
                            _this[key] = _this.buildField(field, options[key]);
                        }
                    } else if (_.isArray(field)) {
                        _this[key] = [];
                    }
                });
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
                var $q = this.$injector.get('$q');
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
                obj = obj || _.cloneDeep(this);
                _.each(model, function (field, key) {
                    if (obj[key] && (field.ref || _.isArray(field) && field[0].ref)) {

                        if (_.isArray(obj[key])) {
                            obj[key] = _.compact(obj[key].map(function (val) {
                                if (typeof val === 'object') {
                                    return field.nested ? val : val._id;
                                } else if (typeof val === 'string') {
                                    return val;
                                }
                            }));
                        } else {
                            obj[key] = obj[key]._id || obj[key];
                        }
                    } else if (obj[key] && (field.type === Date || _.isArray(field) && field[0].type === Date)) {
                        obj[key] = new Date(moment(obj[key])).toISOString();
                    }
                });
                return obj;
            }
        }, {
            key: 'save',
            value: function save(populate) {
                // istanbul ignore next

                var _this2 = this;

                var toSave = this.beforeSave();
                var callback;
                if (populate) {
                    var dao = sl.getDao(name);
                    callback = function () {
                        return dao.getById(_this2._id, dao.query().populate(populate));
                    };
                } else {
                    callback = function (data) {
                        _this2.build(data.data);
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
        }]);

        return ActiveRecord;
    })();
    //   sl.registerModel(name, ActiveRecord);
    return ActiveRecord;
}

module.exports = exports['default'];
},{"./ServiceLocator":5}],2:[function(require,module,exports){
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

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _DaoHelper = require('./DaoHelper');

var _DaoHelper2 = _interopRequireDefault(_DaoHelper);

var _managersTstManager1 = require('./managers/tstManager1');

var _managersTstManager12 = _interopRequireDefault(_managersTstManager1);

var _managersTstManager2 = require('./managers/tstManager2');

var _managersTstManager22 = _interopRequireDefault(_managersTstManager2);

var _module = angular.module('tstModule', []);

_DaoHelper2['default'].registerService(_module, 'ModelManager', _managersTstManager12['default']);
_DaoHelper2['default'].registerService(_module, 'ModelManager2', _managersTstManager22['default']);
},{"./DaoHelper":2,"./managers/tstManager1":7,"./managers/tstManager2":8}],7:[function(require,module,exports){
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
},{"../GenericDao":3,"../QueryBuilder":4,"./../models/tstModel1.js":9}],8:[function(require,module,exports){
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
},{"../GenericDao":3,"../QueryBuilder":4,"./../models/tstModel2.js":10}],9:[function(require,module,exports){
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
    label: String,

    num: Number,

    models2: [{
        type: String,
        ref: 'Model2'
    }],

    model2: {
        type: String,
        ref: 'Model2'
    }
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
},{"../ActiveRecord":1}],10:[function(require,module,exports){
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
    Name: String
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
},{"../ActiveRecord":1}]},{},[6]);
