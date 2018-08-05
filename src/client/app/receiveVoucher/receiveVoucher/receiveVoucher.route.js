(function() {
    'use strict';

    angular
        .module('app.receiveVoucher')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addReceiveVoucher',
                config: {
                    url: '/receiveVoucher/Entry',
                    templateUrl: 'app/receiveVoucher/receiveVoucher/template.html',
                    controller: 'ReceiveVoucherController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
