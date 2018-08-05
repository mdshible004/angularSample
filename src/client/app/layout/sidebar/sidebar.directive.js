(function () {
    'use strict';

    angular
        .module('app.sidebar')
        .directive('armSidebar', armSidebar);

    armSidebar.$inject = ['config', '$state', 'authservice', '$localStorage'];
    /* @ngInject */

    function armSidebar(config, $state, authservice, $localStorage) {
        //Usage: <arm-sidebar></arm-sidebar>


        var directive = {
            restrict: 'A',
            templateUrl: 'app/layout/sidebar/template.html',
            controller: 'MenuServiceController',
            controllerAs: 'vm',
            link: link
        };

        return directive;



        function link(scope, element, attrs) {
            if ($localStorage.userInfo !== undefined) {
                scope.uType = authservice.userRoll;
                scope.adminInstitute = $localStorage.userInfo[0].InstituteID;
                scope.visibleTo = function (allowedRolls) {

                    allowedRolls = allowedRolls || [];
                    if (allowedRolls.indexOf('all') !== -1 ||
                        allowedRolls.indexOf(scope.uType) !== -1) {
                        return true;
                    }
                    return false;
                };

                scope.isCurrent = function (stateNames) {

                    stateNames = stateNames.split('/');
                    for (var i = 0; i < stateNames.length; i++) {
                        if ($state.current.name.split('.').indexOf(stateNames[i]) !== -1) {
                            return true;
                        }
                    }
                    return false;
                };

                scope.$on('userInfoReceived', function (event, data) {
                    scope.uType = authservice.userRoll;
                });

                scope.$on('userLoggedOut', function (data) {
                    scope.uType = authservice.userRoll;
                });

                //scope.$watch($state.current.name, function(newValue, oldValue) {});
                //scope.$on('userLoggedIn', function (data) {});

            }
            else {
                console.log('ok');
            }
        }
    }
})();
