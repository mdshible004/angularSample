(function() {
    'use strict';

    angular
        .module('app.branchSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addBranch',
                config: {
                    url: '/settings/branchSettings',
                    templateUrl: 'app/branchSettings/addBranch/template.html',
                    controller: 'branchSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
