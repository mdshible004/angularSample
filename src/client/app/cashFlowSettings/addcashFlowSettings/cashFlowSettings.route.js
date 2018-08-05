(function() {
    'use strict';

    angular
        .module('app.cashFlowSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addcashFlowSettings',
                config: {
                    url: '/settings/cashFlowSettings',
                    templateUrl: 'app/cashFlowSettings/addcashFlowSettings/template.html',
                    controller: 'cashFlowSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
