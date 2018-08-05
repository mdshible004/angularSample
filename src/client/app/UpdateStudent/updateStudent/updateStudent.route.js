(function() {
    'use strict';

    angular
        .module('app.UpdateStudent')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'UpdateStudent',
                config: {
                    url: '/settings/UpdateStudent',
                    templateUrl: 'app/UpdateStudent/updateStudent/template.html',
                    controller: 'UpdateStudentController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();