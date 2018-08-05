(function() {
    'use strict';

    angular
        .module('app.chartOfAccounts')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'AddChartOfAccounts',
                config: {
                    url: '/ChartOfAccounts/Entry',
                    templateUrl: 'app/chartOfAccounts/chartOfAccounts/template.html',
                    controller: 'ChartOfAccountsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();