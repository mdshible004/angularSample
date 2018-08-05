


(function () {
    'use strict';

    angular
        .module('app.homeWorkEntry')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'homeWork',
                config: {
                    url: '/settings/homeWorkEntry',
                    templateUrl: 'app/homeWorkEntry/homeWorkEntry/template.html',
                    controller: 'homeWorkEntryController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
