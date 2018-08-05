(function () {
    'use strict';

    angular
		.module('app.feesCollection')
		.controller('FeesCollectionController', FeesCollectionController);

        FeesCollectionController.$inject = ['feesCollectionService','commonService','studentAtdReportSettingsService','dailySubWiseAtdSettingsService','shiftSettings','mediumsetting','classSettings','sectionSettingsSevice','filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope','$state','Upload','$timeout','$http','$interval','uiGridConstants','$localStorage'];
    /* @ngInject */
    function FeesCollectionController(feesCollectionService, commonService, studentAtdReportSettingsService,dailySubWiseAtdSettingsService,shiftSettings,mediumsetting,classSettings,sectionSettingsSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants,$localStorage ) {



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


        $scope.InstituteID = $localStorage.userInfo[0].InstituteID;
        
    
     // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.itemEvent = function () {
            //$scope.IsVisible = $scope.IsVisible ? false : true;
            $scope.showItem = true;
            $scope.createItem = false;

        };
        $scope.listEvent = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.showItem = false;
            $scope.createItem = true;
        };
        
        // Reset Button Logic
        $scope.clearField = function() {
            $state.go($state.current.name, {}, {reload: true});
        };

        // +params.shiftID +'/'+params.deptID+'/'+params.mediumID+'/'+params.classID+'/'+params.sectionID+'/'+params.studentID
        vm.getStudent = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



                       if(vm.MonthID===undefined){
                logger.error('Please select Month');
                
            }else{
            var Params = {
                shiftID: (vm.shiftID === undefined) ? 0 : vm.shift.selected.ShiftID,
                deptID: (vm.DepartmentID === undefined) ? 0 : vm.depertment.selected.DepartmentID,
                mediumID: (vm.MediumID === undefined) ? 0 : vm.medium.selected.MediumID,
                classID: (vm.ClassID === undefined) ? 0 : vm.class.selected.ClassID,
                sectionID: (vm.sectionID === undefined) ? 0 : vm.section.selected.SectionID,
                studentID: ( vm.feeCollection.StudentName === undefined) ? 0 : vm.feeCollection.StudentName,

            };
             feesCollectionService.getStudentForFeeCollections(Params)

            .then(function (data) {
                vm.getStd = data;
            });
          }
        };

        activate();

        function activate() {
            var promises = [getAllShift(),getAllMedium(),getAllClass(),getAllDepertment(),getAllMonth()];
            return $q.all(promises).then(function() {
                // logger.info('Activated Order List View');
            });
        }

        vm.ClassSelected = function (classId) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var params = {
                instituteId: $localStorage.userInfo[0].InstituteID,
                classId: classId
            };

            commonService.getInstituteSection(params)
                .then(function (data) {
                    vm.sections = data;
                });

        };


        
        function getAllShift() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var Params = {
                instituteId : $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteShift(Params)
            .then(function(data){
                vm.shifts = data;
            });
        }
        
        function getAllMedium() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var Params = {
                instituteId : $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteMedium(Params)
            .then(function(data){
                vm.mediums = data;
            });
        }
        function getAllClass() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var Params = {
                instituteId : $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteClass(Params)

            .then(function(data){
                vm.classes = data;
            });
        }
        function getAllDepertment() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var Params = {
                instituteId : $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteDepertment(Params)

            .then(function(data){
                vm.depertments = data;
            });
        }

        function getAllMonth() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line




            return studentAtdReportSettingsService.getMonths()
            .then(function(data){
                vm.months = data;
            });
        }



  
    }
})();
