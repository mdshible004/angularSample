(function () {
    'use strict';

    angular
        .module('app.paymentInfo')
        .controller('PaymentInfoController', PaymentInfoController);

    PaymentInfoController.$inject = ['paymentInfoSevice', 'userRegistrationService', 'myAttendanceService','classSettingsService','commonService', 'subjectSettingsSevice', 'studentAtdReportSettingsService', 'dailySubWiseAtdSettingsService', 'shiftSettings', 'mediumsetting', 'classSettings', 'sectionSettingsSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function PaymentInfoController(paymentInfoSevice, userRegistrationService, myAttendanceService,classSettingsService,commonService, subjectSettingsSevice, studentAtdReportSettingsService, dailySubWiseAtdSettingsService, shiftSettings, mediumsetting, classSettings, sectionSettingsSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {



        var vm = this;
       
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.UserTypeID = $localStorage.userInfo[0].UserTypeID;

        vm.MediumID = $localStorage.userInfo[0].MediumID;
        vm.ClassID = $localStorage.userInfo[0].ClassID;
        vm.DepartmentID = $localStorage.userInfo[0].DepartmentID;
        vm.ShiftID = $localStorage.userInfo[0].ShiftID;
        vm.SectionID = $localStorage.userInfo[0].SectionID;
        vm.RFID = $localStorage.userInfo[0].RFID;
        vm.UserInfoList = [];
        var a = new Date();
        var b = a.getMonth();
        vm.abc = b;
        $scope.showItemForTeacher = false;

        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        
       



        $scope.InstituteID = $localStorage.userInfo[0].InstituteID;

        $scope.printthis2 = false;
      
        $scope.showItem = false;
        $scope.createItem = true;
        
        $scope.itemEvent = function () {
           
            $scope.showItem = true;
            $scope.createItem = false;

        };
        $scope.listEvent = function () {
           
            $scope.showItem = false;
            $scope.createItem = true;
        };

      
        $scope.clearField = function () {

            $state.go($state.current.name, {}, { reload: true });
        };

        $scope.changeGrid = function () {
            vm.monAtd = [];
            vm.monthlyAtd = [];
            vm.AllSubjectAtd = [];
            $scope.showItem = false;
        };
      

        vm.printDiv = function printElem(print) {
            var content = document.getElementById(print).innerHTML;
            var mywindow = window.open('', 'Print', 'height=1000,width=2000');

            mywindow.document.write('<html><head><title>Print</title>');
            mywindow.document.write('</head><body >');
            mywindow.document.write(content);
            mywindow.document.write('</body></html>');

            mywindow.document.close();
            mywindow.focus();
            mywindow.print();
            mywindow.close();
            return true;
        };
   
        $scope.getPaymentInfoByUserID = function () {
            var params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                UserID: $localStorage.userInfo[0].UserID
            };

            paymentInfoSevice.getPaymentInfoByUserID(params)
                .then(function (data) {
                    // debugger;
                    vm.paymentInfos = data;

                });
        };
        $scope.getStudentDDLforGuardian = function () {
            var params = {
                InstituteID: vm.InstituteID,
                LoggedUserID: vm.LoggedUserID
            };

            classSettingsService.getDashUserInfo(params)
                .then(function (data) {
                    // debugger;
                    vm.UserInfoList = data;
                    vm.UID = data[0].UserID;
                    if (data.length === 1) {
                        //vm.user.selected.UserID;
                        vm.user = {
                            selected: vm.UserInfoList.filter(function (ob, i) {
                                return (ob.UserID === vm.UID);
                            })[0]
                        };
                        $scope.studentInfo(vm.UID);
                        $scope.showDDL = false;
                        $scope.dis = true;
                        
                    }
                    else {
                        $scope.showDDL = true;
                        $scope.dis = false;
                    }
                    //$scope.getStudentPeriod();
                });
        };
        vm.regedusersShow = '';
        $scope.studentInfo = function (uid) {

            $scope.UserID = /*'11112861'*/uid;
            return userRegistrationService.getCmnUserResistrationByUserID($scope.UserID)
                .then(function (data) {
                    vm.regedusersShow = '';
                    if (data.length > 0) {
                        vm.regedusers = data;
                        vm.regedusersShow = vm.regedusers.filter(function (ob, i) { return (ob.IsActive === true); })[0];
                        vm.indexLenth = data.length;
                        vm.ImageUrl = data[0].ImageUrl === 'undefined' || data[0].ImageUrl === undefined || data[0].ImageUrl === null || data[0].ImageUrl === 'null' ? null : data[0].ImageUrl;
                        $scope.showItem = true;
                    }

                });

        };
        activate();

        function activate() {
            var promises = [getUserTypeWiseInfo()];
            return $q.all(promises).then(function () {
            });
        }

        

      
        //--------------------------------load for dropdown ------------------------------

        

        function getUserTypeWiseInfo() {
            if (vm.UserTypeID === 3) {
                $scope.studentInfo($localStorage.userInfo[0].UserID);
                $scope.getPaymentInfoByUserID();
                $scope.showDDL = false;
            }
            else if (vm.UserTypeID === 5) {
                
                $scope.getStudentDDLforGuardian();
                $scope.getPaymentInfoByUserID();
                $scope.showDDL = true;
                //$scope.getPaymentInfoByUserID();
            }
            else {
                $scope.getPaymentInfoByUserID();
                console.log('Shibli');
            }

        }

    }
})();
