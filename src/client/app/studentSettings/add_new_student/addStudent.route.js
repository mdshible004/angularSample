(function() {
    'use strict';

    angular
        .module('app.studentSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addStudent',
                config: {
                    url: '/add/student',
                    templateUrl: 'app/studentSettings/add_new_student/template.html',
                    controller: 'AddStudentController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
