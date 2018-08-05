(function() {
    'use strict';

    angular
        .module('app.yearlyFeeGenaration')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'yearlyFeeGen',
                config: {
                    url: '/settings/yearlyFeeGenaration/addYearlyFee',
                    templateUrl: 'app/yearlyFeeGenaration/addYearlyFee/template.html',
                    controller: 'YearlyFeeGenarationController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();