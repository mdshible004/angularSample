(function () {
    'use strict';

    angular
        .module('app.menuSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addMenu',
                config: {
                    url: '/settings/menusettings',
                    templateUrl: 'app/menuSettings/menu_settings/template.html',
                    controller: 'MenuSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
