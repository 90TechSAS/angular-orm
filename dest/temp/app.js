'use strict';

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _DaoHelper = require('./DaoHelper');

var _DaoHelper2 = _interopRequireDefault(_DaoHelper);

var _managersPostsManager = require('./managers/PostsManager');

var _managersPostsManager2 = _interopRequireDefault(_managersPostsManager);

var _managersTagsManager = require('./managers/TagsManager');

var _managersTagsManager2 = _interopRequireDefault(_managersTagsManager);

var _managersUsersManager = require('./managers/UsersManager');

var _managersUsersManager2 = _interopRequireDefault(_managersUsersManager);

var _commonDirectivesCommonDirective = require('./common/directives/common.directive');

var _commonDirectivesCommonDirective2 = _interopRequireDefault(_commonDirectivesCommonDirective);

var _commonControllersCommonController = require('./common/controllers/common.controller');

var _commonControllersCommonController2 = _interopRequireDefault(_commonControllersCommonController);

var _commonServicesNotificationService = require('./common/services/notification.service');

var _commonServicesNotificationService2 = _interopRequireDefault(_commonServicesNotificationService);

var _routesHomeHomeRoute = require('./routes/home/home.route');

var _routesHomeHomeRoute2 = _interopRequireDefault(_routesHomeHomeRoute);

var _routesArticleArticleRoute = require('./routes/article/article.route');

var _routesArticleArticleRoute2 = _interopRequireDefault(_routesArticleArticleRoute);

var _routesHomeControllersHomeController = require('./routes/home/controllers/home.controller');

var _routesHomeControllersHomeController2 = _interopRequireDefault(_routesHomeControllersHomeController);

var _routesArticleControllersArticleController = require('./routes/article/controllers/article.controller');

var _routesArticleControllersArticleController2 = _interopRequireDefault(_routesArticleControllersArticleController);

var _routesArticleControllersArticleCreationController = require('./routes/article/controllers/article-creation.controller');

var _routesArticleControllersArticleCreationController2 = _interopRequireDefault(_routesArticleControllersArticleCreationController);

var _module = angular.module('angularOrm', ['ui.router', 'angularOrm.service', 'angularOrm.common', 'angularOrm.home', 'angularOrm.article']).config(function ($urlRouterProvider, PostsManagerProvider, TagsManagerProvider, UsersManagerProvider) {
    $urlRouterProvider.otherwise("/home");
    PostsManagerProvider.setRootUrl('https://gentle-brushlands-6591.herokuapp.com/api/posts');
    TagsManagerProvider.setRootUrl('https://gentle-brushlands-6591.herokuapp.com/api/tags');
    UsersManagerProvider.setRootUrl('https://gentle-brushlands-6591.herokuapp.com/api/users');
});
_DaoHelper2['default'].registerService(_module, 'PostsManager', _managersPostsManager2['default']);
_DaoHelper2['default'].registerService(_module, 'TagsManager', _managersTagsManager2['default']);
_DaoHelper2['default'].registerService(_module, 'UsersManager', _managersUsersManager2['default']);