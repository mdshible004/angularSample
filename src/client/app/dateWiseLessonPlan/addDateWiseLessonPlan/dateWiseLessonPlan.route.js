(function() {
    'use strict';

    angular
        .module('app.dateWiseLessonPlan')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addDateWiseLessonPlan',
                config: {
                    url: '/class/dateWiseLessonPlan',
                    templateUrl: 'app/dateWiseLessonPlan/addDateWiseLessonPlan/template.html',
                    controller: 'DateWiseLessonPlanController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
