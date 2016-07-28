'use strict';


import ActiveRecord from '../ActiveRecord'


var model = {

    _id: {
        type  : String,
        unique: true,
        //private: true
    },

    name: String,
};


var AR = ActiveRecord(model, 'Model2');

export default class Model2 extends AR {


}

