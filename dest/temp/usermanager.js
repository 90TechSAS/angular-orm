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
        key: 'getList',
        value: function getList() {
            var self = this;
            return this.$http.get(this.rootUrl).then(function (data) {
                return _.map(data.data, function (user) {
                    return new _user2['default'](self.$http, self.rootUrl, user);
                });
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
        value: function $get($http) {
            return new UserManager($http, this.rootUrl);
        }
    }]);

    return UserManagerProvider;
})();

angular.module('90Tech.user-manager', []).provider('UserManager', UserManagerProvider);