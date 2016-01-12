/**
 * Created by Renaud ROHLINGER on 21/12/2015.
 * Article controller
 */

(function() {

    'use strict';

    angular
    	.module('angularOrm.article')
        .controller('ArticleController' , ArticleController);
    function ArticleController($state,$stateParams,$timeout,NotificationService,PostsManager) {
        var self = this;
    	var getArticle; 
        // get id from stateParam
        var id = $stateParams.instanceID;  	

        // get post by id
    	PostsManager.getById(id,PostsManager.query().populate(['tags','user'])).then(function(data){
            self.getArticle = data;
        });

        function removeArticle(){
            self.getArticle.remove().then(function(data){
                NotificationService.notify('notify',"success","L'élément à été supprimé avec succès");
            });
        }
        _.assign(self, {
        	getArticle:getArticle,
            removeArticle:removeArticle
        });
    }
})();
