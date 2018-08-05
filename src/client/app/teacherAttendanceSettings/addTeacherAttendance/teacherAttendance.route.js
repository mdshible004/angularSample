(function () {
    'use strict';

    angular
        .module('app.teacherAttendance')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addTeacherAttendance',
                config: {
                    url: '/settings/teacherattendancesettings',
                    templateUrl: 'app/teacherAttendanceSettings/addTeacherAttendance/template.html',
                    controller: 'TeacherAttendanceController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
