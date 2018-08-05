(function() {
    'use strict';

    angular
        .module('app.financialReport')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'financialReport',
                config: {
                    url: '/settings/financialReport',
                    templateUrl: 'app/financialReport/financialReport/template.html',
                    controller: 'financialReportController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();