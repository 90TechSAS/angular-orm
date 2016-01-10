/**
 * Created by Renaud ROHLINGER on 21/12/2015.
 * Article controller
 */

'use strict';

(function () {

    'use strict';

    angular.module('tstModule.article').controller('ArticleController', ArticleController);
    function ArticleController($state, $stateParams, $location, PostsManager) {
        var self = this;
        var getArticle;
        // get id from stateParam
        var id = $stateParams.instanceID;

        // get post by id
        PostsManager.getById(id, PostsManager.query().populate(['tags', 'user'])).then(function (data) {
            self.getArticle = data;
        });

        function removeArticle() {
            self.getArticle.remove();
            alert("Supression de l'article accomplie");
        }
        _.assign(self, {
            getArticle: getArticle,
            removeArticle: removeArticle
        });
    }
})();