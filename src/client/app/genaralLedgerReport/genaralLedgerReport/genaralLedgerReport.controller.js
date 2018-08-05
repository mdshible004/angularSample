(function () {
    'use strict';

    angular
        .module('app.genaralLedgerReport')
        .controller('GenaralLedgerReportController', GenaralLedgerReportController);

    GenaralLedgerReportController.$inject = ['teacherAttendanceSevice', 'commonService','journalService','filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants','$localStorage'];
    /* @ngInject */
    function GenaralLedgerReportController(teacherAttendanceSevice, commonService, journalService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants,$localStorage) {



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

     $scope.clearField = function () {
         $state.go($state.current.name, {}, { reload: true });
     };


        activate();

        function activate() {
            var promises = [getInsBranchDdl(), getFiscalYear(), loadPartyList(), loadCOAList()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }


        function getInsBranchDdl() {


            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            var params = {
                InstituteID: $localStorage.userInfo[0].InstituteID
            };
            return teacherAttendanceSevice.getInsBranch(params)
                .then(function (data) {
                    vm.branches = data;
                });
        }



        function getFiscalYear() {

            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            return commonService.getCmnYear()
                .then(function (data) {
                    vm.years = data;
                });
        }

        function loadCOAList() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return journalService.getCOAList()
                .then(function (data) {
                    vm.COAList = data;
                });
        }

        function loadPartyList() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            return journalService.getPartyList()
                .then(function (data) {
                    vm.UserList = data;
                });
        }



     


    }
})();
