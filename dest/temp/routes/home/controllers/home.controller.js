/**
 * Created by Renaud ROHLINGER on 27/11/2015.
 * Home controller
 */

'use strict';

(function () {

    'use strict';

    angular.module('angularOrm.home').controller('HomeController', HomeController);
    function HomeController(PostsManager) {
        var self = this;
        var getAll;
        var get;

        PostsManager.get(PostsManager.query().populate(['tags', 'user']).sort('-_id')).then(function (posts) {
            self.getAll = posts.data;
        });

        _.assign(self, {
            getAll: getAll
        });
    }
})();