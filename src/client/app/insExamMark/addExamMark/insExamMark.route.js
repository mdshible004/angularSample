(function() {
    'use strict';

    angular
        .module('app.insExamMark')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addExamMark',
                config: {
                    url: '/settings/insExamMark',
                    templateUrl: 'app/insExamMark/addExamMark/template.html',
                    controller: 'insExamMarkController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();