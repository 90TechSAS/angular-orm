'use strict';

import User from './user';
import GenericDao from './GenericDao'
import DaoHelper from './DaoHelper'

var dao = GenericDao(User);
class UserManager extends dao {
    getProfile(){
        return this.$http.get(this.url + '/profile')
    }
}

angular
    .module('90Tech.user-manager', [])
    .provider('UserManager', DaoHelper.getProvider(UserManager));

