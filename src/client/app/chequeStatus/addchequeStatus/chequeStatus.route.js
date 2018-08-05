(function() {
    'use strict';

    angular
        .module('app.chequeStatus')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addchequeStatus',
                config: {
                    url: '/settings/chequeStatus',
                    templateUrl: 'app/chequeStatus/addchequeStatus/template.html',
                    controller: 'chequeStatusController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
