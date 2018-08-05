(function () {
    'use strict';

    angular
        .module('app.MyAttendance')
        .controller('myAttendanceController', myAttendanceController);

    myAttendanceController.$inject = ['myAttendanceService', 'classSettingsService', 'commonService', 'subjectSettingsSevice', 'studentAtdReportSettingsService', 'dailySubWiseAtdSettingsService', 'shiftSettings', 'mediumsetting', 'classSettings', 'sectionSettingsSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function myAttendanceController(myAttendanceService, classSettingsService, commonService, subjectSettingsSevice, studentAtdReportSettingsService, dailySubWiseAtdSettingsService, shiftSettings, mediumsetting, classSettings, sectionSettingsSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, apiConfig) {



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
        vm.TeacherID = $localStorage.userInfo[0].TeacherID;
        //debugger;
        vm.Branch = $localStorage.userInfo[0].BrunchName;
        vm.UserInfoList = [];
        //debugger;
        var a = new Date();
        var b = a.getMonth();
        vm.abc = b;
        $scope.showItemForTeacher = false;

        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;

        //==============for report header information ===
        vm.imgHost = apiConfig.imagehost;
        $scope.InstituteLogo = $localStorage.userInfo[0].InstituteLogo;
        $scope.InsEmail = $localStorage.userInfo[0].InsEmail;
        $scope.InsAddress = $localStorage.userInfo[0].InsAddress;
        $scope.InsWeb = $localStorage.userInfo[0].InsWeb;
        $scope.InsPhoneNo = $localStorage.userInfo[0].InsPhoneNo;
        $scope.InstituteName = $localStorage.userInfo[0].InstituteName;

        // ============end report Heasder information===



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

            mywindow.document.write('<html><head><title></title>');
            mywindow.document.write('</head><body >');
            mywindow.document.write(content);
            mywindow.document.write('</body> <br/><br/>');
            mywindow.document.write('<footer> <font color="green">Powered By:</font><font color="blue"> onAir International Ltd. </font></footer>');
            mywindow.document.write('<footer> <font color="green">Web URL:</font><font color="blue">  www.onems.live </font></footer>');
            mywindow.document.write('</html>');


            mywindow.document.close();
            mywindow.focus();
            mywindow.print();
            mywindow.close();
            return true;
        };


        vm.printDivTeacher = function printElem(printTeacher) {
            //debugger;

            var content = document.getElementById(printTeacher).innerHTML;
            var mywindow = window.open('', 'Print', 'height=1000,width=2000');

            mywindow.document.write('<html><head><title></title>');
            mywindow.document.write('</head><body >');
            mywindow.document.write(content);
            mywindow.document.write('</body> <br/><br/>');
            mywindow.document.write('<footer> <font color="green">Powered By:</font><font color="blue"> onAir International Ltd. </font></footer>');
            mywindow.document.write('<footer> <font color="green">Web URL:</font><font color="blue">  www.onems.live </font></footer>');
            mywindow.document.write('</html>');


            mywindow.document.close();
            mywindow.focus();
            mywindow.print();
            mywindow.close();
            return true;
        };





        vm.getHrmSubWiseAtdDetails = function () {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line




            var Params = {

                insID: $localStorage.userInfo[0].InstituteID,
                midID: $localStorage.userInfo[0].MediumID,
                shiftID: $localStorage.userInfo[0].ShiftID,
                classID: $localStorage.userInfo[0].ClassID,
                sectionID: $localStorage.userInfo[0].SectionID,
                DepartmentID: $localStorage.userInfo[0].DepartmentID,
            };
            studentAtdReportSettingsService.getHrmSubWiseAtdDetail(Params)

                .then(function (data) {
                    vm.monAtd = data;
                });
            //}
        };
        //$scope.index;
        //$scope.RFid;
        var d = new Date();
        var aa = d.getMonth();
        var currentMonth = aa + 1;


        $scope.getMonthlyAtd = function () {
            vm.monthlyAtd = [];
            vm.menuSetup = {};
            var Params = {

                insID: $localStorage.userInfo[0].InstituteID,
                Mid: $localStorage.userInfo[0].MediumID,
                shid: $localStorage.userInfo[0].ShiftID,
                cid: $localStorage.userInfo[0].ClassID,
                secid: $localStorage.userInfo[0].SectionID,
                DepartmentID: $localStorage.userInfo[0].DepartmentID,
                monid: vm.monid === undefined ? currentMonth : vm.monid, //vm.mon.selected.MonthID, //vm.monthID, //
                RFid: $localStorage.userInfo[0].UserID,


            };

            studentAtdReportSettingsService.getMonthlyAttendence(Params)

                .then(function (data) {
                    vm.monthlyAtd = data;
                    if (data[0] === undefined) {
                        logger.error('No data found ....!');
                        $scope.showItem = false;
                    } else {
                        vm.menuSetup.StudentName = data[0].UserName;
                        vm.menuSetup.StudentID = data[0].RFID;
                        vm.menuSetup.RollNo = data[0].RollNo;
                        vm.menuSetup.GuardianName = data[0].Guardian;
                        vm.menuSetup.GuardianMail = data[0].GuradianEmail;
                        vm.menuSetup.TotalPresent = data[0].TotalPresent;
                        vm.menuSetup.ToTalClass = data[0].TotalClassDay;
                        vm.menuSetup.Medium = data[0].Medium;
                        vm.menuSetup.Class = data[0].Class;
                        vm.menuSetup.Department = data[0].Department;
                        vm.menuSetup.Section = data[0].Section;
                        vm.menuSetup.TotalPre = data[0].TotalPresent;

                        $scope.showItem = true;
                    }



                });

        };

        //----------------- Teacher -------------

        $scope.getMonthlyAtdForTeacher = function () {
            //debugger;
            vm.TechAtd = {};
            vm.TechAtd = [];

            var Params = {

                InstituteID: $localStorage.userInfo[0].InstituteID,

                Branch: $localStorage.userInfo[0].BrunchID,
                Department: $localStorage.userInfo[0].BrunchID,
                MonthID: vm.monid === undefined ? currentMonth : vm.monid,
                RFID: $localStorage.userInfo[0].UserID,

            };

            myAttendanceService.getAllTeacherInfoForReport(Params)

                .then(function (data) {
                    vm.TechAtd = data;
                    if (data[0] === undefined) {
                        logger.error('No data found ....!');
                        $scope.showItemForTeacher = false;
                    } else {
                        vm.TechAtd.TeacherName = data[0].Name;
                        vm.TechAtd.RFID = data[0].RFID;
                        vm.TechAtd.Phone = data[0].PhoneNo;
                        vm.TechAtd.Branch = data[0].Brunch === null || data[0].Brunch === '' || data[0].Brunch === undefined ? vm.Branch : data[0].Brunch;
                        vm.TechAtd.Email = data[0].EmailID;
                        vm.TechAtd.TotalPresent = data[0].TotalPresent;
                        vm.TechAtd.ToTalClass = data[0].TotalClassDay;
                        vm.TechAtd.TotalPresentDeti = data[0].TotalPresent;
                        vm.TechAtd.PresentStatus = data[0].PresentStatus;
                        vm.TechAtd.Date = data[0].Date;
                        vm.TechAtd.LateMins = data[0].LateMins;
                        $scope.showItemForTeacher = true;
                    }
                });

        };


        //$scope.index;

        vm.getAllSubjectAtd = function (index) {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            $scope.index = index;
            var Params = {
                Mid: $localStorage.userInfo[0].MediumID,
                shid: 0,//($localStorage.userInfo[0].ShiftID === null) ? 0 : $localStorage.userInfo[0].ShiftID, 
                cid: ($localStorage.userInfo[0].ClassID === null) ? vm.ClassID : $localStorage.userInfo[0].ClassID,
                secid: ($localStorage.userInfo[0].SectionID !== null) ? $localStorage.userInfo[0].SectionID : 0,
                DepartmentID: ($localStorage.userInfo[0].DepartmentID === null) ? 0 : $localStorage.userInfo[0].DepartmentID,
                uid: $localStorage.userInfo[0].UserID,
                date: vm.monthlyAtd[index].Date,
                InsID: $localStorage.userInfo[0].InstituteID,



            };
            studentAtdReportSettingsService.getAllSubjectAtd(Params)

                .then(function (data) {
                    vm.AllSubjectAtd = data;

                });
            $scope.showItem = true;
        };




        $scope.getMonthlyAtdByGuardian = function () {

            var Params = {

                insID: $localStorage.userInfo[0].InstituteID,
                Mid: vm.MediumID,
                shid: vm.ShiftID,
                cid: vm.ClassID,
                secid: vm.SectionID,
                DepartmentID: vm.DepartmentID,
                monid: vm.mon.selected.MonthID,//vm.monid,
                RFid: $localStorage.userInfo[0].UserID,


            };

            studentAtdReportSettingsService.getMonthlyAttendence(Params)

                .then(function (data) {
                    vm.monthlyAtd = data;
                    if (data[0] === undefined) {
                        logger.error('No data found ....!');
                        $scope.showItem = false;
                    } else {
                        vm.menuSetup.StudentName = data[0].UserName;
                        vm.menuSetup.StudentID = data[0].RFID;
                        vm.menuSetup.RollNo = data[0].RollNo;
                        vm.menuSetup.GuardianName = data[0].Guardian;
                        vm.menuSetup.GuardianMail = data[0].GuradianEmail;
                        vm.menuSetup.TotalPresent = vm.monthlyAtd.length;
                        vm.menuSetup.ToTalClass = data[0].TotalClassDay;
                        vm.menuSetup.Medium = data[0].Medium;
                        vm.menuSetup.Class = data[0].Class;
                        vm.menuSetup.Department = data[0].Department;
                        vm.menuSetup.Section = data[0].Section;
                        vm.menuSetup.TotalPre = vm.monthlyAtd.length;

                    }



                });
            $scope.showItem = true;
        };

        //--------------------------------load for dropdown as medium first------------------------------
        $scope.ReloadDll = function () {

            vm.ShiftID = null;
            vm.shift = undefined;
            vm.shifts = [];
            vm.MediumID = null;
            vm.medium = undefined;
            vm.mediums = [];
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
            vm.BrunchID = null;
            vm.branch = undefined;
            vm.branchDdls = [];

            $scope.showItem = false;
        };








        $scope.getStudentInfo = function () {
            var params = {
                InstituteID: vm.InstituteID,
                LoggedUserID: vm.LoggedUserID
            };

            classSettingsService.getDashUserInfo(params)
                .then(function (data) {
                    // debugger;
                    vm.UserInfoList = data;

                    vm.MediumID = data[0].MediumID;
                    vm.ClassID = data[0].ClassID;
                    vm.DepartmentID = data[0].DepartmentID;
                    vm.ShiftID = data[0].ShiftID;
                    vm.SectionID = data[0].SectionID;

                    //$scope.getStudentPeriod();
                });
        };

        $scope.getStudentPeriodByddl = function (UserID) {
            // debugger;
            var model = vm.UserInfoList.filter(function (ob, i) { return (ob.UserID === UserID); })[0];
            vm.MediumID = model.MediumID;
            vm.ClassID = model.ClassID;
            vm.DepartmentID = model.DepartmentID;
            vm.ShiftID = model.ShiftID;
            vm.SectionID = model.SectionID;
            vm.RFID = model.RFID;

            $scope.getMonthlyAtdByGuardian();

        };




        activate();

        function activate() {
            var promises = [getAllMonth(), getUserTypeWiseInfo()];
            return $q.all(promises).then(function () {
            });
        }




        //--------------------------------load for dropdown ------------------------------

        function getAllMonth() {




            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return studentAtdReportSettingsService.getMonths()
                .then(function (data) {
                    vm.months = data;
                    //debugger;
                    vm.monthID = vm.monthID === undefined ? vm.abc + 1 : vm.monthID;
                    vm.mon = { selected: vm.months.filter(function (ob, i) { return (ob.MonthID === vm.monthID); })[0] };
                });
        }

        $scope.getStudentAtdByMonthDdl = function (monthID) {
            //debugger;
            //var model = vm.months.filter(function (ob, i) { return (ob.monthID === vm.monthID); })[vm.abc];
            //vm.UserInfoList.filter(function (ob, i) { return (ob.UserID === UserID); })[0];

            vm.monid = monthID;
            getUserTypeWiseInfo();

            //getUserTypeWiseInfo();
        };


        function getUserTypeWiseInfo() {
            if (vm.UserTypeID === 1) {

                console.log('Abhi');
            }
            else if (vm.UserTypeID === 2) {
                console.log('Abhi');
            }
            else if (vm.UserTypeID === 3) {
                $scope.getMonthlyAtd();
            }
            else if (vm.UserTypeID === 4) {
                $scope.getMonthlyAtdForTeacher();
            }
            else if (vm.UserTypeID === 5) {
                $scope.getStudentInfo();
            }
            else if (vm.UserTypeID === 6) {
                console.log('Abhi');
            }
            else if (vm.UserTypeID === 7) {
                console.log('Abhi');
            }
            else if (vm.UserTypeID === 8) {
                console.log('Abhi');
            }
            else if (vm.UserTypeID === 9) {
                console.log('Abhi');
            }
        }

        //------------------------load for dropdown --------------------




    }
})();
