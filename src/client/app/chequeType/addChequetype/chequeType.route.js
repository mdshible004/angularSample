(function() {
    'use strict';

    angular
        .module('app.chequeType')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addChequetype',
                config: {
                    url: '/settings/chequeType',
                    templateUrl: 'app/chequeType/addChequetype/template.html',
                    controller: 'chequeTypeController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
