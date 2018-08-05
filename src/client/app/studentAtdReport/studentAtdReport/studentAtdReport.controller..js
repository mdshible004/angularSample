(function () {
    'use strict';

    angular
        .module('app.studentAtdReportSettings')
        .controller('StudentAtdReportSettingsController', StudentAtdReportSettingsController);

    StudentAtdReportSettingsController.$inject = ['commonService', 'subjectSettingsSevice', 'studentAtdReportSettingsService', 'dailySubWiseAtdSettingsService', 'shiftSettings', 'mediumsetting', 'classSettings', 'sectionSettingsSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function StudentAtdReportSettingsController(commonService, subjectSettingsSevice, studentAtdReportSettingsService, dailySubWiseAtdSettingsService, shiftSettings, mediumsetting, classSettings, sectionSettingsSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, apiConfig) {


        //==============for report header information ===
        $scope.imgHost = apiConfig.imagehost;
        $scope.InstituteLogo = $localStorage.userInfo[0].InstituteLogo;
        $scope.InsEmail = $localStorage.userInfo[0].InsEmail;
        $scope.InsAddress = $localStorage.userInfo[0].InsAddress;
        $scope.InsWeb = $localStorage.userInfo[0].InsWeb;
        $scope.InsPhoneNo = $localStorage.userInfo[0].InsPhoneNo;
        $scope.InstituteName = $localStorage.userInfo[0].InstituteName;

        // ============end report Heasder information===
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

        $scope.printthis2 = false;
        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.printthis = false;
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
        $scope.clearField = function () {

            $state.go($state.current.name, {}, { reload: true });
        };

        $scope.changeGrid = function () {
            vm.monAtd = [];
            vm.monthlyAtd = [];
            vm.AllSubjectAtd = [];
            $scope.showItem = false;
        };
        //print
        // vm.printDiv = function (print) {
        //     var printContents = document.getElementById(print).innerHTML;
        //     var originalContents = document.body.innerHTML;
        //     document.body.innerHTML = printContents;
        //     window.print();
        //     document.body.innerHTML = originalContents;
        //     window.location.reload(true);

        // };

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
            frameDoc.document.write('</br></br>');
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

            //mywindow.document.write('</body> <br/><br/>');
            //mywindow.document.write('<footer style="position: fixed;bottom: 0;"> <font color="green">Powered By:</font><font color="blue"> onAir International Ltd. </font></footer>');
            //mywindow.document.write('</html>');
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

        //vm.printDiv = function printElem(print) {
        //    var content = document.getElementById(print).innerHTML;
        //    var mywindow = window.open('', 'Print', 'height=1000,width=2000');

        //    mywindow.document.write('<html><head><title>Print</title>');
        //    mywindow.document.write('</head><body >');
        //    mywindow.document.write(content);
        //    mywindow.document.write('</body></html>');

        //    mywindow.document.close();
        //    mywindow.focus();
        //    mywindow.print();
        //    mywindow.close();
        //    return true;
        //};

       // vm.exportToPDF = function (print) {
            // var pdf = new jsPDF('P', 'pt', 'Letter');
            // var text = "                      Attendence Details";
            // pdf.text(100, 225, text);
            // var source = $('#print')[0];
            // var specialElementHandlers = {
            //     '#bypassme': function (element, renderer) {
            //         return true
            //     }
            // };
            // var margins = {
            //     top: 100,
            //     bottom: 100,
            //     left: 160,
            //     width: 27
            // };
            // pdf.fromHTML(source, margins.left, margins.top, { 'width': margins.width, 'elementHandlers': specialElementHandlers },
            //     function (dispose) { pdf.save('Test.pdf'); }, margins);
       // };

       // vm.exportToExcel = function () {
            // var blob = new Blob([document.getElementById('print').innerHTML], {
            //     type: "application/vnd.ms-excel;charset=charset=utf-8"
            //     // type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            // });
            // saveAs(blob, "Report.xls");
       // };

        //zahid_code



        vm.getHrmSubWiseAtdDetails = function () {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            if (vm.ClassID === undefined || vm.ClassID === null || vm.monthID === undefined) {
                logger.error('Please select Class and Month');
            } else {
                var Params = {
                    insID: $scope.InstituteID,
                    midID: (vm.MediumID !== undefined || vm.MediumID !== null) ? vm.MediumID : 0,
                    shiftID: (vm.ShiftID === undefined || vm.ShiftID === null) ? 0 : vm.ShiftID,
                    classID: vm.ClassID,
                    sectionID: (vm.SectionID !== undefined || vm.SectionID !== null) ? vm.SectionID : 0,
                    DepartmentID: (vm.DepartmentID === undefined || vm.DepartmentID === null) ? 0 : vm.DepartmentID,
                };
                studentAtdReportSettingsService.getHrmSubWiseAtdDetail(Params)

                    .then(function (data) {
                        vm.monAtd = data;
                    });
            }
        };
        //$scope.index;
        //$scope.RFid;
        vm.getMonthlyAtd = function (index) {




            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            $scope.index = index;
            var Params = {
                Mid: (vm.MediumID === undefined || vm.MediumID === null) ? null: vm.MediumID ,
                shid: (vm.ShiftID === undefined || vm.ShiftID === null) ? 0 : vm.ShiftID,
                cid: vm.ClassID,
                secid: (vm.SectionID === undefined || vm.SectionID === null) ? null:vm.SectionID ,
                DepartmentID: (vm.DepartmentID === undefined || vm.DepartmentID === null) ? 0 : vm.DepartmentID,
                monid: vm.mon.selected.MonthID,
                RFid: vm.monAtd[index].UserID,
                insID: $scope.InstituteID

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
                        vm.menuSetup.TotalPre = vm.monthlyAtd.length;

                    }



                });
            $scope.showItem = true;
        };
        //$scope.index;

        vm.getAllSubjectAtd = function (index) {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line




            $scope.index = index;
            var Params = {
                Mid: (vm.MediumID !== undefined || vm.MediumID !== null) ? vm.MediumID : 0,
                shid: (vm.ShiftID === undefined || vm.ShiftID === null) ? 0 : vm.ShiftID,
                cid: vm.ClassID,
                secid: (vm.SectionID !== undefined || vm.SectionID !== null) ? vm.SectionID : 0,
                DepartmentID: (vm.DepartmentID === undefined || vm.DepartmentID === null) ? 0 : vm.DepartmentID,
                uid: vm.monthlyAtd[index].UserID,
                date: vm.monthlyAtd[index].Date,
                InsID: $scope.InstituteID



            };
            studentAtdReportSettingsService.getAllSubjectAtd(Params)

                .then(function (data) {
                    vm.AllSubjectAtd = data;

                });
            $scope.showItem = true;
        };

        //vm.ClassSelected = function (classId) {
        //    vm.section = {};
        //    var params = {
        //        instituteId: $localStorage.userInfo[0].InstituteID,
        //        classId: vm.classID
        //    };

        //    commonService.getInstituteSection(params)
        //        .then(function (data) {
        //            vm.sections = data;
        //        });

        //};

        // $scope.mailEvent= function(index){
        //    // var mailArray = [].concat.apply([],  $scope.index);
        //    studentAttendanceSevice.sendMailer({
        //         toMail : vm.attendances[index].GurdianEmail
        //     })
        //     .then(function(data){
        //         logger.info('Mail Sent Successfully!');
        //         //$state.transitionTo('deliverypartner.listpartner');
        //     })
        //     .catch(function(error){});
        // }


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


        activate();

        function activate() {
            var promises = [getmediumNameDdl(''), getAllShift(''), getAllMonth()];
            return $q.all(promises).then(function () {
            });
        }


        function getmediumNameDdl(status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            if (status === '') {
                $scope.ReloadMedium();
            }
            //debugger;
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



        function getAllMonth() {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return studentAtdReportSettingsService.getMonths()
                .then(function (data) {
                    vm.months = data;
                });
        }




    }
})();
