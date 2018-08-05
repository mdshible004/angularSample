(function() {
    'use strict';

    angular
        .module('app.cashFlowMethodMap')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addCashFlowMethodMap',
                config: {
                    url: '/settings/cashFlowMethodMap',
                    templateUrl: 'app/cashFlowMethodMap/addCashFlowMethodMap/template.html',
                    controller: 'cashFlowMethodMapController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();