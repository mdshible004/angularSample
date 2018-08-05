(function () {
    'use strict';

    angular
        .module('app.moduleSettings')
        .controller('ModuleSettingsController', ModuleSettingsController);

    ModuleSettingsController.$inject = ['menuSettings', 'instituteSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$localStorage', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants'];
    /* @ngInject */
    function ModuleSettingsController(menuSettings, instituteSettings, filterurl, $q, authservice, logger, $scope, $localStorage, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants) {

        /**************8declaration +initailization*******************/
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

        activate();

        function activate() {
            var promises = [getAllModule(), getAllMenu(), getAllInstitute()];
            return $q.all(promises).then(function () { });
        }


        /*******************Load Section******************/
        $scope.itemEvent = function () {
            $scope.showItem = true;
            $scope.createItem = true;

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

        function getAllMenu() {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            return menuSettings.getParentMenu()
                .then(function (data) {
                    vm.MenuList = data;
                });
        }

        function getAllInstitute() {



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




        /**************CRUD Section**********************/

        vm.AddModuleSetting = function () {




            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            if (vm.ModName === undefined || vm.ModCode === undefined) {
                logger.error('Please Enter Menu Name,Code');
                return;
            }

            if (vm.ModuleID === null || vm.ModuleID === undefined) {
                vm.ModuleID = 0;
            }

            menuSettings.setModule({

                ModuleID: vm.ModuleID,
                ModuleNo: vm.ModCode,
                ModuleName: vm.ModName,
                Description: (vm.ModDesc === undefined) ? '' : vm.ModDesc,
                ImageURL: 'No URL',
                ModulePath: (vm.Modepath === null) ? '' : vm.Modepath,
                Sequence: (vm.Modequence === undefined) ? 0 : vm.Modequence,
                StatusID: 1,
                IconCss: (vm.ddlModeIcon === undefined) ? '' : vm.ddlModeIcon,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                IsDelete: 0,

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

            }).
                then(function (data) {
                    logger.info('Saved!');
                    getAllModule();
                })
                .catch(function (error) { });
        };



        vm.EditModule = function (moduleID) {




            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var moduleParams = {
                moduleID: moduleID
            };

            menuSettings.getModule(moduleParams)

                .then(function (data) {
                    vm.ModuleID = data[0].ModuleID;
                    vm.ModName = data[0].ModuleName;
                    vm.ModCode = data[0].ModuleNo;
                    vm.ModDesc = data[0].Description;
                    vm.Modepath = data[0].ModulePath;
                    vm.Modequence = data[0].Sequence;
                    vm.ddlModeIcon = data[0].IconCss;

                });
            $scope.showItem = false;
            $scope.createItem = true;
        };


        vm.DeleteModule = function (moduleID, deleteStatus) {




            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            menuSettings.setModule({

                ModuleID: moduleID,
                ModuleNo: null,
                ModuleName: null,
                Description: null,
                ImageURL: null,
                ModulePath: null,
                Sequence: null,
                StatusID: 1,
                IconCss: null,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                IsDelete: deleteStatus,

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

            }).then(function (data) {
                logger.info('Deleted!');
                getAllModule();
                $scope.showItem = true;
                $scope.createItem = false;
            })
                .catch(function (error) { });
        };

    }
})();
