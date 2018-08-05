(function() {
    'use strict';

    angular
        .module('app.CashBankReceive')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'cashBankRecv',
                config: {
                    url: '/settings/CashBankReceive',
                    templateUrl: 'app/CashBankReceive/cashBankRecv/template.html',
                    controller: 'cashBankRecvController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
