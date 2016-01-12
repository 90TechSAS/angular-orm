/**
 * Created by Renaud ROHLINGER on 27/11/2015.
 * Home controller
 */

(function() {

    'use strict';

    angular
    	.module('angularOrm.common')
        .controller('CommonController' , CommonController);
    function CommonController(NotificationService,$timeout,$state) {
        var self = this;
        var notification = {};
        // attribute id to the notify event
        var id = 'vm1';

        // start the notification observer
        NotificationService.linkEvent(showNotification, 'notify', id);

        function showNotification(typenotif,message){
            //NotificationService.unlinkEvent('let_me_know');*
            self.notification.typenotif=typenotif;
            self.notification.message=message;

            $timeout(function(){
                // after 3 secondes hide the notification
                self.notification.typenotif="hidden";
            },2000).then(function () {
                return $timeout(function () {
                $state.go( "home", {}, { reload: false });
                }, 500);
            });
        }

        _.assign(self, {
            notification:notification
        });
    }
})();
