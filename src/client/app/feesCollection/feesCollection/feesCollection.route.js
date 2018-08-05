(function() {
    'use strict';

    angular
        .module('app.feesCollection')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addFeesCollection',
                config: {
                    url: '/Fees/feesCollection/collect',
                    templateUrl: 'app/feesCollection/feesCollection/template.html',
                    controller: 'FeesCollectionController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();