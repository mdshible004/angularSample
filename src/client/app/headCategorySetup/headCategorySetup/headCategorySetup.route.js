(function() {
    'use strict';

    angular
        .module('app.headCategorySetup')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'AddHeadCategorySetup',
                config: {
                    url: '/Accounts/AccountSetup/headCategory/Setup',
                    templateUrl: 'app/headCategorySetup/headCategorySetup/template.html',
                    controller: 'HeadCategorySetupController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();