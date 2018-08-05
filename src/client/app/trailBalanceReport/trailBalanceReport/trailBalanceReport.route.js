(function() {
    'use strict';

    angular
        .module('app.trailBalanceReport')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addTrailBalanceReport',
                config: {
                    url: '/settings/trailBalance/Report',
                    templateUrl: 'app/trailBalanceReport/trailBalanceReport/template.html',
                    controller: 'TrailBalanceReportController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();