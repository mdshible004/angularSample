(function () {
    'use strict';

    angular
        .module('app.mediumSettings')
        .controller('mediumSettingsController', mediumSettingsController);

    mediumSettingsController.$inject = ['mediumsetting', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants','$localStorage'];
    /* @ngInject */
    function mediumSettingsController(mediumsetting, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants,$localStorage) {



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

        //post medium Setting
        vm.postMedium = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            if(vm.mediumSetup.MameName===undefined || vm.mediumSetup.MameName==='' || vm.mediumSetupModal.MameName===null){
                logger.error('Please fill Medium Name');
            }
            else{
            mediumsetting.postmedium({
                MediumID: 0,
                MameName: vm.mediumSetup.MameName,
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
                        logger.error('Name Already exists....');
                    }
                    else {
                        logger.info('Saved Successfully');
                        getmedium();
                        $state.go($state.current.name, {}, {reload: true});
                      //  window.onload = setTimeout('location.reload(true);', 1500);
                    }
                    
                })
                .catch(function (error) { });
        }
    };

        //Edit medium Setting
        vm.editMedium = function (mediumID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var params = {
                mediumID: mediumID
            };

            mediumsetting.getMediumByID(params)
                .then(function (data) {
                    vm.mediumSetupModal.MameName = data[0].MameName;
                    vm.mediumSetupModal.MediumID = data[0].MediumID;
                })
                .catch(function (error) { });
        };

        //Update medium Setting
        vm.UpdateMedium = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line





            if(vm.mediumSetupModal.MameName===undefined || vm.mediumSetupModal.MameName==='' || vm.mediumSetupModal.MameName===null){
                logger.error('Please fill Medium Name');
            }
            else{
            mediumsetting.postmedium({
                MediumID: vm.mediumSetupModal.MediumID,
                MameName: vm.mediumSetupModal.MameName,
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
                        logger.error('Name Already exists....');
                    }
                    else {
                        logger.info('Updated Successfully');
                        getmedium();
                      //  window.onload = setTimeout('location.reload(true);', 1500);
                    }
                    
                })
                .catch(function (error) { });
        }
    };

        activate();

        function activate() {
            var promises = [getmedium()];
            return $q.all(promises).then(function () {
            });
        }
        function getmedium() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            return mediumsetting.getAllMediums()
                .then(function (data) {
                    vm.mediums = data;
                });
        }
        vm.deleteMedium = function (MediumID) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)) //jshint ignore : line


            mediumsetting.deleteMedium({
                MediumID: MediumID,
              
                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                     getmedium();
                })
                .catch(function (error) { });

        };

    }
})();
