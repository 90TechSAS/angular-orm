'use strict';

export default class User {

    static getModel(){
        return [
            {field: '_id', type: 'string'},
            {field: '__v', type: 'int'},
            {field: 'createdAt', type: 'datetime'},
            {field: 'email', type: 'string'},
            {field: 'firstname', type: 'string'},
            {field: 'lastname', type: 'string'},
            {field: 'isArchived', type: 'boolean'},
            {field: 'windowsDevices', type: 'array'},
            {field: 'iOSDevices', type: 'array'},
            {field: 'androidDevices', type: 'array'},
            {field: 'companies', type: 'array'},
            {field: 'recoveryEmails', type: 'array'},
            {field: 'permissions', type: 'array'},
            {field: 'id', type: 'string'}
        ];
    }


    constructor($http, rootUrl, options){
        this.$http   = $http;
        this.rootUrl = rootUrl;
        _.each(User.getModel(), (field)=>{
            if (options && options[field.field]){
                this[field.field] = _.clone(options[field.field]);
            } else if (field.type === 'array') {
                this[field.field] = [];
            }
        });
    }

    save(){
        if (this._id){
            return this.$http.put(this.rootUrl + '/' + this._id, this)
        } else{
            return this.$http.post(this.rootUrl, this);
        }
    }


}
