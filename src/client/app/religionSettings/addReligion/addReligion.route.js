(function() {
    'use strict';

    angular
        .module('app.religionSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addReligion',
                config: {
                    url: '/settings/religionSettings',
                    templateUrl: 'app/religionSettings/addReligion/template.html',
                    controller: 'religionSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
