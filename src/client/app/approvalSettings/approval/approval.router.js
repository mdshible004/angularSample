


(function () {
    'use strict';

    angular
        .module('app.approvalSettings')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'addApproval',
                config: {
                    url: '/settings/approvalSettings',
                    templateUrl: 'app/approvalSettings/approval/template.html',
                    controller: 'ApprovalSettingsController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
