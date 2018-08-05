
(function () {
    'use strict';

    angular
        .module('app.sectionSettings')
        .controller('SectionSettingsController', SectionSettingsController);

    SectionSettingsController.$inject = ['sectionSettingsSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants','$localStorage'];
    /* @ngInject */
    function SectionSettingsController(sectionSettingsSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants,$localStorage) {




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
           $state.go($state.current.name, {}, {reload: true});
            $scope.showItem = false;
            $scope.createItem = true;
        };

        // Reset Button Logic
        $scope.clearField = function () {
            vm.sectionSetup.SectionNo = null;
            vm.sectionSetup.SectionName=null;
        };

        //Post Class 
        vm.AddSection = function () {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line



            if (vm.sectionSetup.SectionName === undefined || vm.sectionSetup.SectionName === '') {
                logger.error('Please fill SectionName');
            }
            else {
                sectionSettingsSevice.setCmnSection({
                    SectionID: 0,
                    SectionNo: vm.sectionSetup.SectionNo===undefined?vm.sectionSetup.SectionName:vm.sectionSetup.SectionNo,
                    SectionName: vm.sectionSetup.SectionName,
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
                            logger.error('Section Name Already exists....');
                        }
                        else {
                            logger.info('Saved Successfully');
                            getAllCmnSection();
                             $state.go($state.current.name, {}, {reload: true});
                            //window.onload = setTimeout('location.reload(true);', 1500);
                        }
                    })
                    .catch(function (error) { });
            }
        };

        vm.editSection = function (SectionID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            var sectionParams = {
                SectionID: SectionID
            };
            sectionSettingsSevice.getSectionById(sectionParams)

                .then(function (data) {

                    vm.sectionSetupModal.sectionID = data[0].SectionID;
                    vm.sectionSetupModal.SectionName = data[0].SectionName;
                    vm.sectionSetupModal.SectionNo = data[0].SectionNo;

                });
        };

        //Patch Section Settings
        vm.patchSection = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line



            if (vm.sectionSetupModal.SectionName === undefined || vm.sectionSetupModal.SectionName === '') {
                logger.error('Please fill SectionName ');
            }
            else {
                sectionSettingsSevice.setCmnSection({

                    SectionID: vm.sectionSetupModal.sectionID,
                    SectionNo: vm.sectionSetupModal.SectionNo===''?vm.sectionSetupModal.SectionName:vm.sectionSetupModal.SectionNo,
                    SectionName: vm.sectionSetupModal.SectionName,
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
                            logger.error('Section Name Already exists....');
                        }
                        else {
                            logger.info('Update Successfully');
                            getAllCmnSection();
                             $state.go($state.current.name, {}, {reload: true});
                            //window.onload = setTimeout('location.reload(true);', 1500);
                        }
                    })
                    .catch(function (error) { });
            }
        };

        activate();

        function activate() {
            var promises = [getAllCmnSection()];
            return $q.all(promises).then(function () {
            });
        }


        function getAllCmnSection() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return sectionSettingsSevice.getCmnSection()
                .then(function (data) {
                    vm.sections = data;
                });
        }

        vm.deleteSection = function (SectionID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            sectionSettingsSevice.deleteSection({
                SectionID: SectionID,
                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                    getAllCmnSection();
                })
                .catch(function (error) { });

        };

    }
})();

