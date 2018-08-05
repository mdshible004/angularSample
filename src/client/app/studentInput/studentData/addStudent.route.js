(function() {
    'use strict';

    angular
        .module('app.studentInput')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'studentData',
                config: {
                    url: '/add/studentInput',
                    templateUrl: 'app/studentInput/studentData/template.html',
                    controller: 'studentDataController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
