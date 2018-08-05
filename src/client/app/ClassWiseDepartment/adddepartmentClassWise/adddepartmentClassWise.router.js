(function() {
    'use strict';

    angular
        .module('app.ClassWiseDepartment')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addClassDepartment',
                config: {
                    url: '/settings/ClassWiseDepartment',
                    templateUrl: 'app/ClassWiseDepartment/adddepartmentClassWise/template.html',
                    controller: 'ClassWiseDepartmentSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
