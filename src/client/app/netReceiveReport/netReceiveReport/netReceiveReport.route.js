(function() {
    'use strict';

    angular
        .module('app.netReceiveReport')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'netReceiveReport',
                config: {
                    url: '/settings/netReceiveReport/Report',
                    templateUrl: 'app/netReceiveReport/netReceiveReport/template.html',
                    controller: 'netReceiveReportController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
