(function() {
    'use strict';

    angular
        .module('app.OpeningJournal')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'openingjournal',
                config: {
                    url: '/settings/openingjournal',
                    templateUrl: 'app/OpeningJournal/openingJournal/template.html',
                    controller: 'OpeningJournalController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
