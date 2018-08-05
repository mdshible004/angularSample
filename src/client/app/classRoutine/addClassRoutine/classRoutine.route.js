(function() {
    'use strict';

    angular
        .module('app.classRoutine')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'AddClassRoutine',
                config: {
                    url: '/class/classRoutine',
                    templateUrl: 'app/classRoutine/addClassRoutine/template.html',
                    controller: 'ClassRoutineController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();