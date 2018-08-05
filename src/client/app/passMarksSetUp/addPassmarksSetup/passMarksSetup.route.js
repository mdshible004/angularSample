(function() {
    'use strict';

    angular
        .module('app.passMarksSetUp')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addPassmarksSetup',
                config: {
                    url: '/settings/passMarksSetUp',
                    templateUrl: 'app/passMarksSetUp/addPassmarksSetup/template.html',
                    controller: 'passMarksSetUpController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();