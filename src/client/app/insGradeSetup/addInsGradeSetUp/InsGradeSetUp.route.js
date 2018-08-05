(function() {
    'use strict';

    angular
        .module('app.insGradeSetup')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addInsGradeSetUp',
                config: {
                    url: '/institute/insGradeSetup',
                    templateUrl: 'app/insGradeSetup/addInsGradeSetUp/template.html',
                    controller: 'insGradeSetupController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();