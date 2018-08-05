(function () {
    'use strict';

    angular
		.module('app.religionSettings')
		.controller('religionSettingsController', religionSettingsController);

        religionSettingsController.$inject = ['religionService','filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope','$state','Upload','$timeout','$http','$interval','uiGridConstants','$localStorage'];
    /* @ngInject */
    function religionSettingsController( religionService,filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants,$localStorage ) {



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
        $scope.clearField = function() {
            $state.go($state.current.name, {}, {reload: true});
        };


        vm.AddReligion = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line


            if(vm.ReligionSetup.ReligionName===undefined || vm.ReligionSetup.ReligionName==='' || vm.ReligionSetup.ReligionName===null){
                logger.error('Please fill Religion Name');
            }
            else{
            religionService.postReligionSettings({
                ReligionID :0,
                ReligionName:vm.ReligionSetup.ReligionName,
                IsActive    :1,
                CreateBy    :0,
                CreateOn    :null,
                CreatePc    :'Apple',
                UpdateBy    :null,
                UpdateOn    :null,
                UpdatePc    :'Apple',
                IsDeleted   :0,
                DeleteBy    :null,
                DeleteOn    :null,
                DeletePc    :'Apple'
            })
            .then(function(data){
                if(data[0].ReturnValue==='Duplicate'){
                    logger.error('Name Already Exist..!');
                }else{
                logger.info('Saved Successfully!');
                getReligion();
                $state.go($state.current.name, {}, {reload: true});
                }
            })
            .catch(function(error){});
            //console.log(vm.parents);
        }
        };

        vm.editReligion = function (religionID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            var params = {
                religionID : religionID
            };
            
            religionService.getReligionById(params)
            .then(function(data){
                vm.ReligionSetup.ReligionName = data[0].ReligionName;
                vm.ReligionSetup.ReligionID = data[0].ReligionID;
                //logger.info('Saved!');
                //$state.transitionTo('deliverypartner.listpartner');
            })
            .catch(function(error){});
            //console.log(vm.parents);
        };

        vm.UpdateReligion = function(){



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line



            religionService.postReligionSettings({
                ReligionID :vm.ReligionSetup.ReligionID,
                ReligionName:vm.ReligionSetup.ReligionName,
                IsActive    :1,
                CreateBy    :0,
                CreateOn    :null,
                CreatePc    :'Apple',
                UpdateBy    :null,
                UpdateOn    :null,
                UpdatePc    :'Apple',
                IsDeleted   :0,
                DeleteBy    :null,
                DeleteOn    :null,
                DeletePc    :'Apple'
            })
            .then(function(data){
                if(data[0].ReturnValue==='Duplicate'){
                    logger.error('Name Already Exist..!');
                }else{
                
                logger.info('Updated Successfully!');
                getReligion();
                //$state.transitionTo('deliverypartner.listpartner');
                }
            })
            .catch(function(error){});
            //console.log(vm.parents);
        };


        activate();

        function activate() {
            var promises = [getReligion()];
            return $q.all(promises).then(function() {
                // logger.info('Activated Order List View');
            });
        }
        function getReligion() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return religionService.getAllReligion()
            .then(function(data){
                vm.religions = data;
            });
        }

        
        vm.deleteReligion = function (ReligionID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)) //jshint ignore : line



            religionService.deleteReligion({
                ReligionID: ReligionID,
                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                    getReligion();
                })
                .catch(function (error) { });

        };

        

    }
})();
