(function() {
    'use strict';

    angular
        .module('app.addressSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addAdress',
                config: {
                    url: '/settings/addressSettings',
                    templateUrl: 'app/addressSettings/addaddress/template.html',
                    controller: 'addressSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
