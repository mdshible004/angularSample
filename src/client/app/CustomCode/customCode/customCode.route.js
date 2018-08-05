(function() {
    'use strict';

    angular
        .module('app.CustomCode')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addCustomCode',
                config: {
                    url: '/settings/customCode/addcustomCode',
                    templateUrl: 'app/CustomCode/customCode/customcode.html',
                    controller: 'CustomCodeController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
