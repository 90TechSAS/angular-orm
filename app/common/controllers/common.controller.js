/**
 * Created by Renaud ROHLINGER on 27/11/2015.
 * Home controller
 */

(function() {

    'use strict';

    angular
    	.module('tstModule.common')
        .controller('CommonController' , CommonController);
    function CommonController() {
        var self = this;
        var notifications = {};
        // refresh data

        _.assign(self, {
            notification:notifications
        });
    }
})();
