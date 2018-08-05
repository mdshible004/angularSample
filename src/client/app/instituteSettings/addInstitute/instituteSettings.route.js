(function() {
    'use strict';

    angular
        .module('app.instituteSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addInstitute',
                config: {
                    url: '/settings/instituteSettings',
                    templateUrl: 'app/instituteSettings/addInstitute/template.html',
                    controller: 'instituteSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
