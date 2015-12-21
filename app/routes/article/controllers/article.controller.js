/**
 * Created by Renaud ROHLINGER on 21/12/2015.
 * Article controller
 */

(function() {

    'use strict';

    angular
    	.module('tstModule.article')
        .controller('ArticleController' , ArticleController);
    function ArticleController($state, $stateParams,PostsManager,TagsManager) {
        var self = this;
    	var getArticle; 
        // get id from stateParam
        var id = $stateParams.instanceID;  	

        // get post by id
    	PostsManager.getById(id,PostsManager.query().populate(['tags','user'])).then(function(data){
            self.getArticle = data;
        });

        _.assign(self, {
        	getArticle:getArticle
        });
    }
})();
