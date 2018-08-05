(function() {
    'use strict';

    angular
        .module('app.partyLedgerReport')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addPartyLedgerReport',
                config: {
                    url: '/settings/partyLedger/Report',
                    templateUrl: 'app/partyLedgerReport/partyLedgerReport/template.html',
                    controller: 'PartyLedgerReportController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();