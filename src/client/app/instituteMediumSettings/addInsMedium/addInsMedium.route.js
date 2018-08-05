(function() {
    'use strict';

    angular
        .module('app.instituteMediumSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addInsMedium',
                config: {
                    url: '/settings/instituteMediumSettings',
                    templateUrl: 'app/instituteMediumSettings/addInsMedium/template.html',
                    controller: 'instituteMediumSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();