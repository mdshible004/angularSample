(function() {
    'use strict';

    angular
        .module('app.AcademicCalendar')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'AcademicCalendar',
                config: {
                    url: '/settings/AcademicCalendar',
                    templateUrl: 'app/AcademicCalendar/academicCalendar/AcademicCalendar.html',
                    controller: 'AcademicCalendarController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
