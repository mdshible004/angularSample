(function() {
    'use strict';

    angular
        .module('app.relationSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addRelation',
                config: {
                    url: '/settings/relationSettings',
                    templateUrl: 'app/relationSettings/addRelation/template.html',
                    controller: 'relationSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
