(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
'use strict';

// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var UserManager = (function () {
    function UserManager($http, url) {
        _classCallCheck(this, UserManager);

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
                    $or: {
                        firstname: { $regex: '.*' + query + '.*', $options: 'i' },
                        lastname: { $regex: '.*' + query + '.*', $options: 'i' }
                    }
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
})();

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
},{"./user":1}]},{},[2]);
