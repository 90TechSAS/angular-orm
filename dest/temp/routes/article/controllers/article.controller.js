/**
 * Created by Renaud ROHLINGER on 21/12/2015.
 * Article controller
 */

'use strict';

(function () {

    'use strict';

    angular.module('angularOrm.article').controller('ArticleController', ArticleController);
    function ArticleController($state, $stateParams, $timeout, NotificationService, LoadingService, PostsManager) {
        var vm = this;
        var getArticle;
        // get id from stateParam
        var id = $stateParams.instanceID;

        activate();

        LoadingService.set(true);

        function activate() {
            /**
            * Etape 1
            * Appelle la fonction getAllPosts pour récupérer
            * les données «allPosts» et attend la promise.
            */
            return getPost().then(function () {
                /**
                 * Etape 4
                 * Exécute une action à la résolution de la promise finale.
                 */
                LoadingService.set(false);
            });
        }

        function getPost() {
            /**
            * Etape 2
            * Appel du service de données pour récupérer les données
            * et attend la promesse.
            */
            return PostsManager.getById(id, PostsManager.query().populate(['tags', 'user'])).then(function (data) {
                /**
                * Etape 3
                * Définit les données et résout la promesse.
                */
                vm.getArticle = data;
                return vm.getArticle;
            });
        }

        function removeArticle() {

            LoadingService.set(true);
            vm.getArticle.remove().then(function (data) {
                NotificationService.notify('notify', "success", "L'élément à été supprimé avec succès");
                LoadingService.set(false);
            });
        }
        _.assign(vm, {
            getArticle: getArticle,
            removeArticle: removeArticle
        });
    }
})();