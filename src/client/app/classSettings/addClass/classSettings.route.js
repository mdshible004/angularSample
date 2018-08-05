(function() {
    'use strict';

    angular
        .module('app.classSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addClass',
                config: {
                    url: '/settings/classsettings',
                    templateUrl: 'app/classSettings/addClass/template.html',
                    controller: 'ClassSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
