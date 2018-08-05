(function () {
    'use strict';

    angular
		.module('app.relationSettings')
		.controller('relationSettingsController', relationSettingsController);

        relationSettingsController.$inject = ['relationSettings','filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope','$state','Upload','$timeout','$http','$interval','uiGridConstants','$localStorage'];
    /* @ngInject */
    function relationSettingsController( relationSettings,filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants,$localStorage ) {



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

        //post medium Setting
        vm.relationSettings = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line



            if(vm.relationSetup.RelationName===undefined || vm.relationSetup.RelationName==='' || vm.relationSetup.RelationName===null) {
                logger.error('Please fill Relation Name');
            }
            else{
            relationSettings.postrelation({
                RelationID    :0,
                RelationName    :vm.relationSetup.RelationName,
                IsActive    :0,
                CreateBy    :0,
                CreateOn    :'10-10-2017',
                CreatePc    :'Bond',
                UpdateBy    :0,
                UpdateOn    :'10-10-2017',
                UpdatePc    :'Bond',
                IsDeleted   :0,
                DeleteBy    :0,
                DeleteOn    :'10-10-2017',
                DeletePc    :'Bond'
            })
            .then(function(data){
                if(data[0].ReturnValue==='Duplicate'){
                    logger.error('Name Already Exist..!');
                }else{
                logger.info('Saved Successfully!');
                getrelation();
                $state.go($state.current.name, {}, {reload: true});
                //$state.transitionTo('deliverypartner.listpartner');
                }
            })
            .catch(function(error){});
            //console.log(vm.parents);
        }
        };
        
        vm.editRelation = function (relationID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            var params = {
                relationID : relationID
            };
            
            relationSettings.getRelationByID(params)
            .then(function(data){
                vm.relationSetup.RelationName = data[0].RelationName;
                vm.relationSetup.RelationID = data[0].RelationID;
                // logger.info('Saved!');
                //$state.transitionTo('deliverypartner.listpartner');
            })
            .catch(function(error){});
            //console.log(vm.parents);
        };

        vm.UpdateRelation = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line



            if(vm.relationSetup.RelationName===undefined || vm.relationSetup.RelationName==='' || vm.relationSetup.RelationName===null) {
                logger.error('Please fill Relation Name');
            }
            else {
            relationSettings.postrelation({
                RelationID    :vm.relationSetup.RelationID,
                RelationName  :vm.relationSetup.RelationName,
                IsActive    :0,
                CreateBy    :0,
                CreateOn    :'10-10-2017',
                CreatePc    :'Bond',
                UpdateBy    :0,
                UpdateOn    :'10-10-2017',
                UpdatePc    :'Bond',
                IsDeleted   :0,
                DeleteBy    :0,
                DeleteOn    :'10-10-2017',
                DeletePc    :'Bond'
            })
            .then(function(data){
                if(data[0].ReturnValue==='Duplicate'){
                    logger.error('Name Already Exist..!');
                }else{
                logger.info('Updated Successfully!');
                 $('#myModal').modal('show');//jshint ignore :line
                getrelation();
               
                //$state.transitionTo('deliverypartner.listpartner');
                }
            })
            .catch(function(error){});
            //console.log(vm.parents);
        }
        };
        

        activate();

        function activate() {
            var promises = [getrelation()];
            return $q.all(promises).then(function() {
                // logger.info('Activated Order List View');
            });
        }
        function getrelation() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return relationSettings.getAllRelations()
            .then(function(data){
                vm.relations = data;
            });
        }
        vm.deleteRelation = function (RelationID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            relationSettings.deleteRelation({
                RelationID: RelationID,

                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                    getrelation();
                })
                .catch(function (error) { });

        };

       

    }
})();
