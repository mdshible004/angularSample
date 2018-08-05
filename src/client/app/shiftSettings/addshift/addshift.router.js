(function () {
    'use strict';

    angular
        .module('app.shiftSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addShift',
                config: {
                    url: '/settings/shiftSettings',
                    templateUrl: 'app/shiftSettings/addshift/template.html',
                    controller: 'shiftSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
