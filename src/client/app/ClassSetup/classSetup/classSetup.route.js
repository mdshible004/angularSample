(function() {
    'use strict';

    angular
        .module('app.classSetup')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addClassSetup',
                config: {
                    url: '/settings/classSetup/addClass',
                    templateUrl: 'app/ClassSetup/classSetup/template.html',
                    controller: 'ClassSetupController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
