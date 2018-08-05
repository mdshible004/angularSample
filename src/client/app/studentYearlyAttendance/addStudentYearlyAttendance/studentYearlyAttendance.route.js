(function () {
    'use strict';

    angular
        .module('app.studentYearlyAttendance')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addStudentYearlyAttendance',
                config: {
                    url: '/settings/studentYearlyAttendance',
                    templateUrl: 'app/studentYearlyAttendance/addStudentYearlyAttendance/template.html',
                    controller: 'StudentYearlyAttendanceController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
