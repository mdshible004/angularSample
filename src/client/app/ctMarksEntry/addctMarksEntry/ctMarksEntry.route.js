


(function () {
    'use strict';

    angular
        .module('app.ctMarksEntry')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addCtMarksEntry',
                config: {
                    url: '/exams/ctMarksEntry',
                    templateUrl: 'app/ctMarksEntry/addctMarksEntry/template.html',
                    controller: 'CtMarksEntryController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
