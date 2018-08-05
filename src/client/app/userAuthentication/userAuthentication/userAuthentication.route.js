(function() {
    'use strict';

    angular
        .module('app.userAuthentication')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'AddUserAuthentication',
                config: {
                    url: '/user/userAuthentication',
                    templateUrl: 'app/userAuthentication/userAuthentication/template.html',
                    controller: 'UserAuthenticationController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();