(function () {
    'use strict';

    angular
        .module('app.ClassWiseDepartment')
        .controller('ClassWiseDepartmentSettingsController', ClassWiseDepartmentSettingsController);

    ClassWiseDepartmentSettingsController.$inject = ['instDepartmentSettings', 'classWiseDepartmentService', 'subjectSettingsSevice', 'commonService', 'mailSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function ClassWiseDepartmentSettingsController(instDepartmentSettings, classWiseDepartmentService, subjectSettingsSevice, commonService, mailSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

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
        $scope.showDepeartment = false;
        $scope.createItem = true;
        $scope.Dis = false;
        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        $scope.showDepeartment = false;

        //Depertment Scope

        //$scope.departments;

        // $scope.departmentindex;
        $scope.openDepartmentIndex = function (index) {
            $scope.departmentindex = index;
            $scope.departments[$scope.departmentindex].id = $scope.departmentindex;
        };

        $scope.hideList = function () {
            $scope.showDepeartment = false;
        };

        $scope.switch = function (e) {
            if (e === 1) {
                $scope.departments[$scope.departmentindex].IsActive = 0;
            } else {
                $scope.departments[$scope.departmentindex].IsActive = 1;
            }

        };
        $scope.gridChange = function () {
            $scope.departments = [];
            $scope.showDepeartment = false;

        };
        //Post Shift
        vm.insdepartments = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            $scope.Dis = true;
            var departmentsArr = [];
            if ($scope.departments !== undefined) {
                for (var i = 0; i < $scope.departments.length; i++) {
                    if ($scope.departments[i].IsActive === 0 && $scope.departments[i].ClassWiseDepID === null) {
                        console.log('Shibli');
                    } else {
                        if (vm.MediumID !== null || vm.MediumID !== undefined) {
                            $scope.departments[i].MediumID = vm.MediumID;
                        }

                        departmentsArr.push($scope.departments[i]);
                    }
                }
                if (departmentsArr.length > 0) {
                    classWiseDepartmentService.postClassWiseDepartment({
                        ClassWiseDepID: null,
                        ClassID: null,
                        DepartmentID: null,
                        IsActive: 1,
                        InstituteID: vm.institute.selected.InstituteID,
                        MediumID: vm.MediumID,
                        LoggedUserID: $localStorage.userInfo[0].UserID,
                        IsDeleted: 0,

                        departmentsArr: departmentsArr
                    })
                        .then(function (data) {
                            logger.info('Saved!');
                            //$state.transitionTo('deliverypartner.listpartner');
                            $state.go($state.current.name, {}, { reload: true });
                        })
                        .catch(function (error) { });
                } else {
                    logger.error('Please Select Department');
                }
            } else {
                logger.error('Please Select Your Institute first');
            }

            //console.log(vm.parents);
        };


        vm.showDepartment = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            if (vm.instituteID === undefined || vm.ClassID === undefined || vm.institute.selected === undefined || vm.cls.selected === undefined) {
                logger.error('Please select Institute and Class');
            }
            else {
                var Params = {
                    InstituteID: vm.institute.selected.InstituteID,
                    ClassID: vm.cls.selected.ClassID,
                    MediumID: vm.MediumID === undefined || vm.MediumID === null ? 0 : vm.MediumID
                };
                classWiseDepartmentService.getAllDepartmentClassWise(Params)

                    .then(function (data) {
                        $scope.departments = data;
                        $scope.showDepeartment = true;
                        $scope.showDepeartment = true;

                    });

            }
        };


        activate();

        function activate() {
            var promises = [getAllInstitute()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        function getAllInstitute() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return mailSettings.getAllInstitutes()
                .then(function (data) {
                    vm.institutes = data;
                    vm.instituteID = vm.InstituteID;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.InstituteID); })[0] };
                    //vm.instituteSelected(vm.InstituteID);
                    vm.instituteSelectedMedium(vm.InstituteID);
                });
        }

        //vm.instituteSelected = function (InstituteID) {
        //    vm.class = [];       
        //    vm.cls = undefined;           
        //    var params = {
        //        instituteId: InstituteID
        //    };

        //    commonService.getInstituteClass(params)
        //        .then(function (data) {
        //            vm.class = data;
        //        });            
        //};

        vm.instituteSelectedMedium = function (InstituteID) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            vm.medium = [];
            vm.med = undefined;
            vm.class = [];
            vm.cls = undefined;

            var params = {
                instituteId: InstituteID
            };

            commonService.getInstituteMediumDdl(params)
                .then(function (data) {
                    vm.medium = data;
                    var IsD = vm.medium.filter(function (ob, i) { return (ob.IsDefault === true); })[0];

                    vm.med = IsD === undefined ? undefined : { selected: vm.medium.filter(function (ob, i) { return (ob.IsDefault === true); })[0] };
                    vm.MediumID = IsD === undefined ? null : vm.med.selected.MediumID;

                    if (IsD !== undefined) {
                        vm.MediumWiseClassDDL(vm.MediumID);
                    }

                });
        };

        vm.MediumWiseClassDDL = function (n) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            vm.class = [];
            vm.cls = undefined;
            if (vm.MediumID !== null) {
                var Params = {
                    InstituteID: vm.institute.selected.InstituteID,
                    MediumID: n
                };
                return subjectSettingsSevice.getMediumWiseClassDDL(Params)
                    .then(function (data) {
                        vm.class = data;

                    });
            }
            else {
                logger.error('Select Medium first');
            }
        };


    }
})();
