/**
 * Created by Renaud ROHLINGER on 27/11/2015.
 * Home controller
 */

(function() {

    'use strict';

    angular
    	.module('angularOrm.home')
        .controller('HomeController' , HomeController);
    function HomeController(PostsManager,LoadingService) {
        var vm = this;
        var allPosts;         
    	var get;

        activate();

        function activate() {
            /**
            * Etape 1
            * Appelle la fonction getAllPosts pour récupérer
            * les données «allPosts» et attend la promise.
            */
            return getAllPosts().then(function() {
                /**
                 * Etape 4
                 * Exécute une action à la résolution de la promise finale.
                 */
                LoadingService.set(false);
            });
        }


        function getAllPosts() {
            /**
            * Etape 2
            * Appel du service de données pour récupérer les données
            * et attend la promesse.
            */
            return PostsManager.get(PostsManager.query().populate(['tags','user']).sort('-_id')).then(function(posts){
                /**
                * Etape 3
                * Définit les données et résout la promesse.
                */
                vm.allPosts = posts.data;
                return vm.allPosts;
            });
        }

        _.assign(vm, {
        	allPosts:allPosts
        });
    }
})();
