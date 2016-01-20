/**
 * Created by Renaud ROHLINGER on 19/01/2015.
 * Notification service
 */

'use strict';

(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name angularOrm.service:LoadingService
     * @description
     * # LoadingService
     * Manages the loader inside the app
     *
    */
    angular.module('angularOrm.service').factory('LoadingService', LoadingService);
    function LoadingService() {

        var observerLoadingService = {};
        observerLoadingService.loading = true;
        // initialise function
        observerLoadingService.observers = function (x) {
            return x * x;
        };

        observerLoadingService.linkEvent = function (callback) {
            observerLoadingService.observers = callback;
        };
        /**
        * @ngdoc method
        * @name observerLoadingService#set
        * @methodOf angularOrm.service:LoadingService
        * @param {function} callback the callback function to fire
        * @param {string} boolean to check if the app is loading
        * @description setter of the loader
        */
        observerLoadingService.set = function (isloading) {
            observerLoadingService.loading = isloading;
            observerLoadingService.observers();
        };

        /**
        * @ngdoc method
        * @name observerLoadingService#get
        * @methodOf angularOrm.service:LoadingService
        * @description getter of the loader
        */
        observerLoadingService.get = function () {
            return observerLoadingService.loading;
        };

        return observerLoadingService;
    }
})();