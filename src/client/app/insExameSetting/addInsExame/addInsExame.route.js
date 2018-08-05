(function() {
    'use strict';

    angular
        .module('app.insExameSetting')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addInsExame',
                config: {
                    url: '/institute/insExameSetting',
                    templateUrl: 'app/insExameSetting/addInsExame/template.html',
                    controller: 'insExameSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();