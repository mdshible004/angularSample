
(function () {
    'use strict';

    angular
        .module('app.monthlyClassWiseAttendance')
        .controller('MonthlyClassWiseAttendanceController', MonthlyClassWiseAttendanceController);

    MonthlyClassWiseAttendanceController.$inject = ['classSettingsService', 'studentAtdReportSettingsService', 'subjectSettingsSevice', 'commonService', 'studentAttendanceSevice', 'conversion', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function MonthlyClassWiseAttendanceController(classSettingsService, studentAtdReportSettingsService, subjectSettingsSevice, commonService, studentAttendanceSevice, conversion, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, apiConfig) {

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
        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration

        $scope.changeGrid = function () {
            $scope.subjectArr = [];
            $scope.showItem = false;
        };
        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.itemEvent = function () {
            //$scope.IsVisible = $scope.IsVisible ? false : true;
            $scope.showItem = true;
            $scope.createItem = false;

        };
 
        vm.dateSetup = conversion.NowDateCustom();
        $scope.listEvent = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.showItem = false;
            $scope.createItem = true;
        };

        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };
          $scope.changegrid=function(){
          vm.attendances=[];
            $scope.showItem = false;
        };
          vm.getMonthlyClassWiseStudentAttendance = function () {

              //Generate Token API Pass Call
              //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line
              var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                MediumID: vm.MediumID,
                ClassID: vm.ClassID === undefined ? 0 : vm.ClassID,
                DepartmentID: vm.DepartmentID === undefined ? 0 : vm.DepartmentID,
                SectionID: vm.SectionID === undefined ? 0 : vm.SectionID,
                MonthID: vm.MonthID === undefined ? 0 : vm.MonthID,
                ShiftID: vm.ShiftID === undefined || vm.ShiftID === null ? 0 : vm.ShiftID,
            };
                return studentAttendanceSevice.getMonthlyClassWiseStudentAttendance(Params)
                .then(function (data) {
                    vm.attendances = data;
                    $scope.showItem = true;
                });

    };


        activate();

        function activate() {
            var promises = [getmediumNameDdl(), getAllMonth(), getAllShift()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }

       function getmediumNameDdl() {

            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteMediumDdl(Params)
                .then(function (data) {
                    vm.mediums = data;
                    //vm.MediumWiseClassDDL(Params);

                });

        }

       function getAllShift(status) {



           //Generate Token API Pass Call
           authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



           var Params = {
               instituteId: $localStorage.userInfo[0].InstituteID
           };
           return commonService.getInstituteShift(Params)
               .then(function (data) {
                   vm.shifts = data;

               });
       }

        vm.MediumWiseClassDDL = function (n) {

            if (vm.MediumID !== null) {
                //Generate Token API Pass Call
                authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

                var Params = {
                    InstituteID: $localStorage.userInfo[0].InstituteID,
                    MediumID: n
                };
                return subjectSettingsSevice.getMediumWiseClassDDL(Params)
                    .then(function (data) {
                        vm.classes = data;

                    });
            }
            else {
                logger.error('Select Medium first');
            }
        };

        vm.ClassWiseDepartmentDDL = function (m) {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            vm.departments = [];
            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                ClassID: vm.class.selected.ClassID,
                MediumID: vm.medium.selected.MediumID
            };
            return subjectSettingsSevice.getClassWiseDepartmentDDL(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        vm.departments = data;
                        $scope.IsRequired = true;
                    }
                    else {
                        $scope.IsRequired = false;
                        vm.ClassSelected();
                    }

                });

        };
        vm.ClassSelected = function (ID, Status) {
            if (status === '') {
                vm.SectionID = null;
                vm.section = undefined;
                vm.sections = [];
            }

            var params = {
                instituteId: $localStorage.userInfo[0].InstituteID,
                classId: vm.ClassID,
                DepartmentID: vm.DepartmentID === undefined ? 0 : vm.DepartmentID
            };

            commonService.getInstituteSection(params)
                .then(function (data) {
                    vm.sections = data;
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
        function addTimes(InputDate) {
            //debugger
            var DateToString = InputDate;
            var SplitedDate = DateToString.split('T');
            var Splitedtime = SplitedDate[1].split('.');
            var OutputTime = Splitedtime[0];

            return OutputTime;
        }
        //==============================For Print Pdf and Excel Start===================//
        vm.printDiv = function printElem(print) {
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

        $scope.generatePDF = function (print) {
            $scope.printthis = true;
            kendo.drawing.drawDOM($('#print'), { //jshint ignore : line
                allPages: true,
                avoidLinks: true,
                paperSize: 'letter',
                margin: { top: '0.5cm', left: '0.1cm', right: '0.0cm', bottom: '0.5cm' },
                portrait: true,
                repeatHeaders: true,
                multiPage: true,
                scale: 0.5
            }).then(function (group) {
                kendo.drawing.pdf.saveAs(group, 'Daily_Student_Attendance' + '.pdf'); //jshint ignore : line
                $timeout(function () {
                    $scope.printthis = false;
                }, 3);

            });
        };
        vm.exportToExcel = function () {
            var blob = new Blob([document.getElementById('export').innerHTML], {
                type: 'application/vnd.ms-excel;charset=charset=utf-8'
            });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.download = 'Daily_Student_Attendance.xls';
            a.href = url;
            a.textContent = 'Daily_Student_Attendance.xls';
            a.click();
        };
        //==============================For Print Pdf and Excel End===================//

    }
})();

