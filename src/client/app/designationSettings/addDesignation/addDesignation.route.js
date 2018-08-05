(function() {
    'use strict';

    angular
        .module('app.designationSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addDesignation',
                config: {
                    url: '/settings/designationSettings',
                    templateUrl: 'app/designationSettings/addDesignation/template.html',
                    controller: 'designationSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
