(function() {
    'use strict';

    angular
        .module('app.YearlyClosingProcess')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'closingProcess',
                config: {
                    url: '/settings/YearlyClosingProcess',
                    templateUrl: 'app/YearlyClosingProcess/closingProcess/template.html',
                    controller: 'closingProcessController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
