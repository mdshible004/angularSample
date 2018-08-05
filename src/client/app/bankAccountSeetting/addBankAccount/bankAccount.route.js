(function() {
    'use strict';

    angular
        .module('app.bankAccountSeetting')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addBankAccount',
                config: {
                    url: '/settings/bankAccountSeetting',
                    templateUrl: 'app/bankAccountSeetting/addBankAccount/template.html',
                    controller: 'bankAccountSeettingController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();