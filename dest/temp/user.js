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
            return [{ field: '_id', type: 'string' }, { field: '__v', type: 'int' }, { field: 'createdAt', type: 'datetime' }, { field: 'email', type: 'string' }, { field: 'firstname', type: 'string' }, { field: 'lastname', type: 'string' }, { field: 'isArchived', type: 'boolean' }, { field: 'windowsDevices', type: 'array' }, { field: 'iOSDevices', type: 'array' }, { field: 'androidDevices', type: 'array' }, { field: 'companies', type: 'array' }, { field: 'recoveryEmails', type: '[]' }, { field: 'id', type: 'string' }];
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