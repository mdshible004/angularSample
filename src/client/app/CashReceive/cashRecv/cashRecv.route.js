(function() {
    'use strict';

    angular
        .module('app.CashReceive')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'cashRecv',
                config: {
                    url: '/settings/CashReceive',
                    templateUrl: 'app/CashReceive/cashRecv/template.html',
                    controller: 'CashReceiveController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
