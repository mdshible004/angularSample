(function () {
    'use strict';

    angular
        .module('app.instDepartmentSettings')
        .controller('instDepartmentSettingsController', instDepartmentSettingsController);

    instDepartmentSettingsController.$inject = ['instDepartmentSettings', 'mailSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function instDepartmentSettingsController(instDepartmentSettings, mailSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {



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

        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;

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

            
          

            var departmentsArr = [];
            if ($scope.departments !== undefined) {
                for (var i = 0; i < $scope.departments.length; i++) {
                    if ($scope.departments[i].IsActive === 0 && $scope.departments[i].InsDepartmentID === null) {
                        console.log('Shibli');
                    } else {
                        departmentsArr.push($scope.departments[i]);
                    }
                }
                if (departmentsArr.length > 0) {
                    instDepartmentSettings.postInsDepartmentInformation({
                        InsDepartmentID: null,
                        DepartmentID: null,
                        InstituteID: vm.institute.selected.InstituteID,
                        IsActive: 1,
                        CreateBy: 0,
                        CreateOn: '2017-01-01',
                        CreatePc: null,
                        UpdateBy: null,
                        UpdateOn: '2017-01-01',
                        UpdatePc: null,
                        IsDeleted: 0,
                        DeleteBy: null,
                        DeleteOn: '2017-01-01',
                        DeletePc: null,
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



            if (vm.instituteID === undefined) {
                logger.error('Please select Institute');
            }
            else {
                var Params = {
                    insID: vm.institute.selected.InstituteID
                };

                //Generate Token API Pass Call
                authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

                instDepartmentSettings.getAllDepartmentById(Params)
                    .then(function (data) {
                        console.log(data);

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

                });
        }



    }
})();
