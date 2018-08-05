(function () {
    'use strict';

    angular
        .module('app.passMarksSetUp')
        .controller('passMarksSetUpController', passMarksSetUpController);

    passMarksSetUpController.$inject = ['classSettingsService', 'subjectSettingsSevice', 'exameRoutineEntry', 'insExameSetting', 'commonService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function passMarksSetUpController(classSettingsService, subjectSettingsSevice, exameRoutineEntry, insExameSetting, commonService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {



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
        $scope.addRoutin = true;
        $scope.addExameRoutin = false;
        $scope.addpassmarks = false;
        $scope.editRoutint = false;
        $scope.createmarks = false;
        $scope.itemEvent = function () {
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
            $scope.createmarks = false;
            $scope.addpassmarks = false;
        };

        $scope.data = [];
        $scope.subjectArr = [];
        //$scope.openSubjectIndex = function (index) {
        //    $scope.subjectsindex = index;
        //    $scope.subjectArr[$scope.subjectsindex].id = $scope.subjectsindex;
        //};
        //$scope.openSubjectIndexs = function (index) {
        //    $scope.subjectsindex = index;
        //    $scope.data[$scope.subjectsindex].id = $scope.subjectsindex;
        //};
        
        $scope.IsCalTotal = function (e, index) {
            if (e === true) {
                $scope.subjects[index].MCQ = 0;
                $scope.subjects[index].Written = 0;
                $scope.subjects[index].Precticle = 0;
                $scope.subjects[index].Attendance = 0;
                $scope.subjects[index].Total = 0;
                $scope.IsReadOnly[index] = false;
                $scope.subjects[index].IsCalculateOnTotal = true;
            } else {
                $scope.subjects[index].IsActive = 0;
                $scope.IsReadOnly[index] = true;
                $scope.subjects[index].IsCalculateOnTotal = false;
            }
        };
        //$scope.func = function () {
        //    if (e === true) {
        //        $scope.IsReadOnly.push(true);
        //    } else {
        //        $scope.subjects[index].IsActive = 0;
        //        $scope.IsReadOnly[index] = true;
        //        $scope.subjects[index].IsCalculateOnTotal = false;
        //    }
        //};
        $scope.IsReadOnly = [];
        vm.showInsExamePassMark = function () {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            $scope.data = [];
            $scope.addExameRoutin = true;
            $scope.createItem = false;
            $scope.addRoutin = false;
            var Params = {
                InstituteID: vm.institute.selected.InstituteID

            };
            return insExameSetting.getExamPassMarks(Params)
                .then(function (data) {
                    vm.passmarks = data;
                    
                    
                });

        };

        vm.CalculateColumns = function (model) {
            var MCQ = model.MCQ === null || model.MCQ === undefined ? 0 : model.MCQ;
            var Written = model.Written === null || model.Written === undefined ? 0 : model.Written;
            var Practicle = model.Precticle === null || model.Precticle === undefined ? 0 : model.Precticle;
            var Attendance = model.Attendance === null || model.Attendance === undefined ? 0 : model.Attendance;
            model.Total = MCQ + Written + Practicle + Attendance;
            if(model.Total>100){
                     logger.error('Total marks exceeds 100');                
                                        }
        };
        $scope.total = 0;
        $scope.saveBtn = true;
        $scope.addRoutin = false;
        vm.showSubject = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            $scope.showItem = true;
            var subjectParams = {
                InstituteID: vm.institute.selected.InstituteID,
                DepartmentID: vm.DepartmentID === undefined ? null : vm.DepartmentID,
                MediumID: vm.MediumID,
                ClassID: vm.ClassID,
                PassMarkID: 0,
                ExamID: vm.ExamID

            };
            return insExameSetting.getInsPassMarkByParms(subjectParams)
                .then(function (data) {
                    vm.subjects = data;
                    $scope.saveBtn = false;
                    $scope.subjects = data;
                    $scope.addRoutin = true;
                    $scope.subjectArr = [];
                    
                    if ($scope.subjects !== undefined) {
                        for (var i = 0; i < $scope.subjects.length; i++) {

                            if ($scope.subjects[i].IsActive === 1 || $scope.subjects[i].IsActive === true) {
                            var value = $scope.subjects[i];
                            var newrow = [];
                            $scope.subjects[i].IsCalculateOnTotal === 1 || $scope.subjects[i].IsCalculateOnTotal === true ? $scope.IsReadOnly.push(false) : $scope.IsReadOnly.push(true); //jshint ignore:line
                            //$scope.func();
                            newrow =
                                {
                                    'SubjectID': value.SubjectID,
                                    'SubjectName': value.SubjectName,
                                    'InstituteID': value.InstituteID,
                                    'DepartmentID': value.DepartmentID,
                                    'MediumID': value.MediumID,
                                    'ClassID': value.ClassID,
                                    'ExamID': vm.ExamID,
                                    'PassMarkDetailID': null,
                                    'PassMarkID': value.PassMarkID,
                                    'MCQ': null,
                                    'Written': null,
                                    'Precticle': null,
                                    'Attendance': null,
                                    'IsCal': value.IsCalculateOnTotal,
                                    'Total': null,
                                    'IsActive': 1
                                    };

                            $scope.subjectArr.push(newrow);
                            }
                            //console.log($scope.IsReadOnly);

                        }
                    }
                });
        };






        vm.PassMarkDetailID = 0;
        vm.PassMarkID = 0;

        vm.postExameExampassMark = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line



            var examPassMark = [].concat.apply([], $scope.subjects);
            insExameSetting.postExamePassMarksDetail({
                PassMarkDetailID: examPassMark[0].PassMarkDetailID === null ? 0 : examPassMark[0].PassMarkDetailID,
                PassMarkID: vm.PassMarkID,
                ExamID: vm.ExamID,
                DepartmentID: vm.DepartmentID,
                MediumID: vm.MediumID,
                ClassID: vm.ClassID,
                SubjectID: examPassMark[0].SubjectID[0],
                MCQ: examPassMark[0].MCQ,
                Written: examPassMark[0].Written,
                Precticle: examPassMark[0].Precticle,
                Attendance: examPassMark[0].Attendance,
                Total: examPassMark[0].Total,
                InstituteID: vm.institute.selected.InstituteID,
                LoggedUserID: $localStorage.userInfo[0].UserID,
                examPassMark: examPassMark

            })
                .then(function (data) {
                    logger.info('Saved!');
                    $state.go($state.current.name, {}, { reload: true });
                })
                .catch(function (error) { });
        };



        

        vm.deleteUserPassMarks = function (PassMarkID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)) //jshint ignore : line


            var params = {
                PassMarkID: PassMarkID
            };
            insExameSetting.IsdeleteExamPassByID(params)
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
       

        $scope.ReloadDll = function () {
            vm.MediumID = null;
            vm.medium = undefined;
            vm.mediums = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
            // $scope.addRoutin = false;
        };
        $scope.ReloadMedium = function () {
            //vm.MediumID = null;
            vm.medium = undefined;
            vm.mediums = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
        };

        $scope.ReloadClass = function () {
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            //vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
        };
        $scope.ReloadDept = function () {
            vm.department = undefined;
            vm.departments = [];
        };

        $scope.change = function () {
            vm.medium = null;
            vm.class = null;
            vm.department = null;
            vm.classes = [];
            vm.departments = [];
            vm.mediums = [];
            vm.Exames = [];
            vm.Exame = undefined;
            $scope.addRoutin = false;
        };
        $scope.changeMed = function () {

            vm.class = null;
            vm.department = null;
            vm.classes = [];
            vm.departments = [];
            $scope.addRoutin = false;
        };
        $scope.changeCls = function () {
            vm.department = null;
            vm.departments = [];
            $scope.addRoutin = false;
        };
        $scope.changexm = function () {
            $scope.addRoutin = false;
        };
        $scope.changeDep = function () {
            $scope.addRoutin = false;
        };

        activate();
        function activate() {
            var promises = [getInstitute('')];
            return $q.all(promises).then(function () {
            });
        }

        vm.InsID = vm.institute === undefined ? $localStorage.userInfo[0].InstituteID : vm.institute.selected.InstituteID;
        function getInstitute(status) {
            if (status === '') {
                $scope.ReloadDll();
            }

            return classSettingsService.getInstitute()
                .then(function (data) {
                    vm.institutes = data;
                    vm.instituteID = status === 'Edit' ? vm.institute.selected.InstituteID : $localStorage.userInfo[0].InstituteID;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };
                    vm.getmediumNameDdl(vm.instituteID, status);
                    //vm.getExame(vm.instituteID);
                });
        }

        vm.getmediumNameDdl = function (InstituteID, status) {
            if (status === '') {
                $scope.ReloadMedium();
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

        vm.MediumWiseClassDDL = function (MediumID, status) {
            if (status === '') {
                $scope.ReloadClass();
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

        vm.ClassWiseDepartmentDDL = function (ClassID, status) {
            vm.getExame();
            if (status === '') {
                $scope.ReloadDept();
            }

            var Params = {
                InstituteID: vm.institute.selected.InstituteID,
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
                    }
                });

        };
        vm.Exames = [];
        vm.getExame = function (ID, status) {


            //Generate Token API Pass Call
            // authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            //var Params = {
            //    insID: vm.institute.selected.InstituteID
            //};
            //return insExameSetting.getAllExamesDDL(Params)
            //    .then(function (data) {
            //        vm.Exames = data;
            //        vm.Examss = data;
            //        if (status === 'Edit') {
            //            vm.Exame = {
            //                selected: vm.Exames.filter(function (ob, i) {
            //                    return (ob.ExamID === vm.ExamID);
            //                })[0]
            //            };
            //        }
            //    });
            var Params = {
                    InstituteID: vm.institute.selected.InstituteID,
                    MediumID: vm.medium.selected.MediumID,
                    ClassID: vm.class.selected.ClassID
                };
          
            insExameSetting.getAllExamesDDL(Params)

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
                                    return (ob.ExamID === vm.ExamID);
                                })[0]
                            };
                        }
                    }
            
                });
        };



    }
})();
