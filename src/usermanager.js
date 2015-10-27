'use strict';

import User from './user';

class UserManager {


    constructor($http, url){
        this.$http   = $http;
        this.rootUrl = url;
    }

    getNew(){
        return new User(this.$http, this.rootUrl);
    }

    getList(params){
        var self = this;
        return this.$http.get(this.rootUrl, {params: params}).then(function (data) {
            return {data: _.map(data.data, function (user) {
                return new User(self.$http, self.rootUrl, user);
            }), meta: {total: data.headers('X-Total-Count')}};
        });
    }

    getById(id, populate){
        var self = this;
        var params = null;
        if (populate){
            params = {params: {populate: populate}}
        }
        return this.$http.get(this.rootUrl + '/' + id, params ).then(function(data){
            return new User(self.$http, self.rootUrl, data.data);
        })
    }

    getProfile(){
        return this.$http.get(this.rootUrl + '/profile')
    }

}

class UserManagerProvider {


    setRootUrl(url){
        this.rootUrl = url;
    }

    /*@ngInject*/
    $get($http){
        return new UserManager($http, this.rootUrl);
    }


}


angular
    .module('90Tech.user-manager', [])
    .provider('UserManager', UserManagerProvider);

