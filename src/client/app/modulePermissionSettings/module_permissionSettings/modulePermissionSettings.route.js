(function() {
    'use strict';

    angular
        .module('app.modulePermissionSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addModulePermission',
                config: {
                    url: '/settings/modulepermissionsettings',
                    templateUrl: 'app/modulePermissionSettings/module_permissionSettings/template.html',
                    controller: 'ModulePermissionSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
