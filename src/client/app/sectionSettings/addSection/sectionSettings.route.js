(function() {
    'use strict';

    angular
        .module('app.sectionSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addSection',
                config: {
                    url: '/settings/sectionsettings',
                    templateUrl: 'app/sectionSettings/addSection/template.html',
                    controller: 'SectionSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
