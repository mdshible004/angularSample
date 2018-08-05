
(function () {
    'use strict';

    angular
        .module('app.studentYearlyAttendance')
        .controller('StudentYearlyAttendanceController', StudentYearlyAttendanceController);

    StudentYearlyAttendanceController.$inject = [ 'monthlyFeeService', 'classSettingsService', 'studentAtdReportSettingsService', 'subjectSettingsSevice', 'commonService', 'studentAttendanceSevice','conversion', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants','$localStorage', 'apiConfig'];
    /* @ngInject */
    function StudentYearlyAttendanceController( monthlyFeeService, classSettingsService, studentAtdReportSettingsService, subjectSettingsSevice, commonService, studentAttendanceSevice, conversion,filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants,$localStorage, apiConfig) {

        var vm = this;
       //==============for report header information ===
        $scope.imgHost = apiConfig.imagehost;
        $scope.InstituteLogo = $localStorage.userInfo[0].InstituteLogo;
        $scope.InsEmail = $localStorage.userInfo[0].InsEmail;
        $scope.InsAddress = $localStorage.userInfo[0].InsAddress;
        $scope.InsWeb = $localStorage.userInfo[0].InsWeb;
        $scope.InsPhoneNo = $localStorage.userInfo[0].InsPhoneNo;
        $scope.InstituteName = $localStorage.userInfo[0].InstituteName;

        // ============end report Heasder information===
        var CurrentYear = new Date().getFullYear();

        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.BranchID = $localStorage.userInfo[0].BrunchID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration
        $scope.CurrYear = new Date().getFullYear().toString();
        vm.CollectionPaymentID = 0;
        vm.CollectionID = 0;
        $scope.InstituteID = $localStorage.userInfo[0].InstituteID;
        $scope.InstituteName = $localStorage.userInfo[0].InstituteName;
        $scope.InsAddress = $localStorage.userInfo[0].InsAddress;
        $scope.InsPhoneNo = $localStorage.userInfo[0].InsPhoneNo;
        $scope.InsEmail = $localStorage.userInfo[0].InsEmail;
        $scope.InsWeb = $localStorage.userInfo[0].InsWeb;
        $scope.IsFine = $localStorage.userInfo[0].IsFine;
        $scope.InstituteLogo = $localStorage.userInfo[0].InstituteLogo;
        $scope.InstituteLogoUrl = vm.imgHost + $scope.InstituteLogo;
        // Create and Show list Container Hide or Show Logic
        $scope.showStudentFeesInfo = false;
        $scope.createItem = true;
        $scope.feesDetail = false;
        $scope.invoice = false;
        $scope.regedusersFirst = [];
        $scope.IsShowQT = 0;
        $scope.showListBtn = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.showGenerateFee = true;
            $scope.feesDetail = false;
            vm.paidAmounts = 0;
        };
        $scope.changeGrid = function () {
            vm.attendances = [];
            $scope.showItem = false;
        };
        $scope.changeGridsec = function () {
            vm.attendances = [];
            $scope.showItem = false;
            vm.StudentList = [];
            
        };

        $scope.showMonthlyInfo = function () {
            $scope.feesDetails = [];
            $scope.fineDetails = [];
            $scope.showStudentFeesInfo = true;
            $scope.createItem = false;
            $scope.feesDetail = false;
            //studentMonthlyFeesInfo();
        };
        $scope.HoldFromMonthID = null;
        $scope.HoldToMonthID = null;

        $scope.MonthFromToValidation = function () {
            var FMID = vm.FromMonthID === undefined || vm.FromMonthID === null ? 0 : vm.FromMonthID;
            var TMID = vm.monthID === undefined || vm.monthID === null ? 0 : vm.monthID;
            if (FMID > TMID && FMID !== 0 && TMID !== 0) {
                vm.FromMonthID = vm.monthID;
                vm.Fmon = { selected: vm.months.filter(function (ob, i) { return (ob.MonthID === vm.monthID); })[0] };
            }
        };

        $scope.MnthName = '';
        $scope.FromMonthName = '';
        $scope.ToMonthName = '';
        $scope.SetMonthName = function () {
            var MonthModel = '';
            if (vm.monthID !== null && vm.monthID !== undefined) {
                MonthModel = vm.months.filter(function (ob, i) { return (ob.MonthID === vm.monthID); })[0];
                if (MonthModel !== undefined && MonthModel !== null) {
                    $scope.ToMonthName = MonthModel.MonthName;
                }
            }

            if (vm.FromMonthID !== null && vm.FromMonthID !== undefined) {
                MonthModel = vm.months.filter(function (ob, i) { return (ob.MonthID === vm.FromMonthID); })[0];
                if (MonthModel !== undefined && MonthModel !== null) {
                    $scope.FromMonthName = MonthModel.MonthName;
                }
            }

            if ((vm.FromMonthID === undefined || vm.FromMonthID === null) || (vm.FromMonthID === vm.monthID)) {
                $scope.MnthName = 'For the month of ' + $scope.ToMonthName;
            }
            else {
                $scope.MnthName = 'From: ' + $scope.FromMonthName + ' To: ' + $scope.ToMonthName;
            }

        };
        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        $scope.feesDetails = [

        ];

        $scope.btnDiss = true;

        vm.getStudents = function () {
  
                $('#myModal').modal('show'); //jshint ignore : line
                $scope.showStudentFeesInfo = false;
                $scope.feesDetails = [];
                vm.monthlyFees = [];
                var Params = {
                    SectionID: (vm.SectionID === undefined) ? 0 : vm.SectionID,
                    MediumID: (vm.mediumID === undefined) ? 0 : vm.mediumID,
                    ClassID: (vm.classID === undefined) ? 0 : vm.classID,
                    DepertmentID: (vm.depertmentID === undefined) ? 0 : vm.depertmentID,
                    InstituteID: $localStorage.userInfo[0].InstituteID
                };
                return studentAttendanceSevice.GetAllStudentsByParams(Params)
                    .then(function (data) {
                        if (data.length > 0) {
                            vm.StudentList = data;

                        }
                    });
           // }
        };

        $scope.UserID = 0;

        $scope.SetRFID = function (RFID, UserID) {
            //debugger
            $scope.RFID = RFID;
            $scope.UserID = UserID;
        };





        vm.getStudentYearlyAttendance = function () {
            //debugger;
            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line
            var Years = parseInt(vm.YearName);
            if (Years <= CurrentYear) {
                $scope.showStudentFeesInfo = false;

                var Params = {
                    SectionID: (vm.SectionID === undefined) ? null : vm.SectionID,
                    MediumID: (vm.mediumID === undefined) ? null : vm.mediumID,
                    ClassID: (vm.classID === undefined) ? null : vm.classID,
                    DepertmentID: (vm.depertmentID === undefined) ? null : vm.depertmentID,
                    ToMonthID: vm.monthID === undefined || vm.monthID === null ? 0 : vm.monthID,
                    FromMonthID: vm.FromMonthID === undefined || vm.FromMonthID === null ? 0 : vm.FromMonthID,
                    InstituteID: $localStorage.userInfo[0].InstituteID,
                    RFID: $scope.UserID,
                    YearID: parseInt(vm.YearName)
                };

                studentAttendanceSevice.getStudentYearlyAttendance(Params)
                    .then(function (data) {
                        vm.attendances = data;
                        $scope.showItem = true;

                    });
            }
            else {
                logger.warning('You can not get data greater than current year');
            }

        };

        $scope.SetOnBlurRFID = function (RFID, OnEnter) {
            if ($scope.RFID === '' || $scope.RFID === undefined || $scope.RFID === null) {
                $scope.btnDiss = true;
            }
            else {
                $scope.btnDiss = false;
            }
            if (RFID !== undefined && RFID !== '') {
                var Params = {
                    InstituteID: $localStorage.userInfo[0].InstituteID,
                    RFID: RFID
                };
                return monthlyFeeService.getUserInfo(Params)
                    .then(function (data) {
                        //debugger;
                        if (data.length > 0) {
                            vm.SectionID = data[0].SectionID;
                            vm.mediumID = data[0].MediumID;
                            vm.classID = data[0].ClassID;
                            vm.depertmentID = data[0].DepartmentID;
                            $scope.UserID = data[0].UserID;
                            vm.getStudentYearlyAttendance();
                            if (OnEnter.keyCode === 13) {
                                OnEnter.preventDefault();
                                vm.getStudentYearlyAttendance();
                            }
                        }
                    });
            }
        };

        //CurrentDate Logic
        $scope.CurrentDate = new Date();
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        today = yyyy + '-' + mm + '-' + dd;
        $scope.OnDate = today;


        vm.printDiv = function printElem(print) {
            //debugger;
            var contents = document.getElementById(print).innerHTML;
            var frame1 = document.createElement('iframe');
            frame1.name = 'frame1';
            frame1.style.position = 'absolute';
            frame1.style.top = '-1000000px';
            document.body.appendChild(frame1);
            var frameDoc = (frame1.contentWindow) ? frame1.contentWindow : (frame1.contentDocument.document) ? frame1.contentDocument.document : frame1.contentDocument;
            frameDoc.document.open();
            frameDoc.document.write('<html><head><title></title>');
            frameDoc.document.write('</head></br></br><body>');
            frameDoc.document.write(contents);
            //frameDoc.document.write('<footer style="position: fixed;bottom: 70;"> <font color="green">Powered By:</font><font color="blue"> onAir International Ltd. </font></footer></html>');
            frameDoc.document.write('<footer style="position: fixed;bottom: 0;"> <font color="green">Powered By:</font><font color="blue"> onAir International Ltd. </font><br><font color="green">Web URL:</font><font color="blue">  www.onems.live </font></footer></html>');
            frameDoc.document.write('</br></br></body>');
            //frameDoc.document.write('<footer style="position: fixed;bottom: 0;"> <font color="green">Powered By:</font><font color="blue"> onAir International Ltd. </font></footer></html>');
            frameDoc.document.close();
            setTimeout(function () {
                window.frames['frame1'].focus();
                window.frames['frame1'].print();
                document.body.removeChild(frame1);
            }, 100);
            return false;
        };

        $scope.itemEvent = function () {
            $scope.clearField();
        };

 


        activate();
        function activate() {
            var promises = [getAllYear(), getAllMedium(), getAllMonth()];
            return $q.all(promises).then(function () {
            });
        }

        function getAllYear() {
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            return commonService.getCmnYear()
                .then(function (data) {
                    //data.push({ ShiftID: 0, ShiftName: 'None' });
                    vm.YearList = data;                    
                    vm.YearName = $scope.CurrYear;
                    vm.year = {
                        selected: vm.YearList.filter(function (ob, i) {
                            return (ob.YearName === vm.YearName);
                        })[0]
                    };
                });
        }



        function getAllMedium() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteMediumDdl(Params)
                .then(function (data) {
                    //data.push({ MediumID: 0, MameName: 'None' });
                    vm.mediums = data;
                });
        }
        vm.getAllClass = function (status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                MediumID: vm.mediumID
            };
            return subjectSettingsSevice.getMediumWiseClassDDL(Params)
                .then(function (data) {
                    //data.push({ ClassID: 0, ClassName: 'None' });
                    vm.classes = data;
                    if (status === 'Edit') {
                        vm.class = {
                            selected: vm.classes.filter(function (ob, i) {
                                return (ob.ClassID === vm.classID);
                            })[0]
                        };
                    }
                });
        };
        vm.getAllDepertment = function (ClassID) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                ClassID: ClassID,
                MediumID: vm.mediumID
            };
            return subjectSettingsSevice.getClassWiseDepartmentDDL(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        vm.departments = data;
                        $scope.req = true;
                        //vm.ClassSelected();
                    }
                    else {
                        $scope.req = false;
                        vm.ClassSelected();
                    }
                });
        };

        function getAllMonth() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            return studentAtdReportSettingsService.getMonths()
                .then(function (data) {
                    vm.months = data;
                });
        }
        vm.ClassSelected = function (ID, Status) {
            if (status === '') {
                vm.SectionID = null;
                vm.section = undefined;
                vm.sections = [];
            }

            var params = {
                instituteId: $localStorage.userInfo[0].InstituteID,
                classId: vm.classID,
                DepartmentID: vm.depertmentID === undefined ? 0 : vm.depertmentID
            };

            commonService.getInstituteSection(params)
                .then(function (data) {
                    if(data.length>0){
                        vm.sections = data;
                        $scope.secReq=true;
                                }
                    else{
                            $scope.secReq=false;
                            }
                    
                });
        };


    }
})();

