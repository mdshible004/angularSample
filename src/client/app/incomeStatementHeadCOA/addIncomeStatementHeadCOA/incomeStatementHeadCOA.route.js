(function() {
    'use strict';

    angular
        .module('app.incomeStatementHeadCOA')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addIncomeStatementHeadCOA',
                config: {
                    url: '/settings/incomeStatementHeadCOA',
                    templateUrl: 'app/incomeStatementHeadCOA/addIncomeStatementHeadCOA/template.html',
                    controller: 'incomeStatementHeadCOAController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
