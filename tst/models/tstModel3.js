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


var AR = ActiveRecord(model, 'Model3');

export default class Model3 extends AR {


}

