(function() {
    'use strict';

    angular
        .module('app.balanceSheetReport')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addBalanceSheetReport',
                config: {
                    url: '/settings/balanceSheet/Report',
                    templateUrl: 'app/balanceSheetReport/balanceSheetReport/template.html',
                    controller: 'BalanceSheetReportController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();