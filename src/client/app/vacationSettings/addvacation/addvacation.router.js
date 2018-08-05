(function () {
    'use strict';

    angular
        .module('app.vacationSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addVacation',
                config: {
                    url: '/settings/vacationSettings',
                    templateUrl: 'app/vacationSettings/addvacation/template.html',
                    controller: 'vacationSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
