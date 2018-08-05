(function() {
    'use strict';

    angular
        .module('app.paymentVoucher')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addPaymentVoucher',
                config: {
                    url: '/paymentVoucher/Entry',
                    templateUrl: 'app/paymentVoucher/paymentVoucher/template.html',
                    controller: 'PaymentVoucherController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
