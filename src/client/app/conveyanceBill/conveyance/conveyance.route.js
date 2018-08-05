(function() {
    'use strict';

    angular
        .module('app.conveyanceBill')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'conveyance',
                config: {
                    url: '/settings/conveyanceBill',
                    templateUrl: 'app/conveyanceBill/conveyance/template.html',
                    controller: 'conveyanceController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
