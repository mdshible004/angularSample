
(function () {
    'use strict';

    angular
        .module('app.classTestSettings')
        .controller('ClassTestSettingsController', ClassTestSettingsController);

    ClassTestSettingsController.$inject = ['syllabusSevice', 'ClassTestService', 'branchSettingsSevice', 'insExameSetting', 'periodSetup', 'classSettingsService', 'subjectSettingsSevice', 'commonService', 'conversion', 'teacherAttendanceSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function ClassTestSettingsController(syllabusSevice, ClassTestService, branchSettingsSevice, insExameSetting, periodSetup, classSettingsService, subjectSettingsSevice, commonService, conversion, teacherAttendanceSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

        var vm = this;
        $scope.disButton = true;

        $scope.addPassMark = false;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.listEvent = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.showItem = false;
            $scope.createItem = true;
        };


        $scope.changeGrid = function () {

            $scope.clsPeriod = [];
            $scope.showItem = false;
        };
        // Reset Button Logic
        $scope.clearField = function () {

            $state.go($state.current.name, {}, { reload: true });

        };


        $scope.openShiftIndex = function (index) {
            $scope.shiftindex = index;
            $scope.marks[$scope.shiftindex].id = $scope.shiftindex;
        };

        $scope.switchIsActive = function (e, index) {
            //if (e === 1 || e === true) {
            //    vm.classDays[index].IsActive = true;
            //} else {
            //    vm.classDays[index].IsActive = false;
            //}


        };

        $scope.MainDetailIndex = 0;
        vm.getAcademicClassDay = function (index) {
            $scope.showItem1 = false;
            $scope.MainDetailIndex = index;
            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            //$scope.addExameRoutin = true;
            $scope.createItem = true;

            var Params = {
                InstituteID: vm.institute.selected.InstituteID,
                MediumID: vm.medium.selected.MediumID,
                ClassID: vm.ClassID === undefined ? null : vm.ClassID,
                DepartmentID: vm.DepartmentID === undefined ? null : vm.DepartmentID,
                SectionID: vm.SectionID === undefined ? null : vm.SectionID,
                SubjectID: vm.SubjectID === undefined ? null : vm.SubjectID,
                ExamID: vm.ExamID === undefined ? null : vm.ExamID

            };
            return ClassTestService.getAcademicClassDayForCT(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.addRoutin = true;
                        vm.classDays = data;
                        if (vm.CTDetailArray.length > 0) {
                            $scope.checkifexist(vm.classDays);
                        }
                    }

                });

        };

        $scope.checkifexist = function (modelsArray) {
            angular.forEach(modelsArray, function (row) {
                var CTmodel = vm.CTDetailArray.filter(function (js, j) {
                    return (js.SyllabusDetailID === row.SyllabusDetailID
                        && js.SyllabusID === row.SyllabusID  //jshint ignore : line
                        && js.ClassDate === row.ClassDate //jshint ignore : line
                        && js.ClsDay === row.ClsDay && js.Topic === row.Topic //jshint ignore : line
                        && js.MainIndex === $scope.MainDetailIndex); //jshint ignore : line
                })[0];

                if (CTmodel !== undefined) {
                    row.IsActive = true;
                }
                else {
                    row.IsActive = false;
                }
            });
        };

        //vm.CTDetailArray = [];
        $scope.saveCTDetail = function (model, index) {
            var CTmodel = vm.CTDetailArray.filter(function (js, j) {
                return (js.SyllabusDetailID === model.SyllabusDetailID
                    && js.SyllabusID === model.SyllabusID //jshint ignore : line
                    && js.ClassDate === model.ClassDate //jshint ignore : line
                    && js.ClsDay === model.ClsDay && js.Topic === model.Topic //jshint ignore : line
                    //&& js.IsActive === model.IsActive
                    && js.MainIndex === $scope.MainDetailIndex); //jshint ignore : line
            })[0];

            if (CTmodel !== undefined) {
                if (model.IsActive === true) {
                    CTmodel.IsActive = true;
                    CTmodel.IsDelete = false;
                }
                else {
                    if (CTmodel.InsCTTopicID > 0 && CTmodel.InsCTID > 0) {
                        CTmodel.IsActive = false;
                        CTmodel.IsDelete = true;
                    }
                }
            }
            else {
                if (model.IsActive === true) {
                    vm.CTDetailArray.push({
                        InsCTTopicID: 0,
                        InsCTID: model.InsCTID,
                        SyllabusDetailID: model.SyllabusDetailID,
                        SyllabusID: model.SyllabusID,
                        ClassDate: model.ClassDate,
                        ClsDay: model.ClsDay,
                        Topic: model.Topic,
                        IsActive: model.IsActive,
                        MainIndex: $scope.MainDetailIndex,
                        IsDelete: false
                    });
                }
            }
        };
        vm.ExamMarkID = 0;


        vm.postExameExampassMark = function () {

            //debugger;
            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line


            var CTDetailArray = vm.CTDetailArray;
            var CtArray = [].concat.apply([], vm.ctList);

            ClassTestService.setInsExamCT({

                InsCTID: 0,
                CTID: vm.ExamID,
                CustomName: vm.SectionID === undefined ? null : vm.SectionID,
                SessionID: vm.SessionID,
                BoardID: vm.BoardID,
                BrunchID: vm.BrunchID === undefined ? null : vm.BrunchID,
                MediumID: vm.medium.selected.MediumID,
                ClassID: vm.ClassID,
                DepartmentID: vm.DepartmentID,
                SectionID: vm.SectionID,
                ShiftID: vm.ShiftID,
                SubjectID: vm.SubjectID,
                ExamID: vm.ExamID,
                Topic: null,
                CTMarks: null,
                CTDate: null,
                InstituteID: vm.institute.selected.InstituteID,
                IsActive: 1,
                LoggedUserID: $localStorage.userInfo[0].UserID,
                CtArray: CtArray,
                CTDetailArray: CTDetailArray

            })
                .then(function (data) {
                    logger.info('Saved!');
                    $state.go($state.current.name, {}, { reload: true });
                })
                .catch(function (error) { });
        };







        //-------------- Load Option --------------------//

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
            vm.subject = undefined;
            vm.values = [];
            vm.ExamID = null;
            vm.exam = undefined;
            vm.exames = [];

            $scope.showItem = false;
        };

        $scope.ReloadMedium = function (status) {
            //if (status === 0) {
            //    vm.MediumID = null;
            //    //vm.medium = [];
            //}
            //vm.medium = undefined;
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
            vm.SubjectID = null;
            vm.subject = undefined;
            vm.values = [];
        };




        $scope.ReloadClass = function (status) {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            //if (status === 0) {
            //    vm.ClassID = null;
            //}
            //vm.class = undefined;
        };

        //$scope.examDdl = function () {

        //};


        $scope.ReloadDept = function (status) {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.SubjectID = null;
            vm.subject = undefined;
            vm.values = [];

            //if (status === 0) {
            //    vm.DepartmentID = null;
            //}
            //vm.department = undefined;
            //vm.departments = [];
        };
        var dd = new Date();
        vm.ThisYear = dd.getFullYear();
        activate();

        function activate() {
            var promises = [getInstitute(''), getCmnBoardDdl(), getCmnSessionDdl()

            ];
            return $q.all(promises).then(function () {
            });
        }



        $scope.ReloadSec = function () {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];


        };

        vm.ClassSelected = function (ID, Status) {
            if (status === '') {
                vm.SectionID = null;
                vm.section = undefined;
                vm.sections = [];
                $scope.ReloadSec();
            }

            var params = {
                instituteId: vm.institute.selected.InstituteID, //$localStorage.userInfo[0].InstituteID,
                classId: vm.ClassID,
                DepartmentID: vm.DepartmentID === null || vm.DepartmentID === undefined ? 0 : vm.DepartmentID
            };
            vm.showSubject(vm.instituteID, params.DepartmentID, vm.MediumID, vm.ClassID);
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

        $scope.hideList = function () {
            $scope.addPassMark = false;
            $scope.disButton = true;
        };
        vm.getAllShift = function (InstituteID, status) {
            var Params = {
                instituteId: InstituteID
            };
            return commonService.getInstituteShift(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        vm.shifts = data;
                        $scope.IsRequiredShift = true;
                    }
                    else {
                        $scope.IsRequiredShift = false;
                    }

                    //if (status === 'Edit') {
                    //    vm.shift = {
                    //        selected: vm.shifts.filter(function (ob, i) {
                    //            return (ob.ShiftID === vm.ShiftID);
                    //        })[0]
                    //    };
                    //}


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
                    vm.getCmnBranchDdl(vm.instituteID, status);
                    //vm.showexams(vm.instituteID);

                    //vm.showSubject()
                    //vm.showSubject(vm.instituteID, vm.DepartmentID, vm.MediumID, vm.ClassID);
                    //vm.getCmnBranchDdl(vm.instituteID, status);
                });
        }



        vm.getmediumNameDdl = function (InstituteID, status) {
            if (status === '') {
                $scope.ReloadMedium(1);
                $scope.ReloadDll(InstituteID);
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
                $scope.ReloadClass(1);
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
                        vm.showSubject(vm.instituteID, 0, vm.MediumID, vm.ClassID);
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

        vm.getExame = function (ID, status) {


            //Generate Token API Pass Call
            // authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            var Params = {
                InstituteID: vm.instituteID,
                MediumID: vm.MediumID,
                ClassID: vm.ClassID
            };
            return insExameSetting.getAllExamesDDL(Params)
                .then(function (data) {
                    vm.Exames = [];
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

        vm.showSubject = function (a, b, c, d) {


            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            $scope.showItem = true;
            var subjectParams = {
                InstituteID: a,
                DepartmentID: b === undefined ? null : b,
                MediumID: c === undefined ? null : c,
                ClassID: d

            };
            return commonService.GetClassWiseSubject(subjectParams)
                .then(function (data) {
                    vm.subjects = data;
                    $scope.subjects = data;

                    vm.values = data;
                    //if ($scope.subjects !== undefined) {
                    //    for (var i = 0; i < $scope.subjects.length; i++) {

                    //        if ($scope.subjects[i].IsActive === 1) {
                    //            vm.values.push($scope.subjects[i]);

                    //        }

                    //    }
                    //}
                });
        };

        vm.getCmnBranchDdl = function (InstituteID, status) {
            var Params = {
                instituteId: InstituteID
            };
            return branchSettingsSevice.getBranchByInstituteId(Params)
                .then(function (data) {
                    vm.branchDdls = data;

                    if (status === 'Edit') {
                        vm.branch = {
                            selected: vm.branchDdls.filter(function (ob, i) {
                                return (ob.BrunchID === vm.BrunchID);
                            })[0]
                        };
                    }
                });
        };

        function getCmnBoardDdl() {
            return commonService.getBoard()
                .then(function (data) {
                    vm.boards = data;
                });
        }

        function getCmnSessionDdl() {
            return commonService.getSession()
                .then(function (data) {
                    vm.sessions = data;
                    vm.session = {
                        selected: vm.sessions.filter(function (ob, i) {
                            return (parseInt(ob.SessionName) === vm.ThisYear);
                        })[0]
                    };
                });
        }

        vm.getDeclareCTList = function () {

            return ClassTestService.getDeclareCTList()
                .then(function (data) {
                    vm.ctList = data;
                    $scope.addPassMark = true;
                    //{
                    //    CTID: 1,
                    //        CTName: 'Class Test 1',
                    //            IsActive: true,
                    //                ExamDate: '01-05-2018',
                    //                    Topic: 'hgfjfg',
                    //                        CustomName: 'ghfgj'
                    //},

                });

        };

    }
})();

