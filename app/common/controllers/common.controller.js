/**
 * Created by Renaud ROHLINGER on 27/11/2015.
 * Home controller
 */

(function() {

    'use strict';

    angular
    	.module('angularOrm.common')
        .controller('CommonController' , CommonController);
    function CommonController(NotificationService,LoadingService,$timeout,$state) {
        var vm = this;
        var notification = {};

        // attribute id to the notify event
        var id = 'vm1';

        // start the notification observer
        NotificationService.linkEvent(showNotification, 'notify', id);
        LoadingService.linkEvent(showLoader);

        function showNotification(typenotif,message){
            vm.notification.typenotif=typenotif;
            vm.notification.message=message;

            $timeout(function(){
                // after 3 secondes hide the notification
                vm.notification.typenotif="hidden";
            },2000).then(function () {
                return $timeout(function () {
                $state.go( "home", {}, { reload: false });
                }, 500);
            });
        }

        function showLoader(){
            return LoadingService.get();
        }

        _.assign(vm, {
            notification:notification,
            showLoader:showLoader
        });
    }
})();
