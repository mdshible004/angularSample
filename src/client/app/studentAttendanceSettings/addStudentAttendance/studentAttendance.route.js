(function () {
    'use strict';

    angular
        .module('app.studentAttendance')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addStudentAttendance',
                config: {
                    url: '/settings/studentattendancesettings',
                    templateUrl: 'app/studentAttendanceSettings/addStudentAttendance/template.html',
                    controller: 'StudentAttendanceController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
