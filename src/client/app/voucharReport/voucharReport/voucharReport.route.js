(function() {
    'use strict';

    angular
        .module('app.voucharReport')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'voucharReport',
                config: {
                    url: '/settings/voucharReport',
                    templateUrl: 'app/voucharReport/voucharReport/template.html',
                    controller: 'voucharReportController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();