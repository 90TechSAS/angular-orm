'use strict';


import ActiveRecord from '../ActiveRecord'


var model = {

    _id: {
        type  : String,
        unique: true,
        //private: true
    },

    label: String,

    num: Number,

    models2: [
        {
            type: String,
            ref: 'Model2'
        }
    ],

    model2: {
        type: String,
        ref: 'Model2'
    }
};


var AR = ActiveRecord(model, 'Model1');

export default class Model extends AR {


}

