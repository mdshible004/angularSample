(function() {
    'use strict';

    angular
        .module('app.moduleSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addModule',
                config: {
                    url: '/settings/modulesettings',
                    templateUrl: 'app/moduleSettings/module_settings/template.html',
                    controller: 'ModuleSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
