(function() {
    'use strict';

    angular
        .module('app.MonthlyDueList')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'MonthlyDue',
                config: {
                    url: '/settings/MonthlyDueList',
                    templateUrl: 'app/MonthlyDueList/MonthlyDue/template.html',
                    controller: 'MonthlyDueController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
