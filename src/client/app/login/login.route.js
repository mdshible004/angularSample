(function() {
    'use strict';

    angular
        .module('app.login')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'login',
                config: {
                    url: '/dashboard',
                    templateUrl: 'app/login/login.html',
                    controller: 'loginController',
                    controllerAs: 'vm',
                    title: 'login'
                }
            },
			{
				state: 'logout',
                config: {
                    controller: 'logoutController',
                    controllerAs: 'vm',
                    title: 'logout'
                },
			}
        ];
    }
})();
