(function() {
    'use strict';

    angular
        .module('app.generateCheckBook')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'AddGenerateCheckBook',
                config: {
                    url: '/Checkbook/Generate',
                    templateUrl: 'app/generateCheckBook/generateCheckBook/template.html',
                    controller: 'GenerateCheckBookController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();