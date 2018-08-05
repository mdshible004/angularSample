(function() {
    'use strict';

    angular
        .module('app.mailSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addMail',
                config: {
                    url: '/settings/mailSettings',
                    templateUrl: 'app/mailSettings/addmail/template.html',
                    controller: 'mailSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
