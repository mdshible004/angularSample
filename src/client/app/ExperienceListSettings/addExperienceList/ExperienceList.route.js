(function() {
    'use strict';

    angular
        .module('app.ExperienceListSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addExperienceList',
                config: {
                    url: '/settings/ExperienceListSettings',
                    templateUrl: 'app/ExperienceListSettings/addExperienceList/template.html',
                    controller: 'experienceListController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
