
(function () {
    'use strict';

    angular
        .module('app.teacherAttendance')
        .controller('TeacherAttendanceController', TeacherAttendanceController);

    TeacherAttendanceController.$inject = ['teacherAttendanceSevice','commonService', 'conversion', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function TeacherAttendanceController(teacherAttendanceSevice, commonService, conversion, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, apiConfig) {

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
          vm.getTeacherAttendanceByParams = function () {


              //Generate Token API Pass Call
              authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            if (vm.dateSetup === undefined) {console.log('himel'); }
              else{              
            
                var hrmDeviceParams = {
                BrunchID: (vm.BrunchID === undefined || vm.BrunchID === null) ? 0 : vm.BrunchID,
                DepartmentID: (vm.DepartmentID === undefined || vm.DepartmentID === null) ? 0 : vm.DepartmentID,
                Date: conversion.getStringToDate(vm.dateSetup),
                InstituteID: $localStorage.userInfo[0].InstituteID,
                UserTypeID :4

            };
            return teacherAttendanceSevice.getHrmDeviceByParmsforTeacher(hrmDeviceParams)
                .then(function (data) {
                    vm.attendances = data;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].Intime === undefined || data[i].Intime === '' || data[i].Intime === null) {
                            data[i].Intime === ''; //jshint ignore : line
                        }
                        else {
                            data[i].Intime = addTimes(data[i].Intime);

                        }
                        if (data[i].Outtime === undefined || data[i].Outtime === '' || data[i].Outtime === null) {
                            data[i].Outtime === ''; //jshint ignore : line
                        }
                        else {
                            data[i].Outtime = addTimes(data[i].Outtime);

                        }
                    }
                    $scope.showItem = true;
                    add(hrmDeviceParams);
                });
        }
    };
        function add(hrm) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return teacherAttendanceSevice.getTotalHrmDeviceByParmsforTeacher(hrm)
                .then(function (data) {
                    vm.totalattendances = data;

                });

        }

        activate();

        function activate() {
            var promises = [getInsBranchDdl(), getInsDepartmentDdl()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }

        function getInsBranchDdl() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            var params = {
                InstituteID: $localStorage.userInfo[0].InstituteID
            };
            return teacherAttendanceSevice.getInsBranch(params)
                .then(function (data) {
                    vm.branches = data;
                });
        }

        function getInsDepartmentDdl() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteDepertment(Params)
                .then(function (data) {
                    vm.departments = data;
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

