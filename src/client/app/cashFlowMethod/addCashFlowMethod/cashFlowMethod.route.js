(function() {
    'use strict';

    angular
        .module('app.cashFlowMethod')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addCashFlowMethod',
                config: {
                    url: '/settings/cashFlowMethod',
                    templateUrl: 'app/cashFlowMethod/addCashFlowMethod/template.html',
                    controller: 'cashFlowMethodController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();