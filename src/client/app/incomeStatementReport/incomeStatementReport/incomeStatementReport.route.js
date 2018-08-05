(function() {
    'use strict';

    angular
        .module('app.incomeStatementReport')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addIncomeStatementReport',
                config: {
                    url: '/settings/incomeStatement/Report',
                    templateUrl: 'app/incomeStatementReport/incomeStatementReport/template.html',
                    controller: 'IncomeStatementReportController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();