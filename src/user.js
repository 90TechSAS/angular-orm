'use strict';


import ActiveRecord from './ActiveRecord'


var model = {

    _id: {
        type: String,
        unique: true,
        //private: true
    },

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
        private: true,
        select: false
    },

    salt: {
        type: String,
        required: true,
        private: true,
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
        private: true
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
        default: false,
        required: true,
        private: true
    },

    isArchived: {
        type: Boolean,
        default: false,
        es_indexed: true,
        required: true
    }

};


var User = ActiveRecord(model);

export default User;

