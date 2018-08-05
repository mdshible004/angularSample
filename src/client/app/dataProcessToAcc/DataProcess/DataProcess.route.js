(function() {
    'use strict';

    angular
        .module('app.dataProcessToAcc')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'DataProcess',
                config: {
                    url: '/settings/dataProcessToAcc',
                    templateUrl: 'app/dataProcessToAcc/DataProcess/template.html',
                    controller: 'DataProcessController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
