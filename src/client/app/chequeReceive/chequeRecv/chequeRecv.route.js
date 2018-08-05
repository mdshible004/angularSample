(function() {
    'use strict';

    angular
        .module('app.chequeReceive')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'chequeRecv',
                config: {
                    url: '/settings/chequeReceive',
                    templateUrl: 'app/chequeReceive/chequeRecv/template.html',
                    controller: 'chequeRecvController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
