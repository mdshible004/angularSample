(function() {
    'use strict';

    angular
        .module('app.Fee_Setup')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'FeeSetup',
                config: {
                    url: '/settings/Fee_Setup',
                    templateUrl: 'app/Fee_Setup/FeeSetup/template.html',
                    controller: 'FeeSetupController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
