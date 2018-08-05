(function() {
    'use strict';

    angular
        .module('app.mediumWiseClass')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'AddmediumWiseClass',
                config: {
                    url: '/settings/mediumWiseClass/addClass',
                    templateUrl: 'app/mediumWiseClass/midWiseclassSetup/template.html',
                    controller: 'mediumWiseClassSetupController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();