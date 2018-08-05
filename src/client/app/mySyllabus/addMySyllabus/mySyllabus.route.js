(function() {
    'use strict';

    angular
        .module('app.mySyllabus')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addMySyllabus',
                config: {
                    url: '/class/mySyllabus',
                    templateUrl: 'app/mySyllabus/addMySyllabus/template.html',
                    controller: 'MySyllabusController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
