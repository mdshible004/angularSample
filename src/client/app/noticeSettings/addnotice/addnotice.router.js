(function() {
    'use strict';

    angular
        .module('app.noticeSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addNotice',
                config: {
                    url: '/settings/noticeSettings',
                    templateUrl: 'app/noticeSettings/addnotice/template.html',
                    controller: 'noticeSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
