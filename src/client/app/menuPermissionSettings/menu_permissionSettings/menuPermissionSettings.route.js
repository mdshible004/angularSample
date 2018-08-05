(function() {
    'use strict';

    angular
        .module('app.menuPermissionSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addMenuPermission',
                config: {
                    url: '/settings/menupermissionsettings',
                    templateUrl: 'app/menuPermissionSettings/menu_permissionSettings/template.html',
                    controller: 'MenuPermissionSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
