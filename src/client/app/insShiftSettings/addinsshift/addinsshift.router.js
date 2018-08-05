(function() {
    'use strict';

    angular
        .module('app.insShiftSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addInsShift',
                config: {
                    url: '/settings/insShiftSettings',
                    templateUrl: 'app/insShiftSettings/addinsshift/template.html',
                    controller: 'insShiftSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
