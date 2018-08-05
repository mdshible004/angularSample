(function() {
    'use strict';

    angular
        .module('app.monthReport')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addmonthReport',
                config: {
                    url: '/settings/monthReport',
                    templateUrl: 'app/monthReport/addmonthReport/template.html',
                    controller: 'monthReportController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();