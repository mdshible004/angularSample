(function() {
    'use strict';

    angular
        .module('app.studentAtdReportSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'AddStudentAtdReport',
                config: {
                    url: '/settings/studentAtdReportSettings/studentAtdReport',
                    templateUrl: 'app/studentAtdReport/studentAtdReport/template.html',
                    controller: 'StudentAtdReportSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();