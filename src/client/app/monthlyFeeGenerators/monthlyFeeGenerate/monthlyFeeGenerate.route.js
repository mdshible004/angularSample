(function() {
    'use strict';

    angular
        .module('app.monthlyFeeGenerators')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'monthlyFeeGenerate',
                config: {
                    url: '/Fees/monthlyFee/generate',
                    templateUrl: 'app/monthlyFeeGenerators/monthlyFeeGenerate/template.html',
                    controller: 'monthlyFeeGenerateController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();