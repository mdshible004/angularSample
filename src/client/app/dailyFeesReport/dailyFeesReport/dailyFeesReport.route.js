(function() {
    'use strict';

    angular
        .module('app.dailyFeesReport')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addDailyFeesReport',
                config: {
                    url: '/Fees/DailyFees/Report',
                    templateUrl: 'app/dailyFeesRepor/dailyFeesReport/template.html',
                    controller: 'DailyFeesReportController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
