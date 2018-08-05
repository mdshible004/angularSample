
(function () {
    'use strict';

    angular
        .module('app.gradeSettings')
        .controller('GradeSettingsController', GradeSettingsController);

    GradeSettingsController.$inject = ['gradeSettingsSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants','$localStorage'];
    /* @ngInject */
    function GradeSettingsController(gradeSettingsSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants,$localStorage) {



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
            $state.go($state.current.name, {}, {reload: true});
        };

        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, {reload: true});
        };

        //Post Class 
        vm.AddGrade = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            if (vm.gradeSetup.GradeName === undefined || vm.gradeSetup.GradeName === '' || vm.gradeSetupModal.GradeName === null) {
                logger.error('Please fill Grade Name');
            }
            else {
                gradeSettingsSevice.setCmnGrade({
                    GradeID: 0,
                    GradeName: vm.gradeSetup.GradeName,
                    IsActive: null,
                    CreateBy: null,
                    CreateOn: '10-10-2017',
                    CreatePc: null,
                    UpdateBy: null,
                    UpdateOn: '10-10-2017',
                    UpdatePc: null,
                    IsDeleted: 0,
                    DeleteBy: null,
                    DeleteOn: '10-10-2017',
                    DeletePc: null
                })
                    .then(function (data) {
                        if (data[0].ReturnValue === 'Duplicate') {
                            logger.error('Grade Name Already exists....');
                        }
                        else {
                            logger.info('Saved Successfully');
                            getAllCmnGrade();
                            $state.go($state.current.name, {}, {reload: true});
                          //  window.onload = setTimeout('location.reload(true);', 1500);
                        }
                    })
                    .catch(function (error) { });
            }
        };

        vm.editGrade = function (GradeID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var gradeParams = {
                GradeID: GradeID
            };
            gradeSettingsSevice.getGradeById(gradeParams)

                .then(function (data) {

                    vm.gradeSetupModal.GradeName = data[0].GradeName;
                    vm.gradeSetupModal.GradeID = data[0].GradeID;

                });
        };

        //Patch Section Settings
        vm.patchGrade = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            if (vm.gradeSetupModal.GradeName === undefined || vm.gradeSetupModal.GradeName === '' || vm.gradeSetupModal.GradeName === null) {
                logger.error('Please fill Grade Name');
            }
            else {
                gradeSettingsSevice.setCmnGrade({

                    GradeID: vm.gradeSetupModal.GradeID,
                    GradeName: vm.gradeSetupModal.GradeName,
                    IsActive: null,
                    CreateBy: null,
                    CreateOn: '10-10-2017',
                    CreatePc: null,
                    UpdateBy: null,
                    UpdateOn: '10-10-2017',
                    UpdatePc: null,
                    IsDeleted: 0,
                    DeleteBy: null,
                    DeleteOn: '10-10-2017',
                    DeletePc: null

                })
                    .then(function (data) {
                        if (data[0].ReturnValue === 'Duplicate') {
                            logger.error(' Grade Name Already exists....');
                        }
                        else {
                            logger.info('Updated Successfully');
                            getAllCmnGrade();
                           // window.onload = setTimeout('location.reload(true);', 1500);
                        }
                    })
                    .catch(function (error) { });
            }
        };

        activate();

        function activate() {
            var promises = [getAllCmnGrade()];
            return $q.all(promises).then(function () {
            });
        }

        function getAllCmnGrade() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return gradeSettingsSevice.getCmnGrade()
                .then(function (data) {
                    vm.grades = data;
                });
        }
        vm.deleteGrade = function (GradeID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)) //jshint ignore : line


            gradeSettingsSevice.deleteGrade({
                GradeID: GradeID,
                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                    getAllCmnGrade();
                })
                .catch(function (error) { });

        };

    }
})();

