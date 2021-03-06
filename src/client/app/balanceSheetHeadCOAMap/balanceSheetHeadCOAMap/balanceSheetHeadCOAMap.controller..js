(function () {
    'use strict';

    angular
        .module('app.balanceSheetHeadCOAMap')
        .controller('BalanceSheetHeadCOAMapController', BalanceSheetHeadCOAMapController);

    BalanceSheetHeadCOAMapController.$inject = ['filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants',' $localStorage'];
    /* @ngInject */
    function BalanceSheetHeadCOAMapController( filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

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
     $scope.createItem=true;
      $scope.showItem = true;




        activate();

        function activate() {
            var promises = [];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }

   


     


    }
})();
