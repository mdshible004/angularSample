(function () {
    'use strict';

    angular
		.module('app.insExameSetting')
		.controller('insExameSettingsController', insExameSettingsController);

    insExameSettingsController.$inject = ['subjectSettingsSevice', 'commonService', 'mailSettings', 'insExameSetting', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function insExameSettingsController(subjectSettingsSevice, commonService, mailSettings, insExameSetting, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage ) {




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


        // // Create and Show list Container Hide or Show Logic
         $scope.showExames = false;
        $scope.createItem = true;
    
       

        // Reset Button Logic
        $scope.clearField = function() {
             $state.go($state.current.name, {}, {reload: true});
        };

        // post mail Settings
        
        //$scope.exames;
        //$scope.exameindex;
        $scope.openExameIndex =  function (index) {
            $scope.exameindex = index;
            $scope.exames[$scope.exameindex].id = $scope.exameindex;
        };
        
        $scope.switch = function(e){
            if(e === 1){
                $scope.exames[$scope.exameindex].IsActive = 0;
            }else{
                $scope.exames[$scope.exameindex].IsActive = 1;
            }
            
           
        };
        $scope.changeValue = function () {
            $scope.exames = [];
            $scope.showExames = false;
        };
        
        // vm.mediumID =  $scope.mediums.MediumID
       
        vm.saveExame = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line




            var examesArr = [];
            if($scope.exames !== undefined){
                for(var i=0;i<$scope.exames.length;i++){
                    if($scope.exames[i].IsActive === 0 && $scope.exames[i].InsExamID  === null){
                           console.log('Shibli');
                    }else{
                        examesArr.push($scope.exames[i]);
                    }
                }
                insExameSetting.postinsexame({
                InsExamID :null, 
                // CustomName:,
                InstituteID: vm.institute.selected.InstituteID,
                MediumID: vm.MediumID,
                ClassID: vm.ClassID,
                ExamID     :null, 
                IsActive: 0,
                LoggedUserID: $localStorage.userInfo[0].UserID,
                examesArr   : examesArr
                })
                .then(function(data){
                    logger.info('Saved!');
                     $state.go($state.current.name, {}, {reload: true});
                })
                .catch(function(error){});
            }else{
                logger.error('No exam is found to save!!!');
            }
            
            
            //console.log(vm.parents);
        };
      $scope.showExames=false;
      vm.showexams = function () {


          //Generate Token API Pass Call
          authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



          if (vm.institute === undefined || vm.institute.selected === undefined) {
                logger.error('Please select institute');
            }
            else{
                var Params = {
                    InstituteID: vm.institute.selected.InstituteID,
                    MediumID: vm.MediumID,
                    ClassID: vm.ClassID
                };
          
                insExameSetting.getAllExamesDDL(Params)

                .then(function (data) {
                    $scope.exames = data;
                    $scope.a=data;
                    $scope.showExames=true;


            
                });
            }
      };

      $scope.DisBtn = function () {
          $scope.btnDis = true;
          $scope.showExames = false;
      };

        activate();

        function activate() {
            var promises = [getAllInstitute()];
            return $q.all(promises).then(function() {
                // logger.info('Activated Order List View');
            });
        }
        $scope.ReloadDll = function () {
            vm.MediumID = null;
            vm.medium = undefined;
            vm.mediums = [];
            vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
            $scope.showExames = false;
            // $scope.addRoutin = false;
        };
        $scope.ReloadMedium = function () {
            vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
            $scope.showExames = false;
        };

        $scope.ReloadClass = function () {
            $scope.showExames = false;
        };
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        function getAllInstitute() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            return mailSettings.getAllInstitutes()
                .then(function (data) {
                    vm.institutes = data;
                    vm.instituteID = vm.InstituteID;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.InstituteID); })[0] };
                    vm.getmediumNameDdl(vm.institute.selected.InstituteID, '');
                });

        }

        vm.getmediumNameDdl = function (InstituteID, status) {
            if (status === '') {
                $scope.ReloadMedium();
            }

            var Params = {
                instituteId: InstituteID
            };
            return commonService.getInstituteMediumDdl(Params)
                .then(function (data) {
                    vm.mediums = data;

                    if (status === 'Edit') {
                        vm.medium = {
                            selected: vm.mediums.filter(function (ob, i) {
                                return (ob.MediumID === vm.MediumID);
                            })[0]
                        };
                    }
                });

        };

        vm.MediumWiseClassDDL = function (MediumID, status) {
            if (status === '') {
                $scope.ReloadClass();
            }

            if (vm.MediumID !== null) {
                var Params = {
                    InstituteID: vm.institute.selected.InstituteID,
                    MediumID: MediumID
                };
                return subjectSettingsSevice.getMediumWiseClassDDL(Params)
                    .then(function (data) {
                        vm.classes = data;

                        if (status === 'Edit') {
                            vm.class = {
                                selected: vm.classes.filter(function (ob, i) {
                                    return (ob.ClassID === vm.ClassID);
                                })[0]
                            };
                        }

                    });
            }
            else {
                logger.error('Select Medium first');
            }
        };
        
    }
})();
