


(function () {
    'use strict';

    angular
        .module('app.admitCard')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'admitCardGenerate',
                config: {
                    url: '/Exam/admitCard',
                    templateUrl: 'app/admitCard/admitCard/template.html',
                    controller: 'admitCardController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
