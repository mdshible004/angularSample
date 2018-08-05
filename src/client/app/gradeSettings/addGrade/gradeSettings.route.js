(function() {
    'use strict';

    angular
        .module('app.gradeSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addGrade',
                config: {
                    url: '/settings/gradesettings',
                    templateUrl: 'app/gradeSettings/addGrade/template.html',
                    controller: 'GradeSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
