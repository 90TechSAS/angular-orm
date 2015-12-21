/**
 * Created by Renaud ROHLINGER on 21/12/2015.
 * Article router
 */


(function() {
    'use strict';


    angular
        .module('tstModule.article',[])
        .config(function($stateProvider) {


            $stateProvider
                .state('article', {
                            url:'/article/:instanceID',
                            templateUrl:'./app/routes/article/controllers/article.html',
                            bindToController: true, 
                            controllerAs: 'article',
                            controller: 'ArticleController'
                })
        });
       
})();

