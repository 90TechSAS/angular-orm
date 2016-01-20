'use strict';


import ActiveRecord from '../ActiveRecord'


var model = {

    _id: {
        type  : String,
        ref: 'PostsModel'
    },
    firstName: String,
    lastName: String
};


var AR = ActiveRecord(model, 'UsersModel');

export default class UsersModel extends AR {

}

