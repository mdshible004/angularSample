(function() {
    'use strict';

    angular
        .module('app.exameRoutineEntry')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addExameRoutine',
                config: {
                    url: '/settings/exameRoutineEntry',
                    templateUrl: 'app/exameRoutineEntry/addExameRoutine/template.html',
                    controller: 'exameRoutineEntryController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
