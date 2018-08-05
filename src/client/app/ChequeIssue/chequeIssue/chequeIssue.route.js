(function() {
    'use strict';

    angular
        .module('app.ChequeIssue')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'chequeIssue',
                config: {
                    url: '/settings/ChequeIssue',
                    templateUrl: 'app/ChequeIssue/chequeIssue/template.html',
                    controller: 'chequeIssueController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
