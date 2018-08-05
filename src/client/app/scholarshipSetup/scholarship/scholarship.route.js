(function() {
    'use strict';

    angular
        .module('app.scholarshipSetup')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'scholarship',
                config: {
                    url: '/settings/scholarshipSetup',
                    templateUrl: 'app/scholarshipSetup/scholarship/template.html',
                    controller: 'scholarshipController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
