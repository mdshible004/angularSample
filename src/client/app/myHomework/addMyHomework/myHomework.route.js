(function() {
    'use strict';

    angular
        .module('app.myHomework')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addMyHomework',
                config: {
                    url: '/class/myHomework',
                    templateUrl: 'app/myHomework/addMyHomework/template.html',
                    controller: 'MyHomeworkController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
