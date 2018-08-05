(function () {
    'use strict';

    angular
        .module('app.modulePermissionSettings')
        .controller('ModulePermissionSettingsController', ModulePermissionSettingsController);

    ModulePermissionSettingsController.$inject = ['menuSettings', 'userService', 'instituteSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$localStorage', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants'];
    /* @ngInject */
    function ModulePermissionSettingsController(menuSettings, userService, instituteSettings, filterurl, $q, authservice, logger, $scope, $localStorage, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants) {


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


        $scope.value = null;
        $scope.showItem = false;
        $scope.createItem = true;


        activate();

        function activate() {
            var promises = [getAllModule(), getAllMenu(), getAllInstitute()];
            return $q.all(promises).then(function () { });
        }

 
        /******************HTML Mechanism***************************/

        $scope.itemEvent = function () {
            getAllModulePermission();
            $scope.createItem = true;
        };

        $scope.listEvent = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.showItem = false;
            $scope.createItem = true;
        };


        $scope.checkIsEnable = function (index) {
            $scope.value[index].id = index;
        };



        $scope.clearField = function () {

            $state.go($state.current.name, {}, {
                reload: true
            });
        };



        /******************Load Section*************/
        function getAllModule() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            var moduleParams = {
                moduleID: 0
            };
            return menuSettings.getModule(moduleParams)
                .then(function (data) {
                    vm.modules = data;
                });
        }

        function getAllModulePermission() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            if (vm.instituteID === undefined) {
                logger.error('Select Institute !');
                return;
            }

            //if (vm.UserTypeID === undefined) {
            //    logger.error('Select User Type First !');
            //    return;
            //}
            var params = {
                InstituteID: vm.instituteID,
                // UserTypeID: vm.UserTypeID

            };

            return menuSettings.getModulePermission(params)
                .then(function (data) {
                    vm.modulesperm = data;
                    $scope.value = data;
                    $scope.showItem = true;
                });
        }

        //function getUserType() {
        //    var params = {
        //        instituteId: $localStorage.userInfo[0].InstituteID
        //    };

        //    return userService.getUserType(params)
        //        .then(function (data) {
        //            vm.UserType = data;
        //        });
        //}


        function getAllMenu() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return menuSettings.getParentMenu()
                .then(function (data) {
                    vm.MenuList = data;
                });
        }

        function getAllInstitute() {

            console.log(vm.menuId);
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            return instituteSettings.getAllInsInstitute()
                .then(function (data) {
                    vm.institutes = data;
                    if (vm.InstituteID !== 1) {
                        vm.instituteID = vm.InstituteID;
                        vm.institute = {
                            selected: vm.institutes.filter(function (ob, i) {
                                return (ob.InstituteID === vm.InstituteID);
                            })[0]
                        };
                        vm.instituteSelected(vm.InstituteID);
                    }
                });
        }


        vm.instituteSelected = function (InstituteID) {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            if (InstituteID === undefined) {
                $scope.showItem = false;
                logger.warning('Select Institute Now !');
                return;
            }
            //if (vm.UserTypeID === undefined) {
            //    $scope.showItem = false;
            //    logger.warning('Select User Type Now !');
            //    return;
            //}
            var params = {
                InstituteID: InstituteID,
                UserTypeID: vm.UserTypeID

            };
            return menuSettings.getModulePermission(params)
                .then(function (data) {
                    vm.modulesperm = data;
                    $scope.value = data;
                    $scope.showItem = true;
                });

        };


        //vm.UserTypeSelected = function (UserTypeID) {

        //    if (vm.instituteID === undefined) {
        //        $scope.showItem = false;
        //        logger.warning('Select Institute Now !');
        //        return;
        //    }
        //    if (UserTypeID === undefined) {
        //        $scope.showItem = false;
        //        logger.warning('Select User Type Now !');
        //        return;
        //    }
        //    var params = {
        //        InstituteID: vm.instituteID,
        //        UserTypeID: UserTypeID

        //    };
        //    return menuSettings.getModulePermission(params)
        //        .then(function (data) {
        //            vm.modulesperm = data;
        //            $scope.value = data;
        //            $scope.showItem = true;
        //        });

        //};




        /****************CRUD**********************/
        vm.updateModulePer = function () {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line

            var modulePerArr = [];

            for (var i = 0; i < $scope.value.length; i++) {

                if ($scope.value[i].id !== undefined) {
                    modulePerArr.push($scope.value[i]);
                }
            }

            //if (vm.UserTypeID === undefined || vm.UserTypeID === null) {
            //    logger.error('Select User Type First !');
            //    return;
            //}

            if (modulePerArr.length === 0) {
                logger.warning('Perform an operation !');
                return;
            }

            menuSettings.updateModulePermission({

                InstituteID: vm.instituteID,
                modulePerArr: modulePerArr
            }).
                then(function (data) {
                    logger.info('Saved!');
                    $scope.showItem = false;
                    getAllModulePermission();

                    $state.go($state.current.name, {}, {
                        reload: true
                    });
                })
                .catch(function (error) { });

        };

    }
})();
