'use strict';


import ActiveRecord from '../ActiveRecord'


var model = {

    _id: {
        type  : String,
        unique: true,
        //private: true
    },

    title: String,
    content: String,
    user: {
        type: String,
        ref: 'UsersModel'
    },
    tags: [{
        type: String,
        ref: 'TagsModel'
    }]
};


var AR = ActiveRecord(model, 'PostsModel');

export default class PostsModel extends AR {


}

