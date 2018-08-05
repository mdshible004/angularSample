
(function () {
    'use strict';

    angular
        .module('app.subjectWiseMarksEntry')
        .controller('subjectWiseMarksEntryController', subjectWiseMarksEntryController);

    subjectWiseMarksEntryController.$inject = ['insExameSetting','periodSetup', 'classSettingsService','subjectSettingsSevice','commonService', 'conversion', 'teacherAttendanceSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function subjectWiseMarksEntryController( insExameSetting, periodSetup, classSettingsService, subjectSettingsSevice, commonService, conversion, teacherAttendanceSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

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

        $scope.switch = function (e) {
            if (e === 1) {
                $scope.marks[$scope.shiftindex].IsAbsent = 0;
            } else {
                $scope.marks[$scope.shiftindex].IsAbsent = 1;
            }


        };



        $scope.getAllResults = function () {

            var params = {
                UserID: 0,
                InstituteID: vm.institute.selected.InstituteID,
                ClassID: vm.ClassID === undefined ? 0 : vm.ClassID,
                SectionID: vm.SectionID === undefined ? 0 : vm.SectionID,
                DepartmentID: vm.DepartmentID === undefined ? 0 : vm.DepartmentID,
                MediumID: vm.MediumID === undefined ? 0 : vm.MediumID,
                ShiftID: vm.ShiftID === undefined ? 0 : vm.ShiftID,
                SubjectID: vm.SubjectID === undefined ? 0 : vm.SubjectID,
                ExamID: vm.ExamID === undefined ? 0 : vm.ExamID
            };
            return insExameSetting.getSubjectWiseMarks(params)
                .then(function (data) {
                    vm.marks = data;

                    $scope.marks = data;
                    $scope.addPassMark = true;
                    $scope.disButton = false;
                });
        };


        vm.CalculateColumns = function (model) {
            var MCQ = model.MCQ === null || model.MCQ === undefined ? 0 : model.MCQ;
            var Written = model.Written === null || model.Written === undefined ? 0 : model.Written;
            var Practicle = model.Precticle === null || model.Precticle === undefined ? 0 : model.Precticle;
            var Attendance = model.Attendance === null || model.Attendance === undefined ? 0 : model.Attendance;
            //model.Total = MCQ + Written + Practicle + Attendance;
            var total = MCQ + Written + Practicle + Attendance;
            if (total > 100) {
                logger.info('Total Marks cannot be more than 100');
                $scope.disButton = true;
            }
            else {
                model.Total = total;
                $scope.disButton = false;
            }
        };

       



        vm.ExamMarkID = 0;
        

        vm.postExameExampassMark = function () {

            //debugger;
            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line



            var examMarks = [].concat.apply([], $scope.marks);

            insExameSetting.postExamMarks({

                ExamMarkID: examMarks[0].ExamMarkID === null ? 0 : examMarks[0].ExamMarkID,             
                ExamID: vm.ExamID,
                SectionID: vm.SectionID === undefined ? null : vm.SectionID,
                ShiftID: vm.ShiftID === undefined ? null : vm.ShiftID,
                UserID: examMarks[0].UserID,
                DepartmentID: vm.DepartmentID === undefined ? null : vm.DepartmentID,
                MeduimID: vm.MediumID,
                ClassID: vm.ClassID,
                SubjectID: vm.SubjectID,
                MCQ: examMarks[0].MCQ,
                Written: examMarks[0].Written,
                Precticle: examMarks[0].Precticle,
                Attendance: examMarks[0].Attendance,
                Total: examMarks[0].Total,
                InstituteID: vm.institute.selected.InstituteID,
                IsAbsent: examMarks[0].IsAbsent,
                LoggedUserID: $localStorage.userInfo[0].UserID,
                IsDeleted: 0,
               
                examMarks: examMarks

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

        activate();

        function activate() {
            var promises = [getInstitute('') /*vm.showexams()*/
                
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

                    vm.showexams();
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



        vm.showexams = function () {
            //$scope.ReloadDll(a);
            var Params = {
                InstituteID: vm.instituteID,
                MediumID: vm.MediumID,
                ClassID: vm.ClassID
            };            

            return insExameSetting.getAllExamesDDL(Params)

                    .then(function (data) {
                        vm.exames = data;
                       
                    });
           
        };
        vm.showSubject = function (a,b,c,d) {


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

        
    }
})();

