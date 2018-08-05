(function() {
    'use strict';

    angular
        .module('app.dailySubWiseAtdSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'AddDailySubWiseAtd',
                config: {
                    url: '/Attendence/dailySubWiseAtdSettings/dailySubWiseAtd',
                    templateUrl: 'app/dailySubWiseAtd/dailySubWiseAtd/template.html',
                    controller: 'DailySubWiseAtdSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();