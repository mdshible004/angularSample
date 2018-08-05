(function () {
    'use strict';

    angular
        .module('app.sms')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'sms',
                config: {
                    url: '/order/sms',
                    templateUrl: 'app/sendSMS/sms/template.html',
                    controller: 'SMSController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
