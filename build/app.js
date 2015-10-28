(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

'user strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var GenericDao = (function () {
    function GenericDao($http, url) {
        _classCallCheck(this, GenericDao);

        this.$http = $http;
        this.url = url;
    }

    _createClass(GenericDao, [{
        key: 'setQuery',
        value: function setQuery(query) {
            this.opts = this.opts || {};
            this.opts.conditions = this.opts.conditions || {};
            _.merge(this.opts.conditions, query);
        }
    }, {
        key: 'select',
        value: function select(ids, key) {
            var k = key || '_id';
            if (ids && ids.length) {
                var obj = {};
                obj[k] = { $in: ids };
                this.setQuery(obj);
            }
            return this;
        }
    }, {
        key: 'populate',
        value: function populate(populateArray) {
            if (populateArray) {
                this.opts = this.opts || {};
                this.opts.populate = JSON.stringify(populateArray);
            }
            return this;
        }
    }, {
        key: 'archived',
        value: function archived(isArchived) {
            this.opts = this.opts || {};
            if (isArchived) {
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
        key: 'sort',
        value: function sort(sortField) {
            this.opts = this.opts || {};
            if (sortField) {
                this.opts = _.merge(this.opts, { sort: sortField });
            }
            return this;
        }
    }, {
        key: 'search',
        value: function search(term) {
            if (term) {
                this.setQuery({
                    $or: [{ firstname: { $regex: '.*' + term + '.*', $options: 'i' } }, { lastname: { $regex: '.*' + term + '.*', $options: 'i' } }]
                });
            }
            return this;
        }
    }, {
        key: 'get',
        value: function get() {
            var self = this;
            return this.$http.get(this.rootUrl, { params: this.opts }).then(function (data) {
                delete this.opts;
                return {
                    data: _.map(data.data, function (user) {
                        return new User(self.$http, self.rootUrl, user);
                    }), meta: { total: data.headers('X-Total-Count') }
                };
            });
        }
    }]);

    return GenericDao;
})();

exports['default'] = GenericDao;
module.exports = exports['default'];
},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var User = (function () {
    _createClass(User, null, [{
        key: 'getModel',
        value: function getModel() {
            return [{ field: '_id', type: 'string' }, { field: '__v', type: 'int' }, { field: 'createdAt', type: 'datetime' }, { field: 'email', type: 'string' }, { field: 'firstname', type: 'string' }, { field: 'lastname', type: 'string' }, { field: 'isArchived', type: 'boolean' }, { field: 'windowsDevices', type: 'array' }, { field: 'iOSDevices', type: 'array' }, { field: 'androidDevices', type: 'array' }, { field: 'companies', type: 'array' }, { field: 'recoveryEmails', type: 'array' }, { field: 'permissions', type: 'array' }, { field: 'id', type: 'string' }];
        }
    }]);

    function User($http, rootUrl, options) {
        // istanbul ignore next

        var _this = this;

        _classCallCheck(this, User);

        this.$http = $http;
        this.rootUrl = rootUrl;
        _.each(User.getModel(), function (field) {
            if (options && options[field.field]) {
                _this[field.field] = _.clone(options[field.field]);
            } else if (field.type === 'array') {
                _this[field.field] = [];
            }
        });
    }

    _createClass(User, [{
        key: 'save',
        value: function save() {
            if (this._id) {
                return this.$http.put(this.rootUrl + '/' + this._id, this);
            } else {
                return this.$http.post(this.rootUrl, this);
            }
        }
    }]);

    return User;
})();

exports['default'] = User;
module.exports = exports['default'];
},{}],3:[function(require,module,exports){
'use strict';

// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// istanbul ignore next

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// istanbul ignore next

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _GenericDao2 = require('./GenericDao');

var _GenericDao3 = _interopRequireDefault(_GenericDao2);

var UserManager = (function (_GenericDao) {
    _inherits(UserManager, _GenericDao);

    function UserManager($http, url) {
        _classCallCheck(this, UserManager);

        _get(Object.getPrototypeOf(UserManager.prototype), 'constructor', this).call(this, $http, url);
        this.$http = $http;
        this.rootUrl = url;
    }

    _createClass(UserManager, [{
        key: 'getNew',
        value: function getNew() {
            return new _user2['default'](this.$http, this.rootUrl);
        }
    }, {
        key: 'getList',
        value: function getList(params) {
            var self = this;
            return this.$http.get(this.rootUrl, { params: params }).then(function (data) {
                return {
                    data: _.map(data.data, function (user) {
                        return new _user2['default'](self.$http, self.rootUrl, user);
                    }), meta: { total: data.headers('X-Total-Count') }
                };
            });
        }
    }, {
        key: 'getById',
        value: function getById(id, populate) {
            var self = this;
            var params = null;
            if (populate) {
                params = { params: { populate: populate } };
            }
            return this.$http.get(this.rootUrl + '/' + id, params).then(function (data) {
                return new _user2['default'](self.$http, self.rootUrl, data.data);
            });
        }
    }, {
        key: 'searchByName',
        value: function searchByName(query) {
            var self = this;
            var params = {
                conditions: {
                    $or: [{ firstname: { $regex: '.*' + query + '.*', $options: 'i' } }, { lastname: { $regex: '.*' + query + '.*', $options: 'i' } }]
                }
            };
            return this.$http.get(this.rootUrl, { params: params }).then(function (data) {
                return {
                    data: _.map(data.data, function (user) {
                        return new _user2['default'](self.$http, self.rootUrl, user);
                    }), meta: { total: data.headers('X-Total-Count') }
                };
            });
        }
    }, {
        key: 'getProfile',
        value: function getProfile() {
            return this.$http.get(this.rootUrl + '/profile');
        }
    }]);

    return UserManager;
})(_GenericDao3['default']);

var UserManagerProvider = (function () {
    function UserManagerProvider() {
        _classCallCheck(this, UserManagerProvider);
    }

    _createClass(UserManagerProvider, [{
        key: 'setRootUrl',
        value: function setRootUrl(url) {
            this.rootUrl = url;
        }

        /*@ngInject*/
    }, {
        key: '$get',
        value: ["$http", function $get($http) {
            return new UserManager($http, this.rootUrl);
        }]
    }]);

    return UserManagerProvider;
})();

angular.module('90Tech.user-manager', []).provider('UserManager', UserManagerProvider);
},{"./GenericDao":1,"./user":2}]},{},[3]);
