(function() {
    'use strict';

    angular
        .module('app.FeeHead')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'FeeHead',
                config: {
                    url: '/settings/FeeHead',
                    templateUrl: 'app/FeeHead/FeeHead/template.html',
                    controller: 'FeeController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
