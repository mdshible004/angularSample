(function() {
    'use strict';

    angular
        .module('app.balanceSheetHeadCOAMap')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'AddBalanceSheetHeadCOAMap',
                config: {
                    url: '/Accounts/AccountSetup/balanceSheetHead/Setup',
                    templateUrl: 'app/balanceSheetHeadCOAMap/balanceSheetHeadCOAMap/template.html',
                    controller: 'BalanceSheetHeadCOAMapController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();