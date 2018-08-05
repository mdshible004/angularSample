


(function () {
    'use strict';

    angular
        .module('app.StudentWiseMarksEntry')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'studentWiseMarks',
                config: {
                    url: '/settings/StudentWiseMarks',
                    templateUrl: 'app/StudentWiseMarksEntry/studentWiseMarksEntry/template.html',
                    controller: 'StudentWiseMarksEntryController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
