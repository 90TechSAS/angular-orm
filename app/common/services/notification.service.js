/**
 * Created by Renaud ROHLINGER on 12/01/2015.
 * Notification service
 */

(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name angularOrm.service:NotificationService
     * @description
     * # NotificationService
     * Manages all notifications inside the application
     *
    */
    angular
        .module('angularOrm.service', [])
        .factory('NotificationService', NotificationService);
            function NotificationService() {
                var observerNotificationService= {};

                /*
                * @ngdoc property
                * @name observerNotificationService#observers
                * @propertyOf angularOrm.service:NotificationService
                * @description object to store all observers
                */
                observerNotificationService.observers = {};

                /**
                * @ngdoc method
                * @name observerNotificationService#linkEvent
                * @methodOf angularOrm.service:NotificationService
                * @param {function} callback the callback function to fire
                * @param {string} event name of the event
                * @param {string} id unique id for the object that is listening i.e. namespace
                * @description adds events listeners
                */
                observerNotificationService.linkEvent = function(callback, event, id) {
                  if(id) {
                    if (!observerNotificationService.observers[event]) {
                      observerNotificationService.observers[event] = {};
                    }

                    if(!observerNotificationService.observers[event][id])
                      observerNotificationService.observers[event][id] = [];

                    observerNotificationService.observers[event][id].push(callback);
                  }
                };
                /**
                * @ngdoc method
                * @name observerNotificationService#unlinkEvent
                * @methodOf angularOrm.service:NotificationService
                * @param {string} event name of the event
                * @description removes removes all the event from the observer object
                */
                observerNotificationService.unlinkEvent = function(event) {
                  if(event in observerNotificationService.observers) {
                    delete observerNotificationService.observers[event];
                  }
                };

                /**
                * @ngdoc method
                * @name observerNotificationService#notify
                * @methodOf angularOrm.service:NotificationService
                * @param {string} event name of the event
                * @param {string|object|array|number} type of the notification ex:error/success
                * @param {string|object|array|number} message of the notification
                * @description notifies all observers of a specific event
                */
                observerNotificationService.notify = function(event,typenotif,message) {
                  for(var id in observerNotificationService.observers[event]) {
                    angular.forEach(observerNotificationService.observers[event][id], function (callback) {
                      callback(typenotif,message);
                    });
                  }
                };

                return observerNotificationService;
            }
})();