(function () {
    'use strict';

    angular
        .module('app.monthlyClassWiseAttendance')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addMonthlyClassWiseAttendance',
                config: {
                    url: '/settings/monthlyClassWiseAttendance',
                    templateUrl: 'app/monthlyClassWiseAttendance/addMonthlyClassWiseAttendance/template.html',
                    controller: 'MonthlyClassWiseAttendanceController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
