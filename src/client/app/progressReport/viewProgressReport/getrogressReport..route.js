


(function () {
    'use strict';

    angular
        .module('app.progressReport')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'progressReporStudentReport',
                config: {
                    url: '/settings/viewProgressReport',
                    templateUrl: 'app/progressReport/viewProgressReport/template.html',
                    controller: 'progressReportEntryControllerForReport',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
