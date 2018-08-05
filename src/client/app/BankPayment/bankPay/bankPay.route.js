(function() {
    'use strict';

    angular
        .module('app.BankPayment')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'bankPay',
                config: {
                    url: '/settings/BankPayment',
                    templateUrl: 'app/BankPayment/bankPay/template.html',
                    controller: 'BankPaymentController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
