(function () {
    'use strict';

    angular
        .module('app.menuSettings')
        .controller('MenuSettingsController', MenuSettingsController);

    MenuSettingsController.$inject = ['menuSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$localStorage', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants'];
    /* @ngInject */
    function MenuSettingsController(menuSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $localStorage, $state, Upload, $timeout, $http, $interval, uiGridConstants) {



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



        $scope.showItem = false;
        $scope.createItem = true;
        $scope.itemEvent = function () {
            $scope.showItem = true;
            $scope.createItem = false;

        };
        $scope.listEvent = function () {
            $scope.showItem = false;
            $scope.createItem = true;
        };

        $scope.clearField = function () {
            $state.go($state.current.name, {}, {
                reload: true
            });
        };

        $scope.gridOptions = {
            enableFiltering: true,
            flatEntityAccess: true,
            showGridFooter: true,
            fastWatch: true
        };

        $scope.gridOptions.columnDefs = [{
            name: 'id'
        }, {
            name: 'name'
        }, {
            name: 'gender'
        }, {
            field: 'age'
        }];

        $http.get('/data/10000_complex.json')
            .success(function (data) {
                for (var i = 0; i < 6; i++) {
                    data = data.concat(data);
                }
                $scope.gridOptions.data = data;
            });

        $scope.toggleFlat = function () {
            $scope.gridOptions.flatEntityAccess = !$scope.gridOptions.flatEntityAccess;
        };

        vm.AddMenuSetting = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            if (vm.module === undefined || vm.menutype === undefined) {
                logger.error('Please Select One');
            } else {

                if (vm.MenuID === null || vm.MenuID === undefined) {
                    vm.MenuID = 0;
                }
                menuSettings.postMenuSettings({
                    MenuID: vm.MenuID,
                    MenuCode: '',
                    MenuName: (vm.menuSetup.MenuName === null) ? '' : vm.menuSetup.MenuName,
                    MenuShortName: (vm.menuSetup.MenuShortName === undefined) ? '' : vm.menuSetup.MenuShortName,
                    ModuleID: (vm.module.selected.ModuleID === null) ? '' : vm.module.selected.ModuleID,
                    MenuPath: (vm.menuSetup.MenuPath === undefined) ? '' : vm.menuSetup.MenuPath,
                    ReportName: (vm.menuSetup.ReportName === undefined) ? '' : vm.menuSetup.ReportName,
                    ReportPath: (vm.menuSetup.ReportPath === undefined) ? '' : vm.menuSetup.ReportPath,
                    ParentID: (vm.parentMenuID === undefined) ? 0 : vm.parentMenuID,
                    Sequence: (vm.menuSetup.Sequence === undefined) ? 0 : vm.menuSetup.Sequence,
                    MenuTypeID: (vm.menutype.selected.MenuTypeID === null) ? 0 : vm.menutype.selected.MenuTypeID,
                    MenuIconCss: (vm.menuSetup.MenuIconCss === undefined) ? '' : vm.menuSetup.MenuIconCss,
                    IsDeleted: 0
                })
                    .then(function (data) {
                        logger.info('Saved!');
                        $state.go($state.current.name, {}, {
                            reload: true
                        });
                    })
                    .catch(function (error) { });
            }

        };




        vm.editMenu = function (menuId) {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line




            var menuParams = {
                menuId: menuId
            };

            menuSettings.getMenu(menuParams)

                .then(function (data) {
                    vm.MenuID = data[0].MenuID;
                    vm.menuSetup.MenuName = data[0].MenuName;
                    vm.menuSetup.MenuCode = data[0].MenuCode;
                    vm.menuSetup.MenuShortName = data[0].MenuShortName;
                    vm.module = {
                        selected: vm.modules.filter(function (ob, i) {
                            return (ob.ModuleID === data[0].ModuleID);
                        })[0]
                    };
                    vm.menuSetup.MenuPath = data[0].MenuPath;
                    vm.menuSetup.ReportName = data[0].ReportName;
                    vm.menuSetup.ReportPath = data[0].ReportPath;
                    vm.parent = {
                        selected: vm.parents.filter(function (ob, i) {
                            return (ob.ParentID === data[0].ParentID);
                        })[0]
                    };
                    vm.menuSetup.Sequence = data[0].Sequence;
                    vm.menutype = {
                        selected: vm.menutypes.filter(function (ob, i) {
                            return (ob.MenuTypeID === data[0].MenuTypeID);
                        })[0]
                    };
                    vm.menuSetup.MenuIconCss = data[0].MenuIconCss;

                });
            $scope.showItem = false;
            $scope.createItem = true;
        };


        vm.DeleteMenu = function (menuId, deleteStatus) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)); //jshint ignore : line



            menuSettings.postMenuSettings({
                MenuID: menuId,
                MenuCode: '',
                MenuName: null,
                MenuShortName: null,
                ModuleID: 0,
                MenuPath: null,
                ReportName: null,
                ReportPath: null,
                ParentID: 0,
                Sequence: 0,
                MenuTypeID: 0,
                MenuIconCss: null,
                IsDeleted: deleteStatus
            })
                .then(function (data) {
                    logger.info('Deleted!');
                    getAllMenu();
                    $scope.showItem = true;
                    $scope.createItem = false;
                })
                .catch(function (error) { });
        };




        activate();

        function activate() {
            var promises = [getAllModule(), getAllMenuDdl(), getAllMenuType(), getAllMenu()];
            return $q.all(promises).then(function () { });
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

        function getAllMenuDdl() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            return menuSettings.getParentMenu()
                .then(function (data) {
                    vm.parents = data;
                });
        }

        function getAllMenu() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var menuParams = {
                menuId: 0
            };
            return menuSettings.getMenu(menuParams)
                .then(function (data) {
                    vm.menuList = data;
                });
        }


        function getAllMenuType() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            return menuSettings.getMenuType()
                .then(function (data) {
                    vm.menutypes = data;
                });
        }

    }
})();
