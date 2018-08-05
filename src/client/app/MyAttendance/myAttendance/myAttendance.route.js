(function() {
    'use strict';

    angular
        .module('app.MyAttendance')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'myAttendance',
                config: {
                    url: '/settings/myAttendance/myAttendanceReport',
                    templateUrl: 'app/MyAttendance/myAttendance/template.html',
                    controller: 'myAttendanceController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();