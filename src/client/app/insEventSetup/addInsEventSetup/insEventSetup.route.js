(function() {
    'use strict';

    angular
        .module('app.insEventSetup')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addInsEventSetup',
                config: {
                    url: '/settings/insEventSetup',
                    templateUrl: 'app/insEventSetup/addInsEventSetup/template.html',
                    controller: 'insEventSetupController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();