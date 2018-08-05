(function() {
    'use strict';

    angular
        .module('app.BankReceive')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'bankRec',
                config: {
                    url: '/settings/BankReceive',
                    templateUrl: 'app/BankReceive/bankRec/template.html',
                    controller: 'BankReceiveController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
