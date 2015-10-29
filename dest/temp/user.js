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