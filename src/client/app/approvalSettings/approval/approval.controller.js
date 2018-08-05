(function() {
    'use strict';

    angular
        .module('app.approvalSettings')
        .controller('ApprovalSettingsController', ApprovalSettingsController);

    ApprovalSettingsController.$inject = ['approvalService', 'menuSettings', 'instituteSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$localStorage', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants'];
    /* @ngInject */
    function ApprovalSettingsController(approvalService, menuSettings, instituteSettings, filterurl, $q, authservice, logger, $scope, $localStorage, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants) {

        /****************Declaration + Initiazation*********/
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



        $scope.EducationData = [];



        activate();

        function activate() {
            var promises = [getAllMenu(), getAllInstitute(), getStatus(), getLoginUser()];
            return $q.all(promises).then(function() {});
        }


        /***********************Loand Section**************/
        function getAllMenu() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            return menuSettings.getParentMenu()
                .then(function(data) {
                    vm.MenuList = data;
                });

        }


        function getStatus() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            return menuSettings.getStatus()
                .then(function(data1) {
                    vm.StatusList = data1;
                });

        }



        function getLoginUser() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            return menuSettings.getLoginUser()
                .then(function(data2) {
                    vm.loginUserList = data2;
                });

        }




        function getAllInstitute() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            return instituteSettings.getAllInsInstitute()
                .then(function(data) {
                    vm.institutes = data;
                    if (vm.InstituteID !== 1) {
                        vm.instituteID = vm.InstituteID;
                        vm.institute = {
                            selected: vm.institutes.filter(function(ob, i) {
                                return (ob.InstituteID === vm.InstituteID);
                            })[0]
                        };
                        vm.instituteSelected(vm.InstituteID);
                    }
                });
        }

        vm.instituteSelected = function(InstituteID, InstituteName) {


        };


        vm.clearField = function () {


            vm.MenuID = null;
            if (vm.Menu !== undefined) {
                vm.Menu.selected = undefined;
            }
            vm.instituteID = null;
            if (vm.institute !== undefined) {
                vm.institute.selected = undefined;
            }


            vm.IsActiveChkBox = 0;
            vm.IsApprovalDetailChkBox = 0;
            vm.IsDepartment = 0;

            vm.ClearDetail();

        };


        vm.ClearDetail = function () {

            vm.StatusID = null;
            if (vm.status !== undefined) {
                vm.status.selected = undefined;
            }
            vm.LoginID = null;
            if (vm.loginUser !== undefined) {
                vm.loginUser.selected = undefined;
            }
            vm.Sequence = null;
            $scope.EducationData = [];

        };



        vm.addRecord = function() {

           if (vm.status === undefined) {
                logger.warning('Select Status !!');
                return;
            }
            if (vm.loginUser === undefined) {
                logger.warning('Select User !!');
                return;
            }
             if ( vm.Sequence === undefined || vm.Sequence ===null) {
                logger.warning('Enter Sequence !!');
                return;
            }
             menuSettings.getStatus()
                .then(function(data1) {
                    vm.StatusList = data1;
                });
          
             var newrowEducation = [];
            
            if ($scope.EducationData.length === 0) {
                newrowEducation = [{

                    'status': vm.status.selected.Status,
                    'statusID': vm.StatusID,
                    'loginUser': vm.loginUser.selected.UserFullName,
                    'loginUserID': vm.LoginID,//userTypeID
                    'sequence': vm.Sequence,
                    'statusSelected': { status:  vm.status.selected.status, statusID: vm.StatusID },
                    'userSelected': { UserFullName:  vm.loginUser.selected.UserFullName, LoginID: vm.LoginID }

                }];
            } else {               
                $scope.EducationData[0].forEach(function(row) {
                    newrowEducation.push({

                    'status': vm.status.selected.Status,
                    'statusID': vm.StatusID,
                    'loginUser': vm.loginUser.selected.UserFullName,
                    'loginUserID': vm.LoginID,//userTypeID
                    'sequence': vm.Sequence,
                    'statusSelected': { status:  vm.status.selected.status, statusID: vm.StatusID },
                    'userSelected': { UserFullName:  vm.loginUser.selected.UserFullName, LoginID: vm.LoginID }

                    });
                });
             }


            if ($scope.EducationData.length !== 0) {
                for (var i = 0; i < $scope.EducationData.length; i++) {
                    if (
                        $scope.EducationData[i][0].status === newrowEducation[0].status &&
                        $scope.EducationData[i][0].statusID === newrowEducation[0].statusID &&
                        $scope.EducationData[i][0].loginUser === newrowEducation[0].loginUser &&
                        $scope.EducationData[i][0].sequence === newrowEducation[0].sequence 
                    ){
                        logger.warning('Sorry Duplicate Value !!');
                        return;
                    }
                }
            }


            $scope.EducationData.push(newrowEducation);
        };




        // remove the selected row
        $scope.EducationRemoveRow = function(index) {
            if ($scope.EducationData[index][0].UserEducationRecordID > 0) {
                $scope.EducationData[index][0].IsDeleted = true;
                $scope.removeEducationTrIndex = index;
            } else {
                // remove the row specified in index
                $scope.EducationData.splice(index, 1);
                // if no rows left in the array create a blank array
                if ($scope.EducationData.length === 0) {
                    $scope.EducationData = [];
                }
            }
        };



          vm.SavePermission = function () {

            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line

          
            if ($scope.EducationData.length === 0) {
                logger.warning('Add a Record !');
                return;
            }

            menuSettings.savePremissionRecord({
                MenuID: vm.MenuID,
                InstituteID: vm.instituteID,
                IsActive: vm.IsActiveChkBox ,               
                PerRecordArr: $scope.EducationData
            }).
                then(function (data) {
                    logger.info('Saved!');                   
                })
                .catch(function (error) { });

        };



    }
})();
