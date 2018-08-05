(function () {
    'use strict';

    angular
        .module('app.exameRoutineEntry')
        .controller('exameRoutineEntryController', exameRoutineEntryController);

    exameRoutineEntryController.$inject = ['conversion', '$filter', 'subjectSettingsSevice', 'exameRoutineEntry', 'insExameSetting', 'commonService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function exameRoutineEntryController(conversion, $filter, subjectSettingsSevice, exameRoutineEntry, insExameSetting, commonService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

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
        $scope.showItem = false;
        $scope.createItem = true;
        //$scope.addRoutin = true;
        $scope.addExameRoutin = false;
        $scope.editRoutint = false;
        $scope.itemEvent = function () {
            //$scope.IsVisible = $scope.IsVisible ? false : true;
            $scope.showItem = true;
            $scope.createItem = true;
            $scope.addRoutin = true;

        };

        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };


        $scope.create = function () {
            $scope.createItem = true;
            $scope.addRoutin = true;
            $scope.addExameRoutin = false;
        };


        var isRowSelected = true;
        $scope.permanetToggleSelection = function (index) {
            isRowSelected = !isRowSelected;
            if ($scope.RoutineDetailArr[index][0].IsActive === true && ($scope.RoutineDetailArr[index][0].ExamDate === '1900-01-01T00:00:00.000Z' || $scope.RoutineDetailArr[index][0].ExamDate === '')) {
                logger.error('Please select an Exam date for ' + $scope.RoutineDetailArr[index][0].SubjectName);
            }


        };

        $scope.data = [];

        $scope.openRoutineIndexAll = function (index) {
            $scope.rouineindexall = index;
            $scope.routine[$scope.rouineindexall][0] = $scope.rouineindexall;
        };
        vm.showsubject = function () {
            var subjectParams = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                DepartmentID: vm.DepartmentID === undefined ? null : vm.DepartmentID,
                MediumID: vm.MediumID === undefined ? null : vm.MediumID,
                ClassID: vm.ClassID === undefined ? null : vm.ClassID

            };
            return subjectSettingsSevice.getSubjectByParms(subjectParams)
                .then(function (data) {
                    
                    vm.subjects = data;
                    $scope.subjects = data;
                    //vm.subject.selected.SubjectName=data[0].SubjectName;
                    $scope.subjectArr = [];
                    vm.StartTime = [];
                    vm.EndTime = [];
                    vm.ExamDate = [];
                    $scope.RoutineDetailArr = [];
                    if (data.length > 0) {

                        for (var i = 0; i < $scope.subjects.length; i++) {
                            if ($scope.subjects[i].IsActive === 1 || $scope.subjects[i].IsActive === true) {

                                $scope.subjectArr.push($scope.subjects[i]);
                                $scope.addRoutin = true;
                                var ab = vm.StartTime[i];
                                var bc = vm.EndTime[i];
                                if (ab === null || ab === undefined) {
                                    ab = '1900-01-01T09:00:00.000Z';
                                }
                                else {
                                    ab = ab;
                                }
                                if (bc === null || bc === undefined) {
                                    bc = '1900-01-01T12:00:00.000Z';
                                }
                                else {
                                    bc = bc;
                                }
                                vm.StartTime.push(getTimeToTimeSpan(ab));
                                vm.EndTime.push(getTimeToTimeSpan(bc));
                                vm.ExamDate = [];
                                ///////////
                                var routineAllValue = $scope.subjects[i];
                                var newrowRoutineEntry = [];
                                if ($scope.data.length === 0) {
                                    newrowRoutineEntry = [
                                        {
                                            'SubjectID': routineAllValue.SubjectID,
                                            'SubjectName': routineAllValue.SubjectName,
                                            'ExamDate': '',
                                            'StartTime': getTimeToTimeSpan(ab),
                                            'EndTime': getTimeToTimeSpan(bc),
                                            'IsActive': false

                                        }
                                    ];
                                } else {

                                    $scope.data[0].forEach(function (i) {
                                        newrowRoutineEntry.push(
                                            {
                                                'SubjectID': routineAllValue.SubjectID,
                                                'SubjectName': routineAllValue.SubjectName,
                                                'ExamDate': '',
                                                'StartTime': getTimeToTimeSpan(ab),
                                                'EndTime': getTimeToTimeSpan(bc),
                                                'IsActive': false

                                            }
                                        );
                                    });
                                }
                                $scope.RoutineDetailArr.push(newrowRoutineEntry);
                            }


                        }
                        if ($scope.RoutineDetailArr.length === 0) {
                            logger.error('No Subject found. Please set subject first...!');
                        }



                    }


                });
        };

        vm.showInsExameRoutine = function () {
            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID


            };
            return exameRoutineEntry.getInsExameRoutine(Params)
                .then(function (data) {
                    //$scope.addRoutin = true;
                    if (data.length > 0) {
                        vm.routines = data;
                        $scope.addExameRoutin = true;
                        $scope.addRoutin = false;
                        $scope.createItem = false;
                    }
                    else {
                        logger.error('No data Found...!');
                    }

                });
        };
        vm.ExamRoutineDetailID = 0;
        vm.ExamRoutineID = 0;

        vm.postExameRoutine = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod));//jshint ignore: line
            var routineArray = [].concat.apply([], $scope.RoutineDetailArr);
            $scope.routineArray = routineArray;
            for (var i = 0; i < $scope.routineArray.length; i++) {
                if ($scope.routineArray[i].StartTime === null) {
                    logger.error('Please Input Start Time');
                    return;
                } else {
                    $scope.routineArray[i].StartTime = timeConversion($scope.routineArray[i].StartTime);
                }

                if ($scope.routineArray[i].EndTime === null) {
                    logger.error('Please Input End Time');
                    return;
                } else {
                    $scope.routineArray[i].EndTime = timeConversion($scope.routineArray[i].EndTime);
                }

                if ($scope.routineArray[i].ExamDate === null || $scope.routineArray[i].ExamDate === undefined || $scope.routineArray[i].ExamDate === '') {
                    //logger.error('Please Input End Time');
                    $scope.routineArray[i].ExamDate = '1900-01-01T00:00:00.000Z';
                   
                } else {
                    $scope.routineArray[i].ExamDate = conversion.getStringToDate($scope.routineArray[i].ExamDate);
                }
                

            }

            exameRoutineEntry.postExameRoutineDetail({
                ExamRoutineDetailID: vm.ExamRoutineDetailID,
                ExamRoutineID: vm.ExamRoutineID,
                ExamID: vm.ExamID,
                DepartmentID: vm.DepartmentID === undefined ? null : vm.DepartmentID,
                MediumID: vm.MediumID === undefined ? null : vm.MediumID,
                ShiftID: vm.ShiftID === undefined ? null : vm.ShiftID,
                SectionID: vm.SectionID === undefined ? null : vm.SectionID,
                ClassID: vm.ClassID,
                StartDate: vm.startdate === null || vm.startdate === undefined || vm.startdate === '' ? '1900-01-01T00:00:00.000Z':conversion.getStringToDate(vm.startdate),
                EndDate: vm.enddate === null || vm.enddate === undefined || vm.enddate === '' ? '1900-01-01T00:00:00.000Z' : conversion.getStringToDate(vm.enddate),
                SubjectID: routineArray[0].SubjectID,
                ExamDate: routineArray[0].ExamDate,
                StartTime: routineArray[0].StartTime,
                EndTime: routineArray[0].EndTime,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                IsActive: 1,
                SessionID: vm.SessionID,
                LoggedUserID: $localStorage.userInfo[0].UserID,
                routineArray: $scope.routineArray

            })
                .then(function (data) {
                    if (data[0].ReturnValue === 'Duplicate') {
                        logger.error('Data already Exist');
                    } else {
                        logger.info('Saved!');
                        $state.go($state.current.name, {}, { reload: true });
                    }


                })
                .catch(function (error) { });
        };
        $scope.btnDis = false;
        vm.editInsExameRoutine = function (arg) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore: line




            $scope.data = [];
            //functionForSec(ClassID);

            $scope.addExameRoutin = false;
            $scope.createItem = true;
            $scope.addRoutin = true;


            var ExamRoutineID = parseInt(arg);

            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                ExamRoutineID: ExamRoutineID
            };

            exameRoutineEntry.getInsExameRoutineAll(Params)
                .then(function (data) {

                    if (data.length > 0) {
                        $scope.btnDis = true;
                        vm.routineAll = data;
                        vm.ExamID = data[0].ExamID;
                        vm.DepartmentID = data[0].DepartmentID;
                        vm.MediumID = data[0].MediumID;
                        vm.ShiftID = data[0].ShiftID;
                        vm.SectionID = data[0].SectionID;
                        vm.SessionID = data[0].SessionID;
                        vm.ClassID = data[0].ClassID;
                        vm.startdate = data[0].StartDate === '1900-01-01T00:00:00.000Z'?'': getDateToString( data[0].StartDate);
                        vm.enddate = data[0].EndDate === '1900-01-01T00:00:00.000Z' ? '' : getDateToString( data[0].EndDate);
                        vm.ExamID = data[0].ExamID;
                        vm.ExamRoutineID = parseInt(data[0].ExamRoutineID);
                        vm.ExamRoutineDetailID = parseInt(data[0].ExamRoutineDetailID);
                        vm.MediumWiseClassDDL(vm.MediumID, 'Edit');
                        vm.ClassWiseDepartmentDDL(vm.ClassID, 'Edit');
                        vm.ClassSelected(vm.SectionID, 'Edit');
                        vm.getExame(vm.ExamID, 'Edit');
                        
                        //getExame(vm.ExamID, 'Edit');
                        vm.shift = { selected: vm.Shifts.filter(function (ob, i) { return ob.ShiftID === data[0].ShiftID; })[0] };
                        //vm.Exame = { selected: vm.Exames.filter(function (ob, i) { return ob.ExamID === vm.ExamID; })[0] };
                        vm.medium = { selected: vm.mediums.filter(function (ob, i) { return ob.MameName === data[0].MameName; })[0] };
                        vm.session = { selected: vm.sessions.filter(function (ob, i) { return ob.SessionID === data[0].SessionID; })[0] };
                        //vm.startdate = getDateToString(data[0].StartDate);
                        //vm.enddate = getDateToString(data[0].EndDate);

                        if (vm.routineAll !== undefined) {
                            $scope.RoutineDetailArr = [];
                            for (var i = 0; i < data.length; i++) {
                                var routineAllValue = vm.routineAll[i];
                                var newrowRoutineEntry1 = [];
                                if ($scope.data.length === 0) {
                                    newrowRoutineEntry1 = [
                                        {
                                            'SubjectID': data[i].SubjectID,
                                            'SubjectName': data[i].SubjectName,
                                            'ExamDate': data[i].ExamDate === '1900-01-01T00:00:00.000Z' || (data[i].IsActive === false || data[i].IsActive === 0) ? '' : getDateToString(data[i].ExamDate), /*$filter(data[i].ExamDate)(new Date(), 'MMM dd, yyyy'),*/
                                            'StartTime': getTimeToTimeSpan(data[i].StartTime),
                                            'EndTime': getTimeToTimeSpan(data[i].EndTime),
                                            'IsActive': data[i].IsActive,
                                            'ExamRoutineDetailID': data[i].ExamRoutineDetailID

                                        }
                                    ];
                                }
                                $scope.RoutineDetailArr.push(newrowRoutineEntry1);
                            }
                        }
                    }


                })
                .catch(function (error) { });
        };
        $scope.TimeValidate = function (start, end) {
            vm.clsPeriod = [];

            if (start > end) {
                logger.error('Start time can not be greater than End time!!!!');
                $scope.disButton = true;
            }
            else {
                $scope.disButton = false;
            }

        };


        $scope.ParRoutintRemoveRow = function (index) {
            if ($scope.data[index][0].ExamRoutineDetailID > 0) {
                $scope.data[index][0].IsDeleted = true;

            } else {
                $scope.data.splice(index, 1);
                // if no rows left in the array create a blank array
                if ($scope.data.length === 0) {
                    $scope.data = [];
                }
            }
        };


        vm.deleteUserRoutine = function (ExamRoutineID) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)); //jshint ignore: line


            var params = {
                ExamRoutineID: parseInt(ExamRoutineID)
            };
            exameRoutineEntry.IsdeleteExamRoutineByID(params)
                .then(function (data) {
                    if (data[0].returnvalue) {
                        logger.info('Delete Successfully');
                        $state.go($state.current.name, {}, { reload: true });
                    } else {
                        logger.error('Delete Faild');
                    }
                })
                .catch(function (error) { });
        };
        $scope.changeMed = function () {
            vm.class = null;
            vm.department = null;
            vm.section = null;
            vm.classes = [];
            vm.departments = [];
            vm.sections = [];
            $scope.addRoutin = false;
        };
        $scope.changeCls = function () {
            vm.department = null;
            vm.section = null;
            vm.departments = [];
            vm.sections = [];
            $scope.addRoutin = false;
        };
        $scope.changeDep = function () {
            vm.section = null;
            vm.sections = [];
            $scope.addRoutin = false;
        };
        $scope.changeSec = function () {
            $scope.addRoutin = false;
        };
        $scope.changeShi = function () {
            $scope.addRoutin = false;
        };

        $scope.changeSes = function () {
            $scope.addRoutin = false;
        };
        $scope.changeExm = function () {
            $scope.addRoutin = false;
        };
        activate();
        function activate() {
            var promises = [getShift(), getAllInsSub(), getmediumNameDdl(1, ''), getSession()];
            return $q.all(promises).then(function () {
            });
        }

        function getShift() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore: line


            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteShift(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        vm.Shift = data;
                        vm.Shifts = data;
                        $scope.IsRequiredShift = true;
                    }
                    else {
                        $scope.IsRequiredShift = false;
                    }
                   
                });
        }
        $scope.ReloadDept = function () {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            if (status === 0) {
                vm.DepartmentID = null;
            }
            vm.department = undefined;
        };

        vm.ClassWiseDepartmentDDL = function (ClassID, status) {
            if (status === '') {
                $scope.ReloadDept(1);
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

                        if (status === 'Edit') {
                            vm.department = {
                                selected: vm.departments.filter(function (ob, i) {
                                    return ob.DepartmentID === vm.DepartmentID;
                                })[0]
                            };
                        }
                    }
                    else {
                        $scope.IsRequired = false;

                        if (status === '') {
                            vm.DepartmentID = null;
                            vm.ClassSelected(0, '');
                        }
                        else if (status === 'Edit') {
                            vm.ClassSelected(vm.SectionID, status);
                        }
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
                DepartmentID: vm.DepartmentID === undefined ? null : vm.DepartmentID
            };

            commonService.getInstituteSection(params)
                .then(function (data) {
                    if (data.length > 0) {
                        vm.sections = data;
                        if (Status === 'Edit') {
                            vm.SectionID = ID;
                            if (vm.section === undefined) {
                                vm.section = {
                                    selected: vm.sections.filter(function (ob, i) {
                                        return ob.SectionID === ID;
                                    })[0]
                                };
                            }
                        }
                    }
                    else {
                        $scope.secRequired = false;
                    }
                });

        };

        $scope.ReloadClass = function () {
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            //vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
        };

        vm.MediumWiseClassDDL = function (MediumID, status) {
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

                        if (status === 'Edit') {
                            vm.class = {
                                selected: vm.classes.filter(function (ob, i) {
                                    return ob.ClassID === vm.ClassID;
                                })[0]
                            };
                        }

                    });
            }
            else {
                logger.error('Select Medium first');
            }
        };

        function getAllInsSub() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore: line



            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getSub(Params)
                .then(function (data) {
                    vm.subjects = data;
                    vm.subjectss = data;
                });
        }

        function getmediumNameDdl(InstituteID, status) {
            if (status === '') {
                console.log('');
            }

            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteMediumDdl(Params)
                .then(function (data) {
                    vm.mediums = data;

                    if (status === 'Edit') {
                        vm.medium = {
                            selected: vm.mediums.filter(function (ob, i) {
                                return ob.MediumID === vm.MediumID;
                            })[0]
                        };
                    }
                });

        }
        vm.getExame = function (ID, status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore: line


            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                MediumID: vm.MediumID,
                ClassID: vm.ClassID
            };
            return insExameSetting.getAllExamesDDL(Params)
                .then(function (data) {
                    vm.Exames = [];
                    //vm.ExamList = [];
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].IsActive === 1 || data[i].IsActive === true) {
                                vm.Exames.push(data[i]);

                            }

                        }
                        if (status === 'Edit') {
                            vm.Exame = {
                                selected: vm.Exames.filter(function (ob, i) {
                                    return (ob.ExamID === ID);
                                })[0]
                            };
                        }

                    }
                });
        };
        function getSession() {
            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line
            return commonService.getSession()
                .then(function (data) {
                    vm.sessions = data;
                });
        }

        vm.ClassSelected = function (ID, status) {
            if (status === '') {
                vm.SectionID = null;
                vm.section = undefined;
                vm.sections = [];
            }

            var params = {
                instituteId: $localStorage.userInfo[0].InstituteID,
                classId: vm.ClassID,
                DepartmentID: vm.DepartmentID === null || vm.DepartmentID === undefined ? 0 : vm.DepartmentID
            };

            commonService.getInstituteSection(params)
                .then(function (data) {
                    vm.sections = data;
                    if (status === 'Edit') {
                        vm.SectionID = ID;
                        vm.section = {
                            selected: vm.sections.filter(function (ob, i) {
                                return ob.SectionID === ID;
                            })[0]
                        };
                    }
                });

        };
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

        function timeConversion(a) {
            var h = a;
            var hour = a.getHours() + 6;
            var min = a.getMinutes();
            if (hour < 10) {
                hour = '0' + hour;
            }
            if (min < 10) {
                min = '0' + min;
            }
            var Year = '1990';
            var Month = '01';
            var Day = '01';
            var currentTime = new Date(Year, Month, Day, hour, min, 0);
            return currentTime;
        }
        //==============================For Date Formating END===================//
        function NowDateCustom() {
            var date = new Date();
            var Nowdate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
            return Nowdate; 
        }
        function getDateToString(InputDate) {
            //debugger
            var DateToString = InputDate;
            var SplitedDate = DateToString.split('-');
            var Year = SplitedDate[0];
            var Month = SplitedDate[1];
            var Day = SplitedDate[2].split('T');
            var Output = Day[0] + '-' + Month + '-' + Year;
            return Output;
        }
    }
})();
