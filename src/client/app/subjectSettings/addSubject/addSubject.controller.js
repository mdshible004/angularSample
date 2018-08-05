(function () {
    'use strict';

    angular
        .module('app.subjectSettings')
        .controller('SubjectSettingsController', SubjectSettingsController);

    SubjectSettingsController.$inject = ['mailSettings', 'commonService', 'subjectSettingsSevice', 'branchSettings', 'mediumsetting', 'classSettings', 'teacherAttendanceSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function SubjectSettingsController(mailSettings, commonService, subjectSettingsSevice, branchSettings, mediumsetting, classSettings, teacherAttendanceSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

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
            $scope.subjectArr = [];
            $scope.showItem = false;
        };

        vm.showEvent = function () {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            $scope.btnDis = false;
            var subjectParams = {
                InstituteID: vm.institute.selected.InstituteID,
                DepartmentID: vm.DepartmentID === undefined ? null : vm.DepartmentID,
                MediumID: vm.MediumID === undefined ? null : vm.MediumID,
                ClassID: vm.ClassID === undefined ? null : vm.ClassID

            };
            if (subjectParams.InstituteID === null || subjectParams.ClassID === null) {
                logger.error('Please Select Class');
                $scope.btnHide = false;
            } else {
                $scope.showItem = true;
                $scope.btnHide = false;
                $scope.btnHide = false;
                return subjectSettingsSevice.getSubjectByParms(subjectParams)
                    .then(function (data) {
                        vm.subjects = data;
                        $scope.subjects = data;
                        $scope.subjectss = data;
                        //vm.subject.selected.SubjectName=data[0].SubjectName;
                        $scope.subjectArr = [];

                        if ($scope.subjects !== undefined) {
                            for (var i = 0; i < $scope.subjects.length; i++) {

                                var value = $scope.subjects[i];
                                var newrow = [];
                                newrow = {
                                    'SubjectID': value.SubjectID,
                                    'SubjectNo': value.SubjectNo,
                                    'SubjectName': value.SubjectName,
                                    'InsSubjectID': value.InsSubjectID,
                                    'InstituteID': vm.InstituteID,
                                    'DepartmentID': value.DepartmentID,
                                    'MediumID': value.MediumID,
                                    'ClassID': value.ClassID,
                                    'IsActive': value.IsActive,
                                    'IsCombined': value.IsCombined,
                                    'IsOptional': value.IsOptional === 1 || value.IsOptional === true ? true : false,
                                    'SubjectDdl': {
                                        SubjectID: value.ParentID,
                                        SubjectName: value.ParentSubject
                                    },
                                    'ParentID': value.ParentID,
                                    'ParentSubject': value.SubjectName
                                };
                                $scope.subjectArr.push(newrow);

                            }
                        }
                    });
            }
        };
        $scope.DisBtn = function () {
            $scope.btnDis = true;
            $scope.showItem = false;
        };
        $scope.btnDis = true;
        $scope.btnHide = false;
        //Post Menu Settings
        vm.insSubjects = function () {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line

            $scope.btnDis = true;
            $scope.btnHide = true;
            var subjectArray = [];
            if ($scope.subjectArr !== undefined) {
                // if($scope.subjectArr[i].IsCombined===1 && $scope.subjectArr[i].SubjectDdl.SubjectID===undefined){
                //   logger.error('Please Select P')
                // }else{

                // }
                subjectSettingsSevice.postInsSubject({
                    'InsSubjectID': null,
                    'SubjectID': null,
                    'MediumID': vm.medium === undefined ? null : vm.MediumID,
                    'DepartmentID': vm.department === undefined ? null : vm.DepartmentID,
                    'ClassID': vm.ClassID,
                    'IsCombined': null,
                    'IsActive': null,
                    'ParentID': null,
                    'InstituteID': vm.institute.selected.InstituteID,
                    'LoggedUserID': vm.LoggedUserID,
                    subjectArray: $scope.subjectArr
                })
                    .then(function (data) {
                        logger.info('Saved!');

                        $state.go($state.current.name, {}, { reload: true });
                    })
                    .catch(function (error) { });
            } else {
                logger.error('Please Select Class');
            }

        };

        $scope.openSubjectIndexCombined = function (index) {
            $scope.subjectindexs = index;
            $scope.subjectss[$scope.subjectindexs].isComid = $scope.subjectindexs;
        };
        $scope.openSubjectIndexActive = function (index) {
            $scope.subjectindex = index;
            $scope.subjects[$scope.subjectindex].isActid = $scope.subjectindex;
        };
        $scope.switchIsActive = function (e) {

            if (e === true) {
                $scope.subjectArr[$scope.subjectindex].IsActive = 1;
            } else {
                $scope.subjectArr[$scope.subjectindex].IsActive = 0;
            }

        };
        $scope.switchIsCombined = function (e) {
            if (e === true) {
                $scope.subjectArr[$scope.subjectindexs].IsCombined = 1;
            } else {
                $scope.subjectArr[$scope.subjectindexs].IsCombined = 0;
            }

        };

        vm.getmediumNameDdl = function (c) {
            vm.mediums = [];
            vm.medium = undefined;
            vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            var Params = {
                instituteId: c
            };
            return commonService.getInstituteMediumDdl(Params)
                .then(function (data) {
                    //debugger;
                    vm.mediums = data;
                    if (vm.mediums.length > 0) {
                        var DefaultModel = vm.mediums.filter(function (ob, i) { return (ob.IsDefault === true); })[0];

                        if (DefaultModel !== undefined) {
                            vm.medium = { selected: vm.mediums.filter(function (ob, i) { return (ob.IsDefault === true); })[0] };
                            vm.MediumID = vm.medium.selected.MediumID;
                            vm.MediumWiseClassDDL(vm.MediumID);
                        }
                    }
                    else {
                        vm.MediumID = null;
                        $scope.DisBtn();
                    }
                    //vm.MediumWiseClassDDL(Params);
                    //getClassDdl(Params);
                    //getInsDepartmentDdl(Params);
                });

        };

        activate();

        function activate() {
            var promises = [getAllInstitute()];
            return $q.all(promises).then(function () { });
        }

        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.instituteID = $localStorage.userInfo[0].InstituteID;
        function getAllInstitute() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            return mailSettings.getAllInstitutes()
                .then(function (data) {
                    vm.institutes = data;
                    vm.instituteID = vm.instituteID;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };
                    vm.getmediumNameDdl(vm.instituteID);

                });

        }

        vm.ClassWiseDepartmentDDL = function (m) {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line
            vm.department = undefined;
            vm.departments = [];
            var Params = {
                InstituteID: vm.institute.selected.InstituteID,
                ClassID: vm.class.selected.ClassID,
                MediumID: vm.medium.selected.MediumID
            };
            return subjectSettingsSevice.getClassWiseDepartmentDDL(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        vm.departments = data;
                        $scope.IsRequired = true;
                    }
                    else {
                        vm.DepartmentID = null;
                        $scope.IsRequired = false;
                    }

                });

        };

        vm.MediumWiseClassDDL = function (n) {
            vm.class = undefined;
            vm.classes = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];

            if (vm.MediumID !== null) {
                //Generate Token API Pass Call
                authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

                var Params = {
                    InstituteID: vm.institute.selected.InstituteID,
                    MediumID: n
                };
                return subjectSettingsSevice.getMediumWiseClassDDL(Params)
                    .then(function (data) {
                        vm.classes = data;
                        if (vm.classes.length === 0) {
                            vm.ClassID = null;
                            $scope.DisBtn();
                        }
                    });
            }
            else {
                logger.error('Select Medium first');
            }
        };
    }
})();
