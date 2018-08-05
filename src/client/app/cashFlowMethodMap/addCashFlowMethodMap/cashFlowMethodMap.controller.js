(function () {
    'use strict';

    angular
        .module('app.cashFlowMethodMap')
        .controller('cashFlowMethodMapController', cashFlowMethodMapController);

    cashFlowMethodMapController.$inject = ['filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants','$localStorage'];
    /* @ngInject */
    function cashFlowMethodMapController(filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants,$localStorage) {

        var vm = this;

        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration

        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;

        $scope.listEvent = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.showItem = false;
            $scope.createItem = true;
        };

        // Reset Button Logic
        $scope.clearField = function () {

        };


        activate();

        function activate() {
            var promises = [];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }



    }
})();
