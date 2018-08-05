(function() {
    'use strict';

    angular
        .module('app.OpeningTrialBalanceReport')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }


    function getStates() {
        return [
            {
                state: 'openingTrialBalanceReport',
                config: {
                    url: '/settings/openingTrialBalanceReport/Report',
                    templateUrl: 'app/OpeningTrialBalanceReport/openingTrialBalanceReport/template.html',
                    controller: 'openingTrialBalanceReportController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
