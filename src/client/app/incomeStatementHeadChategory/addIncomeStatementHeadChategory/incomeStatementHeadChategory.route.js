(function() {
    'use strict';

    angular
        .module('app.incomeStatementHeadChategory')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addIncomeStatementHeadChategory',
                config: {
                    url: '/settings/incomeStatementHeadChategory',
                    templateUrl: 'app/incomeStatementHeadChategory/addIncomeStatementHeadChategory/template.html',
                    controller: 'incomeStatementHeadChategoryController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();