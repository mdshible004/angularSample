(function () {
    'use strict';

    angular
        .module('app.menuPermissionSettings')
        .controller('MenuPermissionSettingsController', MenuPermissionSettingsController);

    MenuPermissionSettingsController.$inject = ['menuSettings', 'userService', 'instituteSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$localStorage', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants'];
    /* @ngInject */
    function MenuPermissionSettingsController(menuSettings, userService, instituteSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $localStorage, $state, Upload, $timeout, $http, $interval, uiGridConstants) {

        /*********declaration+ initaialization ********/

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
        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;

        activate();

        function activate() {
            var promises = [getAllModule(), getUserType()];//, getAllInstitute()
            return $q.all(promises).then(function () { });
        }

        /*************HTML mechanism**********/


        $scope.itemEvent = function () {

            //if (vm.instituteID === undefined || vm.instituteID === null) {
            //    $scope.showItem = false;
            //    logger.warning('Select Institute Now !');
            //    return;
            //}


            if (vm.moduleID === undefined) {
                $scope.showItem = false;
                logger.warning('Select Module Now !');
                return;
            }

            getAllMenuPermission();
            $scope.showItem = true;
            $scope.createItem = true;

        };
        $scope.listEvent = function () {
            $scope.showItem = true;
            $scope.createItem = true;

        };

        $scope.clearField = function () {
            $state.go($state.current.name, {}, {
                reload: true
            });
        };


        $scope.checkEnableView = function (index) {
            $scope.value[index].id = index;
        };


        $scope.checkEnableInsert = function (index) {
            $scope.value[index].id = index;
        };


        $scope.checkEnableUpdate = function (index) {
            $scope.value[index].id = index;
        };


        $scope.checkEnableDelete = function (index) {
            $scope.value[index].id = index;
        };







        $scope.checkAllView = function (Status) {

            for (var i = 0; i < vm.MenuListPermission.length; i++) {
                vm.MenuListPermission[i].EnableView = Status;
                $scope.value[i].id = 0;//used as a Flag
            }

        };

        $scope.checkAllInsert = function (Status) {

            for (var i = 0; i < vm.MenuListPermission.length; i++) {
                vm.MenuListPermission[i].EnableInsert = Status;
                $scope.value[i].id = 0;//used as a Flag
            }

        };

        $scope.checkAllUpdate = function (Status) {

            for (var i = 0; i < vm.MenuListPermission.length; i++) {
                vm.MenuListPermission[i].EnableUpdate = Status;
                $scope.value[i].id = 0;//used as a Flag
            }

        };

        $scope.checkAllDelete = function (Status) {

            for (var i = 0; i < vm.MenuListPermission.length; i++) {
                vm.MenuListPermission[i].EnableDelete = Status;
                $scope.value[i].id = 0;//used as a Flag
            }

        };





        /*** *********************Load Section********************/



        function getAllMenuPermission() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line




            if (vm.moduleID === undefined) {
                vm.moduleID = null;
            }
            vm.UserTypeID = null;

            var params = {
                InstituteID: null,
                ModuleID: vm.moduleID,
                UserTypeID: (vm.UserTypeID === null || vm.UserTypeID === undefined) ? null : vm.UserTypeID

            };

            return menuSettings.getMenuPermission(params)
                .then(function (data) {
                    vm.MenuListPermission = data;
                    $scope.value = data;
                });
        }

        function getUserType() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line




            var params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };

            return userService.getUserType(params)
                .then(function (data) {
                    vm.UserType = data;
                });
        }




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

        vm.ModuleSelected = function (ModuleID) {

            if (vm.userType !== undefined) {
                vm.userType.selected = undefined;
            }
            vm.UserTypeID = null;

        };


        vm.UserTypeSelected = function (UserTypeID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line




            $scope.itemEvent();
            //if (vm.instituteID === undefined || vm.instituteID === null) {
            //    $scope.showItem = false;
            //    logger.warning('Select Institute Now !');
            //    return;
            //}
            if (vm.moduleID === undefined || vm.moduleID === null) {
                $scope.showItem = false;
                logger.warning('Select Module Now !');
                return;
            }
            if (UserTypeID === undefined) {
                $scope.showItem = false;
                UserTypeID = null;
                return;
            }

            var params = {
                InstituteID: null,//vm.instituteID,
                ModuleID: vm.moduleID,
                UserTypeID: UserTypeID
            };
            return menuSettings.getMenuPermission(params)
                .then(function (data) {
                    vm.MenuListPermission = data;
                    $scope.value = data;
                });
        };


        /************************CRUD Section**************/
        vm.AddMenuSetting = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line




            if ($scope.value === null) {
                logger.error('Select Menue First !');
                return;
            }

            var menuPerArr = [];

            for (var i = 0; i < $scope.value.length; i++) {

                if ($scope.value[i].id !== undefined) {
                    menuPerArr.push($scope.value[i]);
                }
            }


            if (vm.userType.selected.UserTypeID === undefined || vm.userType.selected.UserTypeID === null) {
                logger.error('Select User Type First !');
                return;
            }

            if (menuPerArr.length === 0) {
                logger.warning('Perform an operation !');
                return;
            }

            menuSettings.setMenuPermission({

                MenuPermissionID: 0,
                EffectiveDate: '2017-01-01',
                InstituteID: null,
                CreateBy: 0,
                CreateOn: '2017-01-01',
                CreatePc: null,
                UpdateBy: null,
                UpdateOn: '2017-01-01',
                UpdatePc: null,
                IsDeleted: 0,
                DeleteBy: null,
                DeleteOn: '2017-01-01',
                DeletePc: null,

                UserTypeID: vm.userType.selected.UserTypeID,
                menuPerArr: menuPerArr
            }).
                then(function (data) {
                    logger.info('Saved!');
                    $scope.showItem = false;
                    //wait(1000);
                    $state.go($state.current.name, {}, {
                        reload: true
                    });
                    getAllMenuPermission();
                })
                .catch(function (error) { });

        };



        function wait(ms) {
            var start = new Date().getTime();
            var end = start;
            while (end < start + ms) {
                end = new Date().getTime();
            }
        }

    }
})();
