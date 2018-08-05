(function() {
    'use strict';

    angular
        .module('app.FineHead')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'FineHead',
                config: {
                    url: '/settings/FineHead',
                    templateUrl: 'app/FineHead/FineHead/template.html',
                    controller: 'FineController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
