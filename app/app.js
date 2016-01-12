
import DaoHelper from './DaoHelper';

import PostsManager from './managers/PostsManager';
import TagsManager from './managers/TagsManager';
import UsersManager from './managers/UsersManager';

import CommonDirective from './common/directives/common.directive';
import CommonController from './common/controllers/common.controller';
import NotificationService from './common/services/notification.service';

import HomeRoute from './routes/home/home.route';
import ArticleRoute from './routes/article/article.route';

import HomeController from './routes/home/controllers/home.controller';
import ArticleController from './routes/article/controllers/article.controller';
import ArticleCreationController from './routes/article/controllers/article-creation.controller';


var module = angular
    .module('angularOrm', ['ui.router','angularOrm.service','angularOrm.common','angularOrm.home','angularOrm.article'])
    .config(function($urlRouterProvider,PostsManagerProvider,TagsManagerProvider,UsersManagerProvider) {
        $urlRouterProvider.otherwise("/home");
        PostsManagerProvider.setRootUrl('https://gentle-brushlands-6591.herokuapp.com/api/posts');
        TagsManagerProvider.setRootUrl('https://gentle-brushlands-6591.herokuapp.com/api/tags');
        UsersManagerProvider.setRootUrl('https://gentle-brushlands-6591.herokuapp.com/api/users');
    });
DaoHelper.registerService(module, 'PostsManager', PostsManager);
DaoHelper.registerService(module, 'TagsManager', TagsManager);
DaoHelper.registerService(module, 'UsersManager', UsersManager);
