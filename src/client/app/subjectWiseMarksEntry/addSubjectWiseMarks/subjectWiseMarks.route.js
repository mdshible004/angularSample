


(function () {
    'use strict';

    angular
        .module('app.subjectWiseMarksEntry')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'subjectWiseMarksForStudent',
                config: {
                    url: '/settings/subjectWiseMarks',
                    templateUrl: 'app/subjectWiseMarksEntry/addSubjectWiseMarks/template.html',
                    controller: 'subjectWiseMarksEntryController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
