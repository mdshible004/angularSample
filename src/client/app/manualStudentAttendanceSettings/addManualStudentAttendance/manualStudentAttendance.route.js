(function () {
    'use strict';

    angular
        .module('app.manualStudentAttendance')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addManualStudentAttendance',
                config: {
                    url: '/settings/manualstudentattendancesettings',
                    templateUrl: 'app/manualStudentAttendanceSettings/addManualStudentAttendance/template.html',
                    controller: 'ManualStudentAttendanceController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
