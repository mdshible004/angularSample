(function () {
    'use strict';

    angular
        .module('app.resultProcessingSetup')
        .controller('ResultProcessingSetupController', ResultProcessingSetupController);

    ResultProcessingSetupController.$inject = ['resultProcessingSetup', 'classSettingsService', 'subjectSettingsSevice', 'exameRoutineEntry', 'insExameSetting', 'commonService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function ResultProcessingSetupController(resultProcessingSetup, classSettingsService, subjectSettingsSevice, exameRoutineEntry, insExameSetting, commonService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {



        var vm = this;
       // $scope.RpShow = true;
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
        //$scope.addRoutin1 = true;
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
        $scope.Show = function (a) {
            vm.ExamList = [];
            var Params = {
                InstituteID: vm.institute.selected.InstituteID,
                MediumID: vm.medium.selected.MediumID,
                ClassID: vm.class.selected.ClassID,
                Sequence: vm.Sequence
            };
            resultProcessingSetup.getInsExamListForResult(Params)
                .then(function (data) {
                    vm.ExamList = data;

                });
            vm.FinalResultProcessingTypeID !== undefined && a === 1 ? $scope.addRoutin = true : $scope.addRoutin = false; //jshint ignore : line
            $scope.RpShow = true;
            $scope.addRoutin1 = true;

        };

        $scope.IsXmSelected = true;
        $scope.IsXmSelectedFunc = function (a) {
            if (a === 0) {
                $scope.IsXmSelected = false;
            } else {
                $scope.IsXmSelected = true;
            }
            

        };
        $scope.IsCtCal = function (a,status,id) {
            if (a === true) {
                return resultProcessingSetup.getCmnCtProcessingTypeDDL()
                    .then(function (data) {
                        vm.ctTypes = data;
                        if (status === 'Edit') {
                            vm.ct = {
                                selected: vm.ctTypes.filter(function (ob, i) {
                                    return (ob.CtProcessingTypeID === id);
                                })[0]
                            };
                        }

                    });
            }
            else {
                vm.ctTypes = [];
                vm.ct = undefined;
            }
        };
        $scope.addRoutin = false;
        $scope.IsFinalCal = function (a,status,id) {
            if (a === true) {
                return resultProcessingSetup.getCmnFinalResultProcessingTypeDDL()
                    .then(function (data) {
                        vm.finalProTypes = data;
                        if (status === 'Edit') {
                            vm.final = {
                                selected: vm.finalProTypes.filter(function (ob, i) {
                                    return (ob.FinalResultProcessingTypeID === id);
                                })[0]
                            };
                        }
                    });

            }
            else {
                vm.finalProTypes = [];
                vm.final = undefined;
            }
        };

        function getCmnRollProcessingTypeDDL() {

            return resultProcessingSetup.getCmnRollProcessingTypeDDL()
                .then(function (data) {
                    vm.rollProTypes = data;
                });
        }
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

        vm.Total = 0;
        vm.CalculateColumns = function (index) {
            vm.Total = 0;
            for (var i = 0; i < vm.ExamList.length; i++) {
                vm.ExamList[i].ParcentMark = vm.ExamList[i].ParcentMark === null || vm.ExamList[i].ParcentMark === undefined ? 0 : vm.ExamList[i].ParcentMark;
                vm.Total += vm.ExamList[i].ParcentMark;
            }

            if (vm.Total > 100) {
                logger.error('Total Exceeds 100');
                vm.ExamList[index].ParcentMark -= vm.Total - 100;
                
            }
        };
        $scope.total = 0;
        $scope.saveBtn = true;
        $scope.addRoutin = false;
        vm.showResultProList = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line
            $scope.showItem = true;
            var Params = {
                InstituteID: vm.institute.selected.InstituteID

            };
            return resultProcessingSetup.getInsResultProcessingMaster(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        vm.RpList = data;
                        $scope.showRpList = true;
                        $scope.addRoutin = false;
                        $scope.RpShow = false;
                        $scope.addRoutin1 = false;
                        $scope.createItem = false;
                    } else {
                        logger.error('No data Found...!!!');
                    }


                });
        };

        vm.ProcessingID = 0;

        vm.setInsResultProcessing = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line



            var resultProArray = [].concat.apply([], vm.ExamList);
            resultProcessingSetup.setInsResultProcessing({
                ProcessingDetailID: null,
                ProcessingID: vm.ProcessingID,
                MediumID: vm.MediumID,
                ClassID: vm.ClassID,
                ExamID: vm.ExamID,
                InstituteID: vm.institute.selected.InstituteID,
                IsClassTestCalculate: vm.CtCal === true || vm.CtCal===1?1:0,
                ClassTestProcessingTypeID: vm.CtProcessingTypeID,
                IsFinal: vm.FinalCal === true?1:0,
                FinalProcessingTypeID: vm.FinalResultProcessingTypeID,
                IsMultiplePlacement: vm.MpaCal === true?1:0,
                RollProcessingTypeID: vm.RollProcessingTypeID,
                IsActive: 1,                
                LoggedUserID: $localStorage.userInfo[0].UserID,
                resultProArray: resultProArray

            })
                .then(function (data) {
                    logger.info('Saved!');
                    $state.go($state.current.name, {}, { reload: true });
                })
                .catch(function (error) { });
        };


        vm.editInsResultProcessing = function (model) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore: line
            //vm.instituteID=undefi
            $scope.data = [];
            $scope.showRpList = false;
            $scope.createItem = true;
            $scope.addRoutin = true;
            $scope.RpShow = true;
            vm.instituteID = model.InstituteID;
            vm.MediumID = model.MediumID;
            vm.ClassID = model.ClassID;
            vm.ExamID = model.ExamID;
            vm.CtCal = model.IsClassTestCalculate;
            vm.FinalCal = model.IsFinal;
            vm.CtProcessingTypeID = model.ClassTestProcessingTypeID;
            vm.FinalResultProcessingTypeID = model.FinalProcessingTypeID;
            vm.MpaCal = model.IsMultiplePlacement;
            vm.RollProcessingTypeID = model.RollProcessingTypeID;
            vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };
            
            vm.roll = { selected: vm.rollProTypes.filter(function (ob, i) { return (ob.RollProcessingTypeID === vm.RollProcessingTypeID); })[0] };
            if (vm.CtCal === true) {
                $scope.IsCtCal(true, 'Edit', vm.CtProcessingTypeID);
            }
            if (vm.FinalCal === true) {
                $scope.IsFinalCal(true, 'Edit', vm.FinalResultProcessingTypeID);
            }
            if (vm.instituteID !== undefined || vm.MediumID !== undefined || vm.ClassID !== undefined || vm.ExamID !== undefined) {
                $scope.IsXmSelectedFunc(0);
            }
            vm.getmediumNameDdl(vm.instituteID, 'Edit');
            vm.MediumWiseClassDDL(vm.MediumID, 'Edit');
            vm.getExame(vm.ExamID, 'Edit');
            
            vm.ProcessingID = parseInt(model.ProcessingID);
            $scope.addRoutin1 = true;
            var Params = {
                ProcessingID: vm.ProcessingID
            };

            resultProcessingSetup.getInsResultProcessingDetail(Params)
                .then(function (data) {
                    vm.ExamList = [];
                    if (data.length > 0) {
                        $scope.btnDis = true;
                        vm.ExamList = data;
                        //vm.ExamID = data[0].ExamID;
                        vm.ProcessingDetailID = parseInt(data[0].ProcessingDetailID);
                    }

                })
                .catch(function (error) { });
        };


        vm.deleteInsResultProcessing = function (ProcessingID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)) //jshint ignore : line


            var params = {
                ProcessingID: ProcessingID,
                LoggedUserID: parseInt($localStorage.userInfo[0].UserID)
            };
            resultProcessingSetup.deleteInsResultProcessing(params)
                .then(function (data) {
                    if (data[0].ReturnValue) {
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
            vm.Exames = [];
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
            vm.Exames = [];
        };

        $scope.ReloadClass = function () {

            //vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
            vm.Exames = [];
        };
        $scope.ReloadDept = function () {
            vm.department = undefined;
            vm.departments = [];
        };

        $scope.change = function () {
            vm.medium = null;
            vm.class = null;
            vm.mediums = [];
            vm.Exames = [];
            vm.Exame = undefined;
            $scope.addRoutin = false;
            vm.Exames = [];

        };
        $scope.changeMed = function () {

            vm.class = null;
            vm.department = null;
            vm.classes = [];
            vm.departments = [];
            $scope.addRoutin = false;
            vm.Exame = undefined;
            vm.Exames = [];
        };
        $scope.changeCls = function () {
            vm.department = null;
            vm.departments = [];
            $scope.addRoutin = false;
            vm.Exames = [];
        };
        $scope.changexm = function () {
            $scope.addRoutin = false;
        };
        $scope.changeDep = function () {
            $scope.addRoutin = false;
        };

        activate();
        function activate() {
            var promises = [getInstitute(''), getCmnRollProcessingTypeDDL()];
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

        vm.Exames = [];
        vm.getExame = function (ID, status) {


            //Generate Token API Pass Call
            // authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            var Params = {
                InstituteID: vm.instituteID,
                MediumID: vm.MediumID,
                ClassID: vm.ClassID
            };

            insExameSetting.getAllExamesDDL(Params)

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


    }
})();
