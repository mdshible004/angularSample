(function() {
    'use strict';

    angular
        .module('app.paymentInfo')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addPaymentInfo',
                config: {
                    url: '/settings/paymentInfo/paymentInfo',
                    templateUrl: 'app/paymentInfo/addPaymentInfo/template.html',
                    controller: 'PaymentInfoController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();