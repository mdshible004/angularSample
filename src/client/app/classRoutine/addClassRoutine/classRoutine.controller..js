(function () {
    'use strict';

    angular
        .module('app.classRoutine')
        .controller('ClassRoutineController', ClassRoutineController);

    ClassRoutineController.$inject = ['commonService', 'classSettingsService', 'subjectSettingsSevice', 'studentAtdReportSettingsService', 'dailySubWiseAtdSettingsService', 'shiftSettings', 'mediumsetting', 'classSettings', 'sectionSettingsSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function ClassRoutineController(commonService, classSettingsService, subjectSettingsSevice, studentAtdReportSettingsService, dailySubWiseAtdSettingsService, shiftSettings, mediumsetting, classSettings, sectionSettingsSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

        var vm = this;//jshint ignore : line

        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration
        vm.RoutineID = 0;
        vm.RoutinDetail = [];
        $scope.value = 1;
        $scope.Days = 'Saturday';
        $scope.InstituteID = $localStorage.userInfo[0].InstituteID;
        $scope.IsDisSave = true;
        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.printthis = false;

        // Reset Button Logic
        $scope.clearField = function () {
            vm.shift = null;
            vm.medium = null;
            vm.class = null;
            vm.section = null;
            vm.mon = null;
            $state.go($state.current.name, {}, { reload: true });
        };


        $scope.hideList = function () {
            $scope.IsDisSave = true;
            $scope.showItem = false;
            vm.RoutinDetail = [];
        };

        $scope.openRoutineTabIndex = function (index) {
            //debugger;
            $scope.value = index;
            $scope.SetDays();
            vm.getClsClassRoutine();
        };

        $scope.SetDays = function () {
            $scope.Days = $scope.value === 1 ? 'Saturday' : $scope.value === 2 ? 'Sunday' : $scope.value === 3 ? 'Moday' : $scope.value === 4 ? 'Tuesday' : $scope.value === 5 ? 'Wednesday' : $scope.value === 6 ? 'Thursday' : $scope.value === 7 ? 'Friday' : '';
        };

        $scope.openRoutineDetailsIndex = function (e) {
            $scope.chekValue = e;
        };

        vm.postClassRoutine = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line

            //angular.forEach(vm.RoutinDetail, function (row) {
            //    row.TeacherID = row.TeacherID === undefined ? null : row.TeacherID;
            //    row.SubjectID = row.SubjectID === undefined ? null : row.SubjectID;
            //});
            //var RoutineDetails = vm.RoutinDetail.filter(function (ob, i) { return (ob.IsActive === true || ob.IsActive === 1); });
            //var RoutineDetailsP = vm.RoutinDetail.filter(function (ob, i) { return ((ob.IsActive === false || ob.IsActive === 0) && ob.RoutineDetailID !== '0'); });
            //if (RoutineDetailsP !== undefined && RoutineDetailsP.length > 0) {
            //    angular.forEach(RoutineDetailsP, function (row) {
            //        RoutineDetails.push(row);
            //    });
            //}

            classSettings.postClassRoutineMasterDetail({
                RoutineID: vm.RoutinDetail[0].RoutineID,
                ShiftID: vm.ShiftID === undefined ? null : vm.ShiftID,
                MediumID: vm.MediumID === undefined ? null : vm.MediumID,
                ClassID: vm.ClassID,
                SectionID: vm.SectionID === undefined ? null : vm.SectionID,
                DepartmentID: vm.DepartmentID === undefined ? null : vm.DepartmentID,
                DayID: $scope.value,
                Remarks: 'Routine has been set up',
                InstituteID: vm.instituteID,
                LoggedUserID: $localStorage.userInfo[0].UserID,
                RoutinDetail: vm.RoutinDetail,
                SubjectList: $scope.SubjectModalList,
                TeacherList: $scope.SubjectWiseTeacherModalList
            })
                .then(function (data) {

                    logger.info('save Successfully');
                    $scope.IsDisSave = true;
                    vm.RoutinDetail = [];

                })
                .catch(function (error) { });


        };

        vm.getClsClassRoutine = function () {


            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            //if (vm.classID === undefined) {
            //    logger.error('Please select Class');
            //} else {
            $scope.IsDisSave = true;
            $scope.showItem = true;
            var params = {
                MediumID: (vm.MediumID === undefined) ? null : vm.MediumID,
                ClassID: (vm.ClassID === undefined) ? null : vm.ClassID,
                DepartmentID: (vm.DepartmentID === undefined) ? null : vm.DepartmentID,
                ShiftID: (vm.ShiftID === undefined) ? null : vm.ShiftID,
                InstituteID: vm.institute.selected.InstituteID, //$localStorage.userInfo[0].InstituteID,
                SectionID: (vm.SectionID === undefined) ? null : vm.SectionID,
                DayID: $scope.value
            };
            classSettingsService.getClassRoutineByID(params)
                .then(function (data) {
                    //debugger;
                    vm.RoutinDetail = [];
                    $scope.SubjectModalList = [];
                    $scope.SubjectWiseTeacherModalList = [];
                    angular.forEach(data, function (row, index) {
                        vm.RoutinDetail.push(
                            {
                                'InstituteID': row.InstituteID,
                                'RoutineDetailID': row.RoutineDetailID,
                                'RoutineID': row.RoutineID,
                                'DayID': row.DayID === 0 ? $scope.value : row.DayID,
                                'PeriodID': row.PeriodID,
                                'PeriodName': row.PeriodName,
                                'IsActive': row.IsActive === true ? 1 : false,
                                //'SubjectDll': vm.subjects,
                                //'SubjectID': row.SubjectID === 0 ? null : row.SubjectID,
                                'SubjectNameLists': row.SubjectNameLists,
                                'SubjectWiseTeacherNameLists': row.SubjectWiseTeacherNameLists,
                                //'subject': row.SubjectID === 0 ? { selected: undefined } : { selected: vm.subjects.filter(function (ob, i) { return (ob.SubjectID === row.SubjectID); })[0] },
                                //'TeacherDll': $scope.users,
                                //'TeacherID': row.TeacherID === 0 ? null : row.TeacherID, //jshint ignore : line
                                //'teacher': row.TeacherID === 0 ? { selected: undefined } : { selected: $scope.users.filter(function (ob, i) { return (ob.UserID === row.TeacherID.toString()); })[0] },
                                'StartTime': row.StartTime,
                                'EndTime': row.EndTime//,
                                //'IsUpdateTeacher': 0
                            }
                        );

                        if (row.RoutineSubjectList.length > 0) {
                            //debugger;
                            angular.forEach(row.RoutineSubjectList, function (rsl) {
                                $scope.SubjectModalList.push({
                                    RoutineSubjectID: rsl.RoutineSubjectID,
                                    RoutineID: rsl.RoutineID,
                                    RoutineDetailID: rsl.RoutineDetailID,
                                    PeriodID: rsl.PeriodID,
                                    DayID: rsl.DayID,
                                    SubjectID: rsl.SubjectID,
                                    SubjectName: rsl.SubjectName,
                                    InstituteID: rsl.InstituteID,
                                    SLNo: index,
                                    IsSelect: rsl.IsSelect,
                                    IsDeleted: false
                                });
                            });
                        }

                        if (row.RoutineSubjectTeacherList.length > 0) {
                            angular.forEach(row.RoutineSubjectTeacherList, function (rstl) {
                                $scope.SubjectWiseTeacherModalList.push({
                                    RoutineTeacherID: rstl.RoutineTeacherID,
                                    RoutineID: rstl.RoutineID,
                                    RoutineDetailID: rstl.RoutineDetailID,
                                    PeriodID: rstl.PeriodID,
                                    DayID: rstl.DayID,
                                    SubjectID: rstl.SubjectID,
                                    TeacherID: rstl.TeacherID,
                                    InstituteID: rstl.InstituteID,
                                    SLNo: index,
                                    IsSelect: rstl.IsSelect,
                                    IsUpdateTeacher: 0,
                                    IsDeleted: false
                                });
                            });
                        }
                    });
                });
        };

        $scope.SetCheckRoutineDetail = function (routine, val) {
            //debugger;
            var isAct = document.getElementById(val);
            routine.IsActive = isAct.checked === true ? 1 : 0;
            var checklist = vm.RoutinDetail.filter(function (ob, i) { return (ob.IsActive === true || ob.IsActive === 1); })[0];

            var IdGtrthanzero = vm.RoutinDetail.filter(function (ob, i) { return (ob.RoutineDetailID > 0); })[0];
            if (IdGtrthanzero === undefined) {
                $scope.IsDisSave = checklist !== undefined && checklist !== null ? false : true;
            }
            else {
                $scope.IsDisSave = false;
            }

            if (isAct.checked === false) {
                $scope.setSubjectAndTeacherListDeleted(routine, val - 1);
            }
        };

        $scope.setSubjectAndTeacherListDeleted = function (model, index) {
            $scope.IsActiveElementID = document.getElementById(index + 1);
            $scope.routineDetailModel = model;
            if ($scope.SubjectModalList.length > 0) {
                var submodel = $scope.SubjectModalList.filter(function (ob, i) { return (ob.SLNo === index && ob.RoutineDetailID > 0 && ob.RoutineSubjectID > 0); });
                if (submodel.length > 0) {
                    angular.forEach(submodel, function (row) {
                        row.IsDeleted = model.IsActive === false || model.IsActive === 0 ? true : false;
                        row.IsSelect = model.IsActive === false || model.IsActive === 0 ? false : true;
                        $scope.showTextInSubjectBox(row);
                    });
                }
            }
            if ($scope.SubjectWiseTeacherModalList.length > 0) {
                var subtmodel = $scope.SubjectWiseTeacherModalList.filter(function (ob, i) { return (ob.SLNo === index && ob.RoutineDetailID > 0 && ob.RoutineTeacherID > 0); });
                if (subtmodel.length > 0) {
                    angular.forEach(subtmodel, function (row) {
                        row.IsDeleted = model.IsActive === false || model.IsActive === 0 ? true : false;
                        row.IsSelect = model.IsActive === false || model.IsActive === 0 ? false : true;
                        row.IsUpdateTeacher = 0;
                        $scope.showTextInTeacherBox(row);
                    });
                }
            }
        };

        $scope.SetCheckRoutineDetailUsingModal = function () {
            //debugger;
            //var isAct = document.getElementById(val);
            $scope.routineDetailModel.IsActive = $scope.IsActiveElementID.checked === true ? 1 : 0;
            var checklist = vm.RoutinDetail.filter(function (ob, i) { return (ob.IsActive === true || ob.IsActive === 1); })[0];

            var IdGtrthanzero = vm.RoutinDetail.filter(function (ob, i) { return (ob.RoutineDetailID > 0); })[0];
            if (IdGtrthanzero === undefined) {
                $scope.IsDisSave = checklist !== undefined && checklist !== null ? false : true;
            }
            else {
                $scope.IsDisSave = false;
            }
        };

        $scope.IsUpdate = 0;
        $scope.getTeacherIfExist = function (teachModel, TeacherID) {
            //debugger;
            if (TeacherID !== undefined && TeacherID !== null) {
                var params = {
                    InstituteID: vm.instituteID,
                    TeacherID: TeacherID,
                    PeriodID: $scope.routineDetailModel.PeriodID,
                    DayID: $scope.value
                };

                classSettingsService.getTeacherIfExist(params)
                    .then(function (data) {
                        if (data[0].result === 1) {
                            if (data[0].ClassID !== vm.ClassID) {
                                logger.info('Selected teacher already assigned in same period for class "' + data[0].ClassName + '"');
                                teachModel.IsUpdateTeacher = 1;
                            }
                            else {
                                teachModel.IsUpdateTeacher = 0;
                            }
                        }
                        else {
                            teachModel.IsUpdateTeacher = 0;
                        }
                    });
            }
        };

        //----------------------------------//

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

            $scope.showItem = false;
        };

        $scope.ReloadMedium = function (status) {
            if (status === 0) {
                vm.MediumID = null;
                //vm.medium = [];
            }
            vm.medium = undefined;
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




        $scope.ReloadClass = function (status) {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            if (status === 0) {
                vm.ClassID = null;
            }
            vm.class = undefined;
        };

        $scope.ReloadDept = function (status) {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            if (status === 0) {
                vm.DepartmentID = null;
            }
            vm.department = undefined;
        };

        $scope.getAllSubjectsByInstituteAndClass = function () {

            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line
            var Params = {
                InstituteID: vm.instituteID, // vm.institute.selected.InstituteID , 
                MediumID: vm.MediumID,
                ClassID: vm.ClassID,
                DepartmentID: vm.DepartmentID === undefined || vm.DepartmentID === null ? 0 : vm.DepartmentID
            };

            return commonService.GetClassWiseSubject(Params)
                .then(function (data) {
                    //debugger;
                    vm.subjects = data;
                });
        };

        //***************************************Load Subject Modal*************************************
        $scope.routineDetailModel = '';
        $scope.SubjectList = [];
        $scope.SubjectModalList = [];
        $scope.DetailIndex = 0;
        $scope.loadSubjectList = function (model, index, val) {
            //debugger;
            $scope.IsActiveElementID = document.getElementById(val);
            $scope.DetailIndex = index;
            $scope.routineDetailModel = model;
            $scope.SubjectList = [];
            angular.forEach(vm.subjects, function (rows) {
                $scope.SubjectList.push({
                    SubjectID: rows.SubjectID,
                    SubjectName: rows.SubjectName,
                    IsSelect: false
                });
            });

            if ($scope.SubjectModalList.length > 0) {
                var smodel = $scope.SubjectModalList.filter(function (js, j) { return (js.SLNo === $scope.DetailIndex); });
                angular.forEach(smodel, function (row) {
                    angular.forEach($scope.SubjectList, function (srow) {
                        if (row.SubjectID === srow.SubjectID && row.IsDeleted === false) {
                            srow.IsSelect = true;
                        }
                    });
                });
            }
        };

        $scope.selectSubject = function (sub) {
            if (sub.IsSelect === false) {
                var CSelectList = $scope.SubjectModalList.filter(function (js, j) { return (js.SubjectID === sub.SubjectID && js.SLNo === $scope.DetailIndex); })[0];
                if (CSelectList !== undefined) {
                    if (CSelectList.RoutineSubjectID > 0 && CSelectList.RoutineDetailID > 0) {
                        CSelectList.IsDeleted = true;
                        CSelectList.IsSelect = false;
                        var tmodel = $scope.SubjectWiseTeacherModalList.filter(function (js, j) { return (js.SLNo === $scope.DetailIndex && js.SubjectID === sub.SubjectID); })[0];
                        if (tmodel !== undefined) {
                            tmodel.IsDeleted = true;
                            tmodel.IsSelect = false;
                            tmodel.IsUpdateTeacher = 0;
                            $scope.showTextInTeacherBox(tmodel);
                        }
                    }
                    else {
                        $scope.SubjectModalList.splice($scope.SubjectModalList.indexOf(CSelectList), 1);
                    }

                }
            }
            else if (sub.IsSelect === true) {
                var PSelectList = $scope.SubjectModalList.filter(function (js, j) { return (js.SubjectID === sub.SubjectID && js.SLNo === $scope.DetailIndex); })[0];
                if (PSelectList === undefined) {
                    $scope.SubjectModalList.push({
                        RoutineSubjectID: 0, RoutineID: $scope.routineDetailModel.RoutineID,
                        RoutineDetailID: $scope.routineDetailModel.RoutineDetailID,
                        PeriodID: $scope.routineDetailModel.PeriodID,
                        DayID: $scope.routineDetailModel.DayID,
                        SubjectID: sub.SubjectID,
                        SubjectName: sub.SubjectName,
                        InstituteID: $scope.routineDetailModel.InstituteID,
                        SLNo: $scope.DetailIndex,
                        IsSelect: sub.IsSelect,
                        IsDeleted: false
                    });
                }
                else {
                    PSelectList.IsDeleted = false;
                    PSelectList.IsSelect = sub.IsSelect;
                }
            }

            $scope.showTextInSubjectBox(sub);
        };

        $scope.showTextInSubjectBox = function (sub) {
            if (sub.IsSelect === true) {
                var P = false;
                P = $scope.routineDetailModel.SubjectNameLists.includes(sub.SubjectName);

                if (P === false) {
                    $scope.routineDetailModel.SubjectNameLists += ', ' + sub.SubjectName;
                }
            }
            else {
                if (sub.IsSelect === false) {
                    var S = false;
                    S = $scope.routineDetailModel.SubjectNameLists.includes(sub.SubjectName);
                    if (S === true) {
                        $scope.routineDetailModel.SubjectNameLists = $scope.routineDetailModel.SubjectNameLists.replace(', ' + sub.SubjectName, '');
                    }
                }
            }

            $scope.SetCheckRoutineDetailUsingModal();
        };

        $scope.disabledEnDefine = function (model) {
            if (model.TeacherID === null) {
                model.IsSelect = false;
            }
        };
        //***************************************Load Subject Modal*************************************

        //***************************************Load Subject Wise Teacher Modal************************

        $scope.SubjectWiseTeacherList = [];
        $scope.SubjectWiseTeacherModalList = [];
        $scope.IsActiveElementID = '';
        $scope.loadSubjectWiseTeacherList = function (model, index, val) {
            //debugger;
            $scope.IsActiveElementID = document.getElementById(val);
            $scope.DetailIndex = index;
            $scope.routineDetailModel = model;
            $scope.SubjectWiseTeacherList = [];
            var subjectListsForT = $scope.SubjectModalList.filter(function (js, j) { return (js.SLNo === $scope.DetailIndex && js.IsDeleted === false); });
            angular.forEach(subjectListsForT, function (rows) {
                $scope.SubjectWiseTeacherList.push({
                    SubjectID: rows.SubjectID,
                    SubjectName: rows.SubjectName,
                    TeacherID: null,
                    teacher: { selected: null },
                    IsSelect: false,
                    IsUpdateTeacher: 0
                });
            });

            if ($scope.SubjectWiseTeacherModalList.length > 0) {
                var smodel = $scope.SubjectWiseTeacherModalList.filter(function (js, j) { return (js.SLNo === $scope.DetailIndex); });
                angular.forEach(smodel, function (row) {
                    angular.forEach($scope.SubjectWiseTeacherList, function (srow) {
                        if (row.SubjectID === srow.SubjectID && row.IsDeleted === false) {
                            srow.TeacherID = row.TeacherID;
                            srow.teacher = { selected: $scope.users.filter(function (js, j) { return (parseInt(js.UserID) === parseInt(row.TeacherID)); })[0] };
                            srow.IsSelect = true;
                        }
                    });
                });
            }
        };

        $scope.selectSubjectWiseTeacher = function (subt) {
            if (subt.IsSelect === false) {
                var CSelectList = $scope.SubjectWiseTeacherModalList.filter(function (js, j) { return (js.SubjectID === subt.SubjectID && js.SLNo === $scope.DetailIndex); })[0];
                if (CSelectList !== undefined) {
                    if (CSelectList.RoutineTeacherID > 0 && CSelectList.RoutineDetailID > 0) {
                        CSelectList.IsDeleted = true;
                        CSelectList.IsSelect = false;
                        CSelectList.IsUpdateTeacher = 0;
                    }
                    else {
                        $scope.SubjectWiseTeacherModalList.splice($scope.SubjectWiseTeacherModalList.indexOf(CSelectList), 1);
                    }
                }
            }
            else if (subt.IsSelect === true) {
                var PSelectList = $scope.SubjectWiseTeacherModalList.filter(function (js, j) { return (js.SubjectID === subt.SubjectID && js.SLNo === $scope.DetailIndex); })[0];
                if (PSelectList === undefined) {
                    $scope.SubjectWiseTeacherModalList.push({
                        RoutineTeacherID: 0,
                        RoutineID: $scope.routineDetailModel.RoutineID,
                        RoutineDetailID: $scope.routineDetailModel.RoutineDetailID,
                        PeriodID: $scope.routineDetailModel.PeriodID,
                        DayID: $scope.routineDetailModel.DayID,
                        SubjectID: subt.SubjectID,
                        TeacherID: subt.TeacherID,
                        InstituteID: $scope.routineDetailModel.InstituteID,
                        SLNo: $scope.DetailIndex,
                        IsSelect: subt.IsSelect,
                        IsUpdateTeacher: subt.IsUpdateTeacher,
                        IsDeleted: false
                    });
                }
                else {
                    PSelectList.IsDeleted = false;
                    PSelectList.IsSelect = subt.IsSelect;
                    PSelectList.IsUpdateTeacher = subt.IsUpdateTeacher;
                }
            }

            $scope.showTextInTeacherBox(subt);
        };

        $scope.showTextInTeacherBox = function (subt) {
            var TeacherName = $scope.users.filter(function (js, j) {
                return (parseInt(js.UserID) === parseInt(subt.TeacherID));
            })[0].UserFullName;
            if (subt.IsSelect === true) {
                var P = false;
                P = $scope.routineDetailModel.SubjectWiseTeacherNameLists.includes(TeacherName);

                if (P === false) {
                    $scope.routineDetailModel.SubjectWiseTeacherNameLists += ', ' + TeacherName;
                }
            }
            else {
                if (subt.IsSelect === false) {
                    var S = false;
                    S = $scope.routineDetailModel.SubjectWiseTeacherNameLists.includes(TeacherName);
                    if (S === true) {
                        $scope.routineDetailModel.SubjectWiseTeacherNameLists = $scope.routineDetailModel.SubjectWiseTeacherNameLists.replace(', ' + TeacherName, '');
                    }
                }
            }

            $scope.SetCheckRoutineDetailUsingModal();
        };
        //***************************************Load Subject Wise Teacher Modal************************


        activate();

        function activate() {
            var promises = [getInstitute('')];
            return $q.all(promises).then(function () {
            });
        }

        $scope.ReloadSec = function () {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];

            //vm.department = undefined;
            //vm.departments = [];
        };

        vm.ClassSelected = function (ID, Status) {
            if (status === '') {
                vm.SectionID = null;
                vm.section = undefined;
                vm.sections = [];
                $scope.ReloadSec();
            }

            var params = {
                instituteId: vm.instituteID,
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



        vm.instituteID = $localStorage.userInfo[0].InstituteID;
        function getInstitute(status) {
            if (status === '') {
                $scope.ReloadDll();
            }

            return classSettingsService.getInstitute()
                .then(function (data) {
                    vm.institutes = data;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };
                    vm.getAllShift(vm.instituteID, status);
                    vm.getmediumNameDdl(vm.instituteID, status);
                    vm.getUsersByUserTypeID();
                    //vm.getCmnBranchDdl(vm.instituteID, status);
                });
        }

        vm.getUsersByUserTypeID = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var Params = {
                insID: vm.institute.selected.InstituteID,
                uId: 4
            };
            classSettingsService.getUserbyTypeId(Params)

                .then(function (data) {
                    //debugger;
                    $scope.users = data;

                });
        };

        vm.getAllShift = function (InstituteID, status) {
            var Params = {
                instituteId: InstituteID
            };
            return commonService.getInstituteShift(Params)
                .then(function (data) {
                    vm.shifts = data;

                    if (status === 'Edit') {
                        vm.shift = {
                            selected: vm.shifts.filter(function (ob, i) {
                                return (ob.ShiftID === vm.ShiftID);
                            })[0]
                        };
                    }
                });
        };

        vm.getmediumNameDdl = function (InstituteID, status) {
            if (status === '') {
                $scope.ReloadMedium(1);
            }

            var Params = {
                instituteId: InstituteID
            };
            return commonService.getInstituteMediumDdl(Params)
                .then(function (data) {
                    vm.mediums = data;

                    if (status === 'Edit') {
                        vm.medium = {
                            selected: vm.mediums.filter(function (ob, i) {
                                return (ob.MediumID === vm.MediumID);
                            })[0]
                        };
                    }
                });

        };




        vm.ClassWiseDepartmentDDL = function (ClassID, status) {
            if (status === '') {
                $scope.ReloadDept(1);
            }

            var Params = {
                InstituteID: vm.instituteID,
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
                                    return (ob.DepartmentID === vm.DepartmentID);
                                })[0]
                            };
                        }
                    }
                    else {
                        $scope.IsRequired = false;

                        if (status === '') {
                            vm.DepartmentID = null;
                            vm.departments = [];
                            vm.department = undefined;
                            vm.ClassSelected(0, '');
                        }
                        else if (status === 'Edit') {
                            vm.ClassSelected(vm.SectionID, status);
                        }

                        $scope.getAllSubjectsByInstituteAndClass();
                    }
                });

        };


        vm.MediumWiseClassDDL = function (MediumID, status) {
            if (status === '') {
                $scope.ReloadClass(1);
            }

            if (vm.MediumID !== null) {
                var Params = {
                    InstituteID: vm.institute.selected.InstituteID,
                    MediumID: MediumID
                };
                return subjectSettingsSevice.getMediumWiseClassDDL(Params)
                    .then(function (data) {
                        vm.classes = data;

                        if (status === 'Edit') {
                            vm.class = {
                                selected: vm.classes.filter(function (ob, i) {
                                    return (ob.ClassID === vm.ClassID);
                                })[0]
                            };
                        }

                    });
            }
            else {
                logger.error('Select Medium first');
            }
        };

    }
})();
