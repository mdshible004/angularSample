(function() {
    'use strict';

    angular
        .module('app.genaralLedgerReport')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addGenaralLedgerReport',
                config: {
                    url: '/settings/genaralLedger/Report',
                    templateUrl: 'app/genaralLedgerReport/genaralLedgerReport/template.html',
                    controller: 'GenaralLedgerReportController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();