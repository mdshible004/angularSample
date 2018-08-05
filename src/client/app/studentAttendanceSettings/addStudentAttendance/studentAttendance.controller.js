
(function () {
    'use strict';

    angular
        .module('app.studentAttendance')
        .controller('StudentAttendanceController', StudentAttendanceController);

    StudentAttendanceController.$inject = ['commonService', 'subjectSettingsSevice', 'studentAttendanceSevice', 'conversion', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function StudentAttendanceController(commonService, subjectSettingsSevice, studentAttendanceSevice, conversion, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, apiConfig) {

        var vm = this;
        //Token Generate Decleration
        //==============for report header information ===
        $scope.imgHost = apiConfig.imagehost;
        $scope.InstituteLogo = $localStorage.userInfo[0].InstituteLogo;
        $scope.InsEmail = $localStorage.userInfo[0].InsEmail;
        $scope.InsAddress = $localStorage.userInfo[0].InsAddress;
        $scope.InsWeb = $localStorage.userInfo[0].InsWeb;
        $scope.InsPhoneNo = $localStorage.userInfo[0].InsPhoneNo;
        $scope.InstituteName = $localStorage.userInfo[0].InstituteName;

        // ============end report Heasder information===
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration




        vm.dateSetup = conversion.NowDateCustom();
        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;


        $scope.itemEvent = function () {
            //$scope.IsVisible = $scope.IsVisible ? false : true;
            $scope.showItem = true;
            $scope.createItem = false;

        };
        $scope.changeGrid = function () {
            vm.attendances = [];
            vm.totalattendances = [];

            $scope.showItem = false;
        };

        $scope.listEvent = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.showItem = false;
            $scope.createItem = true;
        };

        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };
        $scope.changegrid = function () {
            vm.attendances = [];
            $scope.showItem = false;
        };

        $scope.redirecttosms = function () {
            //debugger;
            window.location.href = window.origin + '/order/sms';
        };

        vm.ClassSelected = function (classId) {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            vm.section = null;
            var params = {
                instituteId: $localStorage.userInfo[0].InstituteID,
                classId: classId,
                DepartmentID: vm.DepartmentID === undefined ? 0 : vm.DepartmentID
            };

            commonService.getInstituteSection(params)
                .then(function (data) {
                    vm.sections = data;
                });

        };
        $scope.showItem1 = false;
        $scope.AttdList = []; vm.LateStudent=0;
        //Get student data by parameters
        vm.itemEvent = function () {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line




            if (vm.MediumID === undefined || vm.MediumID === null) {
                logger.error('Please Select Medium');
            }
            else {
                //$scope.printthis = true;                
                //debugger;
                var hrmDeviceParams = {
                    ShiftID: (vm.ShiftID === undefined || vm.ShiftID === null) ? 0 : vm.ShiftID,
                    MediumID: vm.MediumID,
                    ClassID: vm.ClassID !== undefined || vm.ClassID !== null ? vm.ClassID : 0,
                    SectionID: (vm.SectionID !== undefined || vm.SectionID !== null) ? vm.SectionID : 0,
                    DepartmentID: (vm.DepartmentID === undefined || vm.DepartmentID === null) ? 0 : vm.DepartmentID,
                    Date: conversion.getStringToDate(vm.dateSetup),
                    IsPresent: 0,//vm.IsPresent === undefined || vm.IsPresent === false || (vm.IsPresent === true && vm.IsAbsent === true) ? 0 : 1,
                    IsAbsent: 0,//vm.IsAbsent === undefined || vm.IsAbsent === false || (vm.IsPresent === true && vm.IsAbsent === true) ? 0 : 1,
                    InstituteID: $localStorage.userInfo[0].InstituteID,
                    UserTypeID: 3


                };
                var hrm = {
                    ShiftID: (vm.ShiftID === undefined || vm.ShiftID === null) ? 0 : vm.ShiftID,
                    MediumID: vm.MediumID,
                    ClassID: vm.ClassID !== undefined || vm.ClassID !== null ? vm.ClassID : 0,
                    SectionID: (vm.SectionID !== undefined || vm.SectionID !== null) ? vm.SectionID : 0,
                    DepartmentID: (vm.DepartmentID === undefined || vm.DepartmentID === null) ? 0 : vm.DepartmentID,
                    Date: conversion.getStringToDate(vm.dateSetup),
                    InstituteID: $localStorage.userInfo[0].InstituteID,
                    UserTypeID: 3
                };
                return studentAttendanceSevice.getHrmDeviceByParms(hrmDeviceParams)
                    .then(function (data) {
                        $scope.AttdList = [];
                        if (data.length === 0) {
                            $scope.showItem = false;
                            logger.error('No data found...!');
                        }
                        else {
                            //debugger;
                            $scope.showItem = true;
                            $scope.AttdList = data;
                            vm.LateStudent = $scope.AttdList.filter(function (ob, i) { return (ob.APLStatus === 'L'); }).length;
                            $scope.SetStatusWiseData();
                            add(hrm);
                        }
                    });
            }
        };

        $scope.SetStatusWiseData = function () {
            //debugger;
            vm.IsPresent = vm.IsPresent === undefined ? false : vm.IsPresent;
            vm.IsAbsent = vm.IsAbsent === undefined ? false : vm.IsAbsent;
            vm.IsLate = vm.IsLate === undefined ? false : vm.IsLate;

            if (vm.IsPresent === true && vm.IsAbsent === false && vm.IsLate === false) {
                vm.attendances = $scope.AttdList.filter(function (ob, i) { return (ob.APLStatus === 'P'); });
            }
            if (vm.IsAbsent === true && vm.IsPresent === false && vm.IsLate === false) {
                vm.attendances = $scope.AttdList.filter(function (ob, i) { return (ob.APLStatus === 'A'); });
            }
            if (vm.IsLate === true && vm.IsAbsent === false && vm.IsPresent === false) {
                vm.attendances = $scope.AttdList.filter(function (ob, i) { return (ob.APLStatus === 'L'); });
            }
            if (vm.IsPresent === true && vm.IsAbsent === true && vm.IsLate === false) {
                vm.attendances = $scope.AttdList.filter(function (ob, i) { return (ob.APLStatus === 'P' || ob.APLStatus === 'A'); });
            }
            if (vm.IsPresent === true && vm.IsLate === true && vm.IsAbsent === false) {
                vm.attendances = $scope.AttdList.filter(function (ob, i) { return (ob.APLStatus === 'P' || ob.APLStatus === 'L'); });
            }
            if (vm.IsAbsent === true && vm.IsLate === true && vm.IsPresent === false) {
                vm.attendances = $scope.AttdList.filter(function (ob, i) { return (ob.APLStatus === 'A' || ob.APLStatus === 'L'); });
            }
            if ((vm.IsAbsent === true && vm.IsLate === true && vm.IsPresent === true) || (vm.IsAbsent === false && vm.IsLate === false && vm.IsPresent === false)) {
                vm.attendances = $scope.AttdList;
            }
        };

        function add(para) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return studentAttendanceSevice.getTotalHrmDeviceByParmsforStudent(para)
                .then(function (data) {
                    vm.totalattendances = data;
                    $scope.showItem1 = true;
                });

        }

        //Send Mail to individual student's parent email
        $scope.mailEvent = function (index) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            if (vm.attendances[index].Present === 1) {
                logger.error('Student is present');
                return;
            }
            else {
                if (vm.attendances[index].GurdianEmail === '' || vm.attendances[index].GurdianEmail === null || vm.attendances[index].GurdianEmail === undefined) {
                    logger.error('No guardian mail found');
                }
                else {
                    studentAttendanceSevice.sendMailer({
                        toMail: vm.attendances[index].GurdianEmail,
                        InstituteID: $localStorage.userInfo[0].InstituteID,
                        MailTypeID: vm.attendances[index].Present === 0 ? 1 : 2

                    })
                        .then(function (data) {
                            logger.info('Mail Sent Successfully!');
                        })
                        .catch(function (error) { });
                }
            }
        };

        //Send Mail to all Absent student's parent email
        $scope.mailToAllAbsentStudent = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            $scope.i = $scope.AttdList;

            var mailArray = [];

            for (var j = 0; j < $scope.i.length; j++) {
                if ($scope.i[j].Present !== 1 && $scope.i[j].GurdianEmail !== '') {
                    if (mailArray.length === 0) {
                        mailArray = $scope.i[j].GurdianEmail;
                    }
                    else {
                        mailArray = mailArray + ',' + $scope.i[j].GurdianEmail;
                    }
                   
                }
            }
            studentAttendanceSevice.sendMailer({
                toMail: mailArray,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                MailTypeID: 1
            })
                .then(function (data) {
                    logger.info('All Mail Sent Successfully!');

                })
                .catch(function (error) { });
        };

        //Send SMS to individual student's parent Phone
        $scope.smsSend = function (index) {
            var smsAccessToken = vm.insSMSToken;
            if (vm.attendances[index].Present === 1) {
                logger.error('Student is present');
                return;
            }
            else {
                var params = {
                    to: vm.attendances[index].GurdianPhoneNo,
                    message: 'Your Son is School Paliasay',
                    token: smsAccessToken
                };
                studentAttendanceSevice.sendSMS(params)
                    .then(function (data) {
                        if (data === true) {
                            logger.info('SMS Sent Successfully!');
                        }

                    })
                    .catch(function (error) { });

            }
        };

        //Present and Absen both student Guardian number collection Array
        vm.presentStudentInfo = [];
        vm.guardianNumber = [];

        vm.getAllPresentStudent = function () {
            vm.presentStudentInfo = [];
            vm.guardianNumber = [];
            for (var n = 0; n < vm.attendances.length; n++) {
                if (vm.attendances[n].Present === 1 && vm.attendances[n].GurdianPhoneNo !== '') {
                    vm.presentStudentInfo.push(vm.attendances[n]);
                    if (vm.guardianNumber.length === 0) {
                        vm.guardianNumber = vm.attendances[n].GurdianPhoneNo;
                    } else {
                        vm.guardianNumber = vm.guardianNumber + ',' + vm.attendances[n].GurdianPhoneNo;
                    }

                }
            }

        };
        vm.getAllAbsenStudent = function () {
            vm.presentStudentInfo = [];
            vm.guardianNumber = [];
            for (var n = 0; n < vm.attendances.length; n++) {
                if (vm.attendances[n].Present === 0 && vm.attendances[n].GurdianPhoneNo !== '') {
                    vm.presentStudentInfo.push(vm.attendances[n]);
                    if (vm.guardianNumber.length === 0) {
                        vm.guardianNumber = vm.attendances[n].GurdianPhoneNo;
                    } else {
                        vm.guardianNumber = vm.guardianNumber + ',' + vm.attendances[n].GurdianPhoneNo;
                    }

                }
            }

        };

        vm.getAllAbsenStudentForMail = function () {
            vm.studentInfo = [];
            vm.guardianMail = [];
            for (var n = 0; n < vm.attendances.length; n++) {
                if (vm.attendances[n].Present === 0 && vm.attendances[n].GurdianEmail !== '') {
                    vm.studentInfo.push(vm.attendances[n]);
                    if (vm.guardianMail.length === 0) {
                        vm.guardianMail = vm.attendances[n].GurdianEmail;
                    } else {
                        vm.guardianMail = vm.guardianMail + ',' + vm.attendances[n].GurdianEmail;
                    }

                }
            }

        };

        //Send Bulk SMS to student's Guardian Number
        vm.sendBulkSMS = function () {
            if (vm.guardianNumber.length > 0) {
                var smsAccessToken = vm.insSMSToken;
                var params = {
                    to: vm.guardianNumber,
                    message: 'Dear Parent,Your Son is School Paliasay',
                    token: smsAccessToken
                };
                axios.post('http://sms.greenweb.com.bd/api.php?token=' + params.token + '&to=' + params.to + '&message=' + params.message)  //jshint ignore : line
                    .then(function (response) {
                        if (response.status === 200) {
                            logger.info('All SMS Sent Successfuly');
                        }
                    });

                getTokenWiseSMSResult();
            }

        };

        //--------------------------------load for dropdown as medium first------------------------------
        $scope.ReloadDll = function () {
            //vm.instituteID = null;
            //vm.institute = undefined;
            //vm.institutes = [];
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

        $scope.ReloadMedium = function () {
            //vm.MediumID = null;
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
        };

        $scope.ReloadClass = function () {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            //vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
        };

        $scope.ReloadDept = function () {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            //vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
        };
        $scope.ReloadSec = function () {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];

            //vm.department = undefined;
            //vm.departments = [];
        };
        $scope.totalSepenSMSResult = {};

        activate();

        function activate() {
            var promises = [getInstitutePurchaseSMS(), getmediumNameDdl(''), getAllShift('')];
            return $q.all(promises).then(function () {
            });
        }

        function getInstitutePurchaseSMS() {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line
            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return studentAttendanceSevice.getInstitutePurchaseSMS(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        vm.insPurchaseSMS = data[0].TotalSMS;
                        vm.insSMSToken = data[0].InsToken;
                        getTokenWiseSMSResult();
                    }
                });
        }

        function getTokenWiseSMSResult() {
            var params = {
                token: vm.insSMSToken //vm.insSMSToken
            };
            axios.get('http://sms.greenweb.com.bd/g_api.php?token=' + params.token + '&tokensms')  //jshint ignore : line
                .then(function (response) {
                    if (response.status === 200) {
                        $scope.totalSepenSMSResult.counter = parseInt(response.data);
                    }
                });
        }

        function getmediumNameDdl(status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            if (status === '') {
                $scope.ReloadMedium();
            }
            // debugger;
            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteMediumDdl(Params)
                .then(function (data) {
                    vm.mediums = data;


                });

        }
        vm.ClassSelected = function (ID, Status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            if (status === '') {
                vm.SectionID = null;
                vm.section = undefined;
                vm.sections = [];
                $scope.ReloadSec();
            }

            var params = {
                instituteId: $localStorage.userInfo[0].InstituteID,
                classId: vm.ClassID,
                DepartmentID: vm.DepartmentID === null || vm.DepartmentID === undefined ? 0 : vm.DepartmentID
            };

            commonService.getInstituteSection(params)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.IsRequiredSec = true;
                        vm.sections = data;
                    }
                    else {
                        $scope.IsRequiredSec = false;
                    }

                });

        };

        vm.ClassWiseDepartmentDDL = function (ClassID, status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            if (status === '') {
                $scope.ReloadDept();
                vm.SectionID = null;
            }

            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                ClassID: ClassID,
                MediumID: vm.MediumID
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
        vm.MediumWiseClassDDL = function (MediumID, status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            if (status === '') {
                $scope.ReloadClass();
            }

            if (vm.MediumID !== null) {
                var Params = {
                    InstituteID: $localStorage.userInfo[0].InstituteID,
                    MediumID: MediumID
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
        //--------------------------------load for dropdown as medium first------------------------------

        function addTimes(InputDate) {
            //debugger
            var DateToString = InputDate;
            var SplitedDate = DateToString.split('T');
            var Splitedtime = SplitedDate[1].split('.');
            var OutputTime = Splitedtime[0];

            return OutputTime;
        }
        //==============================For Date Formating Start===================//

        function getTimeSpanToTime(InputDatetime) {

            var DateToString = InputDatetime.toString();
            var SplitedTime = DateToString.split(' ');

            var OutputTime = '1900-01-01 ' + SplitedTime[4];

            return OutputTime;
        }

        function getTimeToTimeSpan(InputTime) {

            var Year = '1900';
            var Month = '00';
            var Day = '01';
            var Times = InputTime.split('T');
            var Hour = Times[0];
            var Minute = Times[1];
            var t = Times[1].split('.');
            var tm = t[0].split(':');
            var tDay = tm[0];
            var tHour = tm[0];
            var tMinute = tm[1];

            var OutputTime = new Date(Year, Month, Day, tHour, tMinute, 0);

            return OutputTime;
        }
        //==============================For Date Formating END===================//

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

            //var content = document.getElementById(print).innerHTML;
            //var mywindow = window.open('', 'Print', 'height=1000,width=2000');

            //mywindow.document.write('<html><head><title></title>');
            //mywindow.document.write('</head><body >');
            //mywindow.document.write(content);
            //mywindow.document.write('</body> <br/><br/>');
            //mywindow.document.write('<footer> <font color="green">Powered By:</font><font color="blue"> onAir International Ltd. </font></footer>');
            //mywindow.document.write('<footer> <font color="green">Web URL:</font><font color="blue">  www.onems.live </font></footer>');
            //mywindow.document.write('</html>');


            //mywindow.document.close();
            //mywindow.focus();
            //mywindow.print();
            //mywindow.close();
            //return true;
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

