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
        value: function $get($http) {
            return new UserManager($http, this.rootUrl);
        }
    }]);

    return UserManagerProvider;
})();

angular.module('90Tech.user-manager', []).provider('UserManager', UserManagerProvider);