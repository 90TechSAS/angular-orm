/**
 * Created by Renaud ROHLINGER on 27/11/2015.
 * Common directive
 */

(function() {
    'use strict';

    angular
        .module('tstModule.common', [])
        .directive('footer', FooterDirective);
            function FooterDirective() {
                return {
                    restrict: 'A',
                    bindToController: true, 
                    templateUrl: "app/layouts/partials/footer.html",
                    controllerAs: ''
                }
            }

    angular
        .module('tstModule.common')
        .directive('header', HeaderDirective);

            HeaderDirective.$inject = ['$location'];
            function HeaderDirective($location) {
                return {
                    restrict: 'A',
                    bindToController: true, 
                    controller: 'CommonController',
                    templateUrl: "app/layouts/partials/header.html",
                    controllerAs: 'header',
                    link: link
                }
                function link($scope, $element, $attrs, $controller) {
                    $scope.ui = {
                        animation : 'animated'
                    }
                    $scope.IsHidden = false;
                    
                    $scope.ShowHide = function() {
                        $scope.IsHidden = $scope.IsHidden ? false : true;
                    }
                    $scope.getClass = function (path) {
                      if ($location.path() === '/'+path) {
                        return 'active';
                      } else {
                        return '';
                      }
                    }
                }
            }

})();