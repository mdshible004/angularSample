(function () {
    'use strict';

    angular
        .module('app.holidaySettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'holiday',
                config: {
                    url: '/settings/holidaySettings',
                    templateUrl: 'app/holidaySettings/addHoliday/Holiday.html',
                    controller: 'HolidaySettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
