(function () {
    'use strict';

    angular
        .module('app.manualTeacherAttendance')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addManualTeacherAttendance',
                config: {
                    url: '/settings/manualteacherattendancesettings',
                    templateUrl: 'app/manualTeacherAttendance/addManualTeacherAttendance/template.html',
                    controller: 'ManualTeacherAttendanceController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
