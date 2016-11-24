'use strict';


import ActiveRecord from '../ActiveRecord'


var model = {

    _id: {
        type  : String,
        unique: true,
        //private: true
    },
 
    name: String,

    __t: String
};


var AR = ActiveRecord(model, 'Model4');

export default class Model4 extends AR {}

