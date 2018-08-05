(function() {
    'use strict';

    angular
        .module('app.leaveApplicationSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addLeaveApplication',
                config: {
                    url: '/settings/leaveApplicationsettings',
                    templateUrl: 'app/leaveApplicationSettings/addLeaveApplication/template.html',
                    controller: 'LeaveApplicationSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
