(function() {
    'use strict';

    angular
        .module('app.employeeSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addEmployee',
                config: {
                    url: '/add/employee',
                    templateUrl: 'app/employeeSettings/add_new_employee/template.html',
                    controller: 'AddEmployeeController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
