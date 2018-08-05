(function() {
    'use strict';

    angular
        .module('app.Routine')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'AddRoutine',
                config: {
                    url: '/class/Routine',
                    templateUrl: 'app/Routine/addRoutine/template.html',
                    controller: 'RoutineController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
