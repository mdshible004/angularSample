(function () {
    'use strict';

    angular
		.module('app.classSettings')
		.controller('ClassSettingsController', ClassSettingsController);

	ClassSettingsController.$inject = ['classSettings','filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope','$state','Upload','$timeout','$http','$interval','uiGridConstants','$localStorage'];
    /* @ngInject */
    function ClassSettingsController(classSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants,$localStorage ) {

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
        $scope.clearField = function() {
            $scope.vm.itemEntry = null;
        };

        //Post Class 
        vm.AddClassSetting = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            classSettings.postClassInformation({
                ClassID:0,
                InsCategoryID:vm.institute.selected.InstituteCategoryID,
                ClassName:vm.classSetup.className,
                StatusID:null,
                IsDeleted:0
            })
            .then(function(data){
                logger.info('Saved!');
                //$state.transitionTo('deliverypartner.listpartner');
            })
            .catch(function(error){});
            //console.log(vm.parents);
        };
       
        vm.getClassByID = function (classID) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var classParams = {
                classID: classID
            };
            classSettings.getClassByID(classParams)

            .then(function (data) {
                vm.classSetup.className = data[0].ClassName;
                vm.classSetup.classID = data[0].ClassID;
                vm.institute = {
                    selected: vm.institutes.filter(function(ob,i){
                        return (ob.InstituteCategoryName === data[0].InstituteCategoryName);
                    })[0]
                };
            });
        };

        vm.patchClass = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            classSettings.postClassInformation({
                ClassID:vm.classSetup.classID,
                InsCategoryID:vm.institute.selected.InstituteCategoryID,
                ClassName:vm.classSetup.className,
                StatusID:null,
                IsDeleted:0
            })
            .then(function(data){
                logger.info('Upadate Successfully!');
                //$state.transitionTo('deliverypartner.listpartner');
            })
            .catch(function(error){});
            //console.log(vm.parents);
        };
        activate();

        function activate() {
            var promises = [getAllInstitute(),getClasses()];
            return $q.all(promises).then(function() {
                // logger.info('Activated Order List View');
            });
        }

        function getAllInstitute() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return classSettings.getInstituteCatagory()
            .then(function(data){
                vm.institutes = data;
            });
        }
        function getClasses() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return classSettings.getAllClasses()
            .then(function(data){
                vm.classes = data;
            });
        }

    }
})();
