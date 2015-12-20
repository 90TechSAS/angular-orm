/**
 * Created by Renaud ROHLINGER on 27/11/2015.
 * Home router
 */


(function() {
    'use strict';


    angular
        .module('tstModule.home',[])
        .config(function($stateProvider) {

            var view = 'home';

            $stateProvider
                .state(view, {
                            url:'/'+view,
                            templateUrl:'./app/routes/'+view+'/controllers/'+view+'.html',
                            bindToController: true, 
                            controllerAs: view,
                            controller: 'HomeController'
                })
        });
       
})();

