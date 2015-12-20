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

    	 PostsManager.get().then(function(posts){
            console.log(posts.data);

            self.getAll = posts.data;
        });

        console.log(PostsManager);
        TagsManager.get().then(function(data){
    	 	console.log(data);

        });
 		
        _.assign(self, {
        	getAll:getAll
        });
    }
})();
