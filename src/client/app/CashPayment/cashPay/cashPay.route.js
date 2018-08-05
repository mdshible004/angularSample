(function() {
    'use strict';

    angular
        .module('app.CashPayment')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'cashPay',
                config: {
                    url: '/settings/CashPayment',
                    templateUrl: 'app/CashPayment/cashPay/template.html',
                    controller: 'CashPaymentController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
