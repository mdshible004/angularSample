(function() {
    'use strict';

    angular
        .module('app.MyRoutine')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'AddMyRoutine',
                config: {
                    url: '/class/MyRoutine',
                    templateUrl: 'app/MyRoutine/addMyRoutine/template.html',
                    controller: 'MyRoutineController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
