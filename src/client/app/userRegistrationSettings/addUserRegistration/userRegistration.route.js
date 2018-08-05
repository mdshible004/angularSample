(function () {
    'use strict';

    angular
        .module('app.userRegistration')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addUser',
                config: {
                    url: '/settings/userregistration',
                    templateUrl: 'app/userRegistrationSettings/addUserRegistration/template.html',
                    controller: 'UserRegistrationController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
