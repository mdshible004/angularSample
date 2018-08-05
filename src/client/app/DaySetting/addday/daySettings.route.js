(function() {
    'use strict';

    angular
        .module('app.daySettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addday',
                config: {
                    url: '/settings/WeekendSettings',
                    templateUrl: 'app/DaySetting/addday/template.html',
                    controller: 'daySettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
