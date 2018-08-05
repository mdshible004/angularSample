(function() {
    'use strict';

    angular
        .module('app.subjectSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addSubject',
                config: {
                    url: '/settings/subjectsettings',
                    templateUrl: 'app/subjectSettings/addSubject/template.html',
                    controller: 'SubjectSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
