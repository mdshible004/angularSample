


(function () {
    'use strict';

    angular
        .module('app.classTestSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addClassTestSettings',
                config: {
                    url: '/exams/classTestSettings',
                    templateUrl: 'app/classTestSettings/addClassTestSettings/template.html',
                    controller: 'ClassTestSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
