'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ActiveRecord = require('./ActiveRecord');

var _ActiveRecord2 = _interopRequireDefault(_ActiveRecord);

var model = {

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

var User = (0, _ActiveRecord2['default'])(model);

exports['default'] = User;
module.exports = exports['default'];