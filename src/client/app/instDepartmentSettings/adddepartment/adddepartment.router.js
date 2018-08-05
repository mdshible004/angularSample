(function() {
    'use strict';

    angular
        .module('app.instDepartmentSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addDepartment',
                config: {
                    url: '/settings/instDepartmentSettings',
                    templateUrl: 'app/instDepartmentSettings/adddepartment/template.html',
                    controller: 'instDepartmentSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
