(function() {
    'use strict';

    angular
        .module('app.resultProcessingSetup')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addResultProcessingSetup',
                config: {
                    url: '/Result/resultProcessingSetup',
                    templateUrl: 'app/resultProcessingSetup/addResultProcessingSetup/template.html',
                    controller: 'ResultProcessingSetupController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
