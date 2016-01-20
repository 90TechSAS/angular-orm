/**
 * Created by Renaud ROHLINGER on 19/01/2015.
 * Notification service
 */

(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name angularOrm.service:LoadingService
     * @description
     * # LoadingService
     * Manages the loader inside the app
     *
    */
    angular
        .module('angularOrm.service')
        .factory('LoadingService', LoadingService);
            function LoadingService() {

                var observerLoadingService = {};
                observerLoadingService.loading = true;
                // initialize function waiting for the common.controller function used for the loader
                observerLoadingService.observers = x => { return x * x; };

                /**
                * @ngdoc method
                * @name observerLoadingService#linkEvent
                * @methodOf angularOrm.service:LoadingService
                * @param {function} callback the callback function to fire
                * @description allow to link the loading service with the interface's function
                */
                observerLoadingService.linkEvent = function(callback) {
                  observerLoadingService.observers = callback;
                };
                /**
                * @ngdoc method
                * @name observerLoadingService#set
                * @methodOf angularOrm.service:LoadingService
                * @param {boolean} boolean is loading or not
                * @description set the loading state
                */
                observerLoadingService.set = function(isloading) {
                    observerLoadingService.loading = isloading;
                    observerLoadingService.observers();
                };

                /**
                * @ngdoc method
                * @name observerLoadingService#get
                * @methodOf angularOrm.service:LoadingService
                * @description get the loading state
                */
                observerLoadingService.get = function() {
                    return observerLoadingService.loading;
                };

                return observerLoadingService;
            }
})();