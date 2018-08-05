(function() {
    'use strict';

    angular
        .module('app.notificationSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addNotification',
                config: {
                    url: '/settings/notificationSettings',
                    templateUrl: 'app/notificationSettings/addnotification/template.html',
                    controller: 'notificationSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
