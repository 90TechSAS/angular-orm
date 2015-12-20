'use strict';


import ActiveRecord from '../ActiveRecord'


var model = {

    _id: {
        type  : String,
        ref: 'PostsModel',
        //private: true
    },

    title: String
};


var AR = ActiveRecord(model, 'TagsModel');

export default class TagsModel extends AR {
}

