(function () {
    'use strict';

    angular
        .module('app.ExperienceListSettings')
        .controller('experienceListController', experienceListController);

    experienceListController.$inject = ['experienceListSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function experienceListController(experienceListSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

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
            $state.go($state.current.name, {}, { reload: true });
        };

        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        //post medium Setting
        vm.experienceList = function () {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            if (vm.experienceListSetup.ExperienceName === undefined || vm.experienceListSetup.ExperienceName === null || vm.experienceListSetup.ExperienceName === '') {
                logger.error('Please fill Experience Name');
            }
            else {
                experienceListSettings.postexperienceList({
                    ExperienceID: 0,
                    ExperienceName: vm.experienceListSetup.ExperienceName,
                    CreateBy: 0,
                    CreateOn: '10-10-2017',
                    CreatePc: 'Bond',
                    UpdateBy: 0,
                    UpdateOn: '10-10-2017',
                    UpdatePc: 'Bond',
                    IsDeleted: 0,
                    DeleteBy: 0,
                    DeleteOn: '10-10-2017',
                    DeletePc: 'Bond'
                })
                    .then(function (data) {
                        if (data[0].ReturnValue === 'Duplicate') {
                            logger.error('Name Already Exist..!');
                        } else {

                            logger.info('Saved Successfully!');
                            getExperienceList();
                            $state.go($state.current.name, {}, { reload: true });
                            //$state.transitionTo('deliverypartner.listpartner');
                        }
                    })
                    .catch(function (error) { });
                //console.log(vm.parents);
            }
        };

        vm.editexperienceList = function (experiencelistID) {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var params = {
                experiencelistID: experiencelistID
            };

            experienceListSettings.getExperienceListByID(params)
                .then(function (data) {
                    vm.experienceListSetup.ExperienceName = data[0].ExperienceName;
                    vm.experienceListSetup.ExperienceID = data[0].ExperienceID;
                    // logger.info('Saved!');
                    //$state.transitionTo('deliverypartner.listpartner');
                })
                .catch(function (error) { });
            //console.log(vm.parents);
        };

        vm.UpdateExperienceList = function () {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            if (vm.experienceListSetup.ExperienceName === undefined || vm.experienceListSetup.ExperienceName === null || vm.experienceListSetup.ExperienceName === '') {
                logger.error('Please fill Experience Name');
            }
            else {
                experienceListSettings.postexperienceList({
                    ExperienceID: vm.experienceListSetup.ExperienceID,
                    ExperienceName: vm.experienceListSetup.ExperienceName,
                    CreateBy: 0,
                    CreateOn: '10-10-2017',
                    CreatePc: 'Bond',
                    UpdateBy: 0,
                    UpdateOn: '10-10-2017',
                    UpdatePc: 'Bond',
                    IsDeleted: 0,
                    DeleteBy: 0,
                    DeleteOn: '10-10-2017',
                    DeletePc: 'Bond'
                })
                    .then(function (data) {
                        if (data[0].ReturnValue === 'Duplicate') {
                            logger.error('Name Already Exist..!');
                        } else {

                            logger.info('Updated Successfully!');
                            getExperienceList();
                            //$state.transitionTo('deliverypartner.listpartner');
                        }
                    })
                    .catch(function (error) { });
                //console.log(vm.parents);
            }
        };


        activate();

        function activate() {
            var promises = [getExperienceList()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }
        function getExperienceList() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            return experienceListSettings.getAllExperienceList()
                .then(function (data) {
                    vm.ExperienceList = data;
                });
        }
        vm.deleteExperience = function (ExperienceID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)); //jshint ignore : line



            experienceListSettings.deleteExperience({
                ExperienceID: ExperienceID,
                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                    getExperienceList();
                })
                .catch(function (error) { });

        };




    }
})();
