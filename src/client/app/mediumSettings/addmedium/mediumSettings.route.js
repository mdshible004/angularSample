(function() {
    'use strict';

    angular
        .module('app.mediumSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addmedium',
                config: {
                    url: '/settings/mediumSettings',
                    templateUrl: 'app/mediumSettings/addmedium/template.html',
                    controller: 'mediumSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
