/**
 * Created by Renaud ROHLINGER on 27/11/2015.
 * Home controller
 */

(function() {

    'use strict';

    angular
    	.module('tstModule.home')
        .controller('HomeController' , HomeController);
    function HomeController(PostsManager,TagsManager) {
        var self = this;
    	var getAll;    	

    	PostsManager.get(PostsManager.query().populate(['tags','user'])).then(function(posts){
            self.getAll = posts.data;
        });

        _.assign(self, {
        	getAll:getAll
        });
    }
})();
