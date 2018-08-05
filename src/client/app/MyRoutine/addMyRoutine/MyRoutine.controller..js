(function () {
    'use strict';

    angular
        .module('app.MyRoutine')
        .controller('MyRoutineController', MyRoutineController);

    MyRoutineController.$inject = ['commonService', 'classSettingsService', 'subjectSettingsSevice', 'studentAtdReportSettingsService', 'dailySubWiseAtdSettingsService', 'shiftSettings', 'mediumsetting', 'classSettings', 'sectionSettingsSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function MyRoutineController(commonService, classSettingsService, subjectSettingsSevice, studentAtdReportSettingsService, dailySubWiseAtdSettingsService, shiftSettings, mediumsetting, classSettings, sectionSettingsSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, apiConfig) {

        var vm = this;//jshint ignore : line

        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.UserTypeID = $localStorage.userInfo[0].UserTypeID;
        $scope.InstituteName = $localStorage.userInfo[0].InstituteName;
        $scope.InstituteLogo = $localStorage.userInfo[0].InstituteLogo;
        vm.imgHost = apiConfig.imagehost;
        $scope.InstituteLogoUrl = vm.imgHost + $scope.InstituteLogo;
        $scope.InsEmail = $localStorage.userInfo[0].InsEmail;
        $scope.InsAddress = $localStorage.userInfo[0].InsAddress;
        $scope.InsWeb = $localStorage.userInfo[0].InsWeb;
        $scope.InsPhoneNo = $localStorage.userInfo[0].InsPhoneNo;
        $scope.Branch = $localStorage.userInfo[0].BrunchName;
        $scope.IsBranch = $scope.Branch === null ? false : true;
        //debugger;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        vm.ClassID = $localStorage.userInfo[0].ClassID;
        vm.RoutineID = 0;
        vm.RoutinDetail = [];
        vm.RoutinDisplay = [];
        vm.title = 'Class Routine';
        $scope.PeriodArray = [];
        $scope.DayArray = [];

        //vm.LoggedUserID = 11112849; //11112850, 11112849
        //vm.UserTypeID = 3;
        //vm.ClassID = 2;

        //***************************************************Start Routine For Admin*****************************************
        $scope.setCommonRoutin = function (allroutine) {
            $scope.PeriodArray = [];
            $scope.DayArray = [];
            //debugger;
            angular.forEach(allroutine, function (row) {
                if ($scope.PeriodArray.length > 0) {
                    var PA = $scope.PeriodArray.filter(function (ob, i) { return (ob.PeriodID === row.PeriodID); })[0];
                    if (PA === undefined || PA === null) {
                        $scope.PeriodArray.push({ PeriodID: row.PeriodID, PeriodName: row.PeriodName, PeriodTime: row.StartTime + '-' + row.EndTime });
                    }
                }
                else {
                    $scope.PeriodArray.push({ PeriodID: row.PeriodID, PeriodName: row.PeriodName, PeriodTime: row.StartTime + '-' + row.EndTime });
                }

                if ($scope.DayArray.length > 0) {
                    var DA = $scope.DayArray.filter(function (ob, i) { return (ob.DayID === row.DayID); })[0];
                    if (DA === undefined || DA === null) {
                        $scope.DayArray.push({ DayID: row.DayID, DaysName: row.DaysName });
                    }
                }
                else {
                    $scope.DayArray.push({ DayID: row.DayID, DaysName: row.DaysName });
                }
            });

            angular.forEach($scope.DayArray, function (da) {
                //debugger;
                var detail = allroutine.filter(function (ob, i) { return (ob.DayID === da.DayID); });
                if (detail.length > 0) {
                    //debugger;
                    angular.forEach($scope.PeriodArray, function (prd) {
                        var prddetail = detail.filter(function (ob, i) { return (ob.PeriodID === prd.PeriodID); });
                        if (prddetail.length > 0) {
                            da.detail = da.detail === undefined ? [] : da.detail;
                            var count = 0;
                            var checktiffin = 0;
                            angular.forEach(prddetail, function (dp) {
                                if (count === 0) {
                                    da.detail.push({
                                        PeriodID: dp.PeriodID,
                                        PeriodName: dp.PeriodName,
                                        ClassName: dp.ClassName,
                                        TeacherName: dp.TeacherName,
                                        SubjectName: dp.SubjectName,
                                        CSTName: dp.CSTName,
                                        ClassArray: dp.ClassName.split(','),
                                        TeacherArray: dp.TeacherName.split(','),
                                        SubjectArray: dp.SubjectName.split(','),
                                        CSTArray: dp.CSTName.split('_')
                                    });
                                    count = 1;
                                }
                                else {
                                    //da.detail.PeriodID = da.detail.PeriodID + ', ' + dp.PeriodID;
                                    var P = '', C = '', T = '', S = '', CS = '', PR = '', CL = '', TC = '', SB = '', CST = '';
                                    P = da.detail[da.detail.length - 1].PeriodName.includes(dp.PeriodName);
                                    C = da.detail[da.detail.length - 1].ClassName.includes(dp.ClassName);
                                    T = da.detail[da.detail.length - 1].TeacherName.includes(dp.TeacherName);
                                    S = da.detail[da.detail.length - 1].SubjectName.includes(dp.SubjectName);
                                    //CS = da.detail[da.detail.length - 1].CSTName.includes(dp.CSTName);
                                    PR = P === true ? '' : dp.PeriodName;
                                    CL = C === true ? '' : dp.ClassName;
                                    TC = T === true ? '' : dp.TeacherName;
                                    SB = S === true ? '' : dp.SubjectName;
                                    //CST = CS === true ? '' : dp.CSTName;



                                    da.detail[da.detail.length - 1].PeriodName = checktiffin === 0 && dp.PeriodName === 'Tiffin Break' ? dp.PeriodName : da.detail[da.detail.length - 1].PeriodName + ',' + PR;
                                    da.detail[da.detail.length - 1].ClassName = da.detail[da.detail.length - 1].ClassName + ',' + CL;
                                    da.detail[da.detail.length - 1].TeacherName = da.detail[da.detail.length - 1].TeacherName + ',' + TC;
                                    da.detail[da.detail.length - 1].SubjectName = da.detail[da.detail.length - 1].SubjectName + ',' + SB;
                                    da.detail[da.detail.length - 1].CSTName = checktiffin === 0 && dp.PeriodName === 'Tiffin Break' ? dp.CSTName : da.detail[da.detail.length - 1].CSTName + ',_' + dp.CSTName;

                                    da.detail[da.detail.length - 1].ClassArray = da.detail[da.detail.length - 1].ClassArray === undefined ? [] : da.detail[da.detail.length - 1].ClassArray;
                                    da.detail[da.detail.length - 1].ClassArray = da.detail[da.detail.length - 1].ClassName.split(',');

                                    da.detail[da.detail.length - 1].TeacherArray = da.detail[da.detail.length - 1].TeacherArray === undefined ? [] : da.detail[da.detail.length - 1].TeacherArray;
                                    da.detail[da.detail.length - 1].TeacherArray = da.detail[da.detail.length - 1].TeacherName.split(',');

                                    da.detail[da.detail.length - 1].SubjectArray = da.detail[da.detail.length - 1].SubjectArray === undefined ? [] : da.detail[da.detail.length - 1].SubjectArray;
                                    da.detail[da.detail.length - 1].SubjectArray = da.detail[da.detail.length - 1].SubjectName.split(',');

                                    da.detail[da.detail.length - 1].CSTArray = da.detail[da.detail.length - 1].CSTArray === undefined ? [] : da.detail[da.detail.length - 1].CSTArray;
                                    da.detail[da.detail.length - 1].CSTArray = da.detail[da.detail.length - 1].CSTName.split('_');

                                    checktiffin = dp.PeriodName === 'Tiffin Break' ? 1 : 0;
                                }
                            });
                            count = 0;
                        }
                        else {
                            da.detail = da.detail === undefined ? [] : da.detail;
                            var clsname = '';
                            var tchrname = '';
                            var sbjctname = '';
                            var cstnam = prd.PeriodName === 'Tiffin Break' ? 'Tiffin Break' : 'N/A';
                            da.detail.push({
                                PeriodID: prd.PeriodID,
                                PeriodName: 'N/A',
                                ClassName: 'N/A',
                                TeacherName: '',
                                SubjectName: '',
                                ClassArray: clsname.split(','),
                                TeacherArray: tchrname.split(','),
                                SubjectArray: sbjctname.split(','),
                                CSTArray: cstnam.split('_')
                            });
                        }
                    });

                }
            });

            $scope.DayArray.sort(function (a, b) {
                return a.DayID - b.DayID;
            });

            $scope.TeachersNameInfo(allroutine);
        };

        $scope.getRoutineForAdmin = function () {
            var params = {
                InstituteID: vm.InstituteID
            };

            classSettingsService.spGetCommonClassRoutine(params)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.setCommonRoutin(data);
                    }
                });
        };
        //****************************************************End Routine For Admin******************************************

        //********************************************Start Routine For Student & Teacher************************************
        $scope.getRoutineForStudentAndTeacher = function () {
            var params = {
                InstituteID: vm.InstituteID,
                ClassID: vm.ClassID,
                TeacherID: vm.TeacherID
            };

            classSettingsService.spGetTeacherStudentMyClassRoutine(params)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.setCommonRoutin(data);
                    }
                });
        };

        $scope.getRoutineForStudent = function () {
            vm.TeacherID = 0;
            $scope.getRoutineForStudentAndTeacher();
        };

        $scope.getRoutineForTeacher = function () {
            vm.ClassID = 0;
            vm.TeacherID = vm.LoggedUserID;
            $scope.getRoutineForStudentAndTeacher();
        };

        $scope.getStudentInfo = function () {
            var params = {
                InstituteID: vm.InstituteID,
                LoggedUserID: vm.LoggedUserID
            };

            classSettingsService.getDashUserInfo(params)
                .then(function (data) {
                    vm.UserInfoList = data;

                    vm.MediumID = data[0].MediumID;
                    vm.ClassID = data[0].ClassID;
                    vm.DepartmentID = data[0].DepartmentID;
                    vm.ShiftID = data[0].ShiftID;
                    vm.SectionID = data[0].SectionID;

                    $scope.getRoutineForStudent();
                });
        };

        $scope.getStudentPeriodByddl = function (UserID) {
            if (UserID !== undefined) {
                var model = vm.UserInfoList.filter(function (ob, i) { return (ob.UserID === UserID); })[0];
                vm.MediumID = model.MediumID;
                vm.ClassID = model.ClassID;
                vm.DepartmentID = model.DepartmentID;
                vm.ShiftID = model.ShiftID;
                vm.SectionID = model.SectionID;
                vm.DayArray = [];
                $scope.getRoutineForStudent();
            }
            else {
                vm.DayArray = [];
            }
        };
                
        $scope.printDiv = function (print) {
            //debugger;
            var content = document.getElementById(print).innerHTML;
            var mywindow = window.open('', 'Print', 'height=1000,width=2000');
            var is_chrome = Boolean(mywindow.chrome);
            mywindow.document.write('<html><head><title></title>');
            mywindow.document.write('</head><body >');
            mywindow.document.write(content);
            mywindow.document.write('</body> <br/><br/>');
            mywindow.document.write('<footer style="position: fixed;bottom: 0;"> <font color="green">Powered By:</font><font color="blue"> onAir International Ltd. </font></footer>');
            mywindow.document.write('</html>');
            
            if (is_chrome) {
                setTimeout(function () { // wait until all resources loaded 
                    mywindow.document.close(); // necessary for IE >= 10
                    mywindow.focus(); // necessary for IE >= 10
                    mywindow.print(); // change window to winPrint
                    mywindow.close(); // change window to winPrint
                }, 250);
            } else {
                mywindow.document.close(); // necessary for IE >= 10
                mywindow.focus(); // necessary for IE >= 10

                mywindow.print();
                mywindow.close();
            }
            return true;
        };

        $scope.generatePDF = function (print) {
            var report = true;
            kendo.drawing.drawDOM($(print), {  //jshint ignore : line
                allPages: true,
                avoidLinks: true,
                paperSize: 'letter',
                margin: { top: '0.5cm', left: '0.5cm', right: '0.5cm', bottom: '0.5cm' },
                portrait: false,
                landscape: true,
                repeatHeaders: true,
                multiPage: true,
                scale: 0.5
            }).then(function (group) {
                kendo.drawing.pdf.saveAs(group, 'ClassRoutine' + '.pdf'); //jshint ignore : line
                $timeout(function () {
                    report = false;
                }, 3);

            });
        };

        $scope.TeacherNameArray = [];
        $scope.TeachersNameInfo = function (data) {
            //debugger;
            $scope.TeacherNameArray = [];
            var counts = 0;

            angular.forEach(data, function (row, index) {
                if (row.FNName !== 'not assigned :: not assigned') {
                    var splitedName = row.FNName.split('_');
                    if (splitedName.length > 0) {
                        angular.forEach(splitedName, function (sr, indexs) {
                            $scope.TeacherNameArray.push({
                                FNName: sr
                            });
                        });
                    }
                    else {
                        $scope.TeacherNameArray.push({
                            FNName: row.FNName
                        });
                    }
                }
            });

            angular.forEach($scope.TeacherNameArray, function (row, index) {
                if (row.FNName !== 'not assigned :: not assigned') {

                    if (counts === 0) {
                        $scope.TeacherName = row.FNName;
                        counts = 1;
                    }
                    else {
                        var tch = $scope.TeacherName.includes(row.FNName);

                        if (tch === false) {
                            $scope.TeacherName += ', ' + row.FNName;
                        }
                    }
                }
            });
        };

        //**********************************************End Routine For Student & Teacher************************************

        activate();

        function activate() {
            var promises = [getUserTypeWiseInfo()];
            return $q.all(promises).then(function () {
            });
        }

        function getUserTypeWiseInfo() {
            if (vm.UserTypeID === 1) {
                $scope.getRoutineForAdmin();
            }
            else if (vm.UserTypeID === 2) {
                $scope.getRoutineForAdmin();
            }
            else if (vm.UserTypeID === 3) {
                $scope.getRoutineForStudent();
            }
            else if (vm.UserTypeID === 4) {
                $scope.getRoutineForTeacher();
            }
            else if (vm.UserTypeID === 5) {
                $scope.getStudentInfo();
            }
            else if (vm.UserTypeID === 6) {
                $scope.getRoutineForAdmin();
            }
            else if (vm.UserTypeID === 7) {
                $scope.getRoutineForAdmin();
            }
            else if (vm.UserTypeID === 8) {
                $scope.getRoutineForAdmin();
            }
            else if (vm.UserTypeID === 9) {
                $scope.getRoutineForAdmin();
            }
        }
    }
})();
