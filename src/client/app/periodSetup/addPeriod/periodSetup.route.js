


(function () {
    'use strict';

    angular
        .module('app.periodSetup')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addPeriod',
                config: {
                    url: '/settings/periodSetup',
                    templateUrl: 'app/periodSetup/addPeriod/template.html',
                    controller: 'periodSetupController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
