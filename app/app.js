
import DaoHelper from './DaoHelper';

import PostsManager from './managers/PostsManager';
import TagsManager from './managers/TagsManager';
import UsersManager from './managers/UsersManager';

import CommonDirective from './common/directives/common.directive';

import HomeRoute from './routes/home/home.route';

import HomeController from './routes/home/controllers/home.controller';


var module = angular
    .module('tstModule', ['ui.router','tstModule.common','tstModule.home'])
    .config(function($urlRouterProvider,PostsManagerProvider,TagsManagerProvider,UsersManagerProvider) {
        $urlRouterProvider.otherwise("/home");
        PostsManagerProvider.setRootUrl('https://gentle-brushlands-6591.herokuapp.com/api/posts');
        TagsManagerProvider.setRootUrl('https://gentle-brushlands-6591.herokuapp.com/api/tags');
        UsersManagerProvider.setRootUrl('https://gentle-brushlands-6591.herokuapp.com/api/users');
    });
DaoHelper.registerService(module, 'PostsManager', PostsManager);
DaoHelper.registerService(module, 'TagsManager', TagsManager);
DaoHelper.registerService(module, 'UsersManager', UsersManager);
