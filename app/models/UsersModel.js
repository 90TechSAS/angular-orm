'use strict';


import ActiveRecord from '../ActiveRecord'


var model = {

    _id: {
        type  : String,
        unique: true,
        //private: true
    },

    Name: String,
};


var AR = ActiveRecord(model, 'UsersModel');

export default class UsersModel extends AR {

}

