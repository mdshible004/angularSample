(function() {
    'use strict';

    angular
        .module('app.syllabus')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addSyllabus',
                config: {
                    url: '/class/syllabus',
                    templateUrl: 'app/syllabusEntry/addSyllabus/template.html',
                    controller: 'SyllabusController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
