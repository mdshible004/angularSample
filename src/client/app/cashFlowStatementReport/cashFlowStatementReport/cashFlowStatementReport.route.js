(function() {
    'use strict';

    angular
        .module('app.cashFlowStatementReport')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addCashFlowStatementReport',
                config: {
                    url: '/settings/cashFlowStatement/Report',
                    templateUrl: 'app/cashFlowStatementReport/cashFlowStatementReport/template.html',
                    controller: 'CashFlowStatementReportController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();