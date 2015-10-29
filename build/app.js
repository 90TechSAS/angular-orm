(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ActiveRecord = (function () {
    function ActiveRecord($injector, rootUrl, options, model) {
        // istanbul ignore next

        var _this = this;

        _classCallCheck(this, ActiveRecord);

        this.$injector = $injector;
        this.$http = $injector.get('$http');
        this.rootUrl = rootUrl;
        _.each(this.model, function (field, key) {
            if (options && options[key]) {
                _this[key] = _.clone(options[key]);
            } else if (_.isArray(field)) {
                _this[key] = [];
            }
        });
    }

    _createClass(ActiveRecord, [{
        key: 'save',
        value: function save() {
            if (this._id) {
                return this.$http.put(this.rootUrl + '/' + this._id, this);
            } else {
                return this.$http.post(this.rootUrl, this);
            }
        }
    }]);

    return ActiveRecord;
})();

exports['default'] = ActiveRecord;
module.exports = exports['default'];
},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DaoHelper = (function () {
    function DaoHelper() {
        _classCallCheck(this, DaoHelper);
    }

    _createClass(DaoHelper, null, [{
        key: "getProvider",

        /**
         * Provides with a wrapper class to register a DAO in angular.
         * ex: myModule.provider('myDao', DaoHelper.getProvider(MyDAOClass))
         * @param GenericDao
         * @returns {$ES6_ANONYMOUS_CLASS$}
         */
        value: function getProvider(dao) {
            return (function () {
                function _class() {
                    _classCallCheck(this, _class);
                }

                _createClass(_class, [{
                    key: "setRootUrl",
                    value: function setRootUrl(url) {
                        this.rootUrl = url;
                    }

                    /*@ngInject*/
                }, {
                    key: "$get",
                    value: ["$injector", function $get($injector) {
                        return new dao($injector, this.rootUrl);
                    }]
                }]);

                return _class;
            })();
        }
    }]);

    return DaoHelper;
})();

exports["default"] = DaoHelper;
module.exports = exports["default"];
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = GenericDao;
// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function GenericDao(model) {

    return (function () {
        function _class($injector, url) {
            _classCallCheck(this, _class);

            this.$injector = $injector;
            this.$http = $injector.get('$http');
            this.url = url;
            this.model = model;
        }

        _createClass(_class, [{
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
                return this.$http.get(this.url, { params: this.opts }).then(function (data) {
                    delete self.opts;
                    return {
                        data: _.map(data.data, function (d) {
                            return new self.model(self.$injector, self.url, d);
                        }), meta: { total: data.headers('X-Total-Count') }
                    };
                });
            }
        }, {
            key: 'getById',
            value: function getById(id) {
                var self = this;
                var params = null;
                if (this.opts && this.opts.populate) {
                    params = { params: { populate: populate } };
                }
                return this.$http.get(this.url + '/' + id, params).then(function (data) {
                    delete self.opts;
                    return new User(self.$http, self.url, data.data);
                });
            }
        }, {
            key: 'create',
            value: function create(params) {
                return new this.model(this.$injector, this.url, params);
            }
        }]);

        return _class;
    })();
}

module.exports = exports['default'];
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
// istanbul ignore next

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// istanbul ignore next

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ActiveRecord2 = require('./ActiveRecord');

var _ActiveRecord3 = _interopRequireDefault(_ActiveRecord2);

var User = (function (_ActiveRecord) {
    _inherits(User, _ActiveRecord);

    function User() {
        _classCallCheck(this, User);

        _get(Object.getPrototypeOf(User.prototype), 'constructor', this).apply(this, arguments);
    }

    return User;
})(_ActiveRecord3['default']);

exports['default'] = User;

User.model = {

    _id: {
        type: String,
        unique: true
    },

    //private: true
    email: {
        type: String,
        unique: true,
        required: true
    },

    recoveryEmails: [{
        type: String
    }],

    password: {
        type: String,
        required: true,
        'private': true,
        select: false
    },

    salt: {
        type: String,
        required: true,
        'private': true,
        select: false
    },

    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    photo: {
        type: String,
        ref: 'Object'
    },

    permissions: {
        type: ['Object'],
        'private': true
    },

    companies: [{
        type: String,
        ref: 'Company',
        required: true
    }],

    androidDevices: [{
        type: String
    }],

    iOSDevices: [{
        type: String
    }],

    windowsDevices: {
        type: ['Object']
    },

    isDeleted: {
        type: Boolean,
        'default': false,
        required: true,
        'private': true
    },

    isArchived: {
        type: Boolean,
        'default': false,
        es_indexed: true,
        required: true
    }

};
module.exports = exports['default'];
},{"./ActiveRecord":1}],5:[function(require,module,exports){
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

var _GenericDao = require('./GenericDao');

var _GenericDao2 = _interopRequireDefault(_GenericDao);

var _DaoHelper = require('./DaoHelper');

var _DaoHelper2 = _interopRequireDefault(_DaoHelper);

var dao = (0, _GenericDao2['default'])(_user2['default']);

var UserManager = (function (_dao) {
    _inherits(UserManager, _dao);

    function UserManager() {
        _classCallCheck(this, UserManager);

        _get(Object.getPrototypeOf(UserManager.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(UserManager, [{
        key: 'getProfile',
        value: function getProfile() {
            return this.$http.get(this.url + '/profile');
        }
    }]);

    return UserManager;
})(dao);

angular.module('90Tech.user-manager', []).provider('UserManager', _DaoHelper2['default'].getProvider(UserManager));
},{"./DaoHelper":2,"./GenericDao":3,"./user":4}]},{},[5]);
