(function() {
    'use strict';

    angular
        .module('app.Journal')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'journal',
                config: {
                    url: '/settings/Journal',
                    templateUrl: 'app/Journal/journal/template.html',
                    controller: 'journalController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
