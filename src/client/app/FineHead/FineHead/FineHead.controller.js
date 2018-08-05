
//**********************************************Angular Frameworks************************************************************************************* */
(function () {
    'use strict';

    angular
        .module('app.FineHead')
        .controller('FineController', FineController);

    FineController.$inject = ['FineService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    function FineController(FineService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {



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



        activate();
        function activate() {
            var promises = [getFineType(), loadGrid()];
            return $q.all(promises).then(function () {
            });
        }

        //************************************************************ Declaration + Initialization ************************************************************************************* */

      


        $scope.showItem = false;
        $scope.createItem = true;
        $scope.FineSubDays = 'Minimum Days';
        //**********************************************************Load Section************************************************************************************* */

        function getFineType() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return FineService.getFineType()
                .then(function (data) {
                    vm.FineTypes = data;
                });
        }

        function loadGrid() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID
            };
            return FineService.getAllFine(Params)
                .then(function (data) {
                    vm.FineList = data;
                });
        }

        vm.getFineByID = function (FineID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var Params = {
                FineID: FineID,
                InstituteID: $localStorage.userInfo[0].InstituteID
            };
            FineService.getFineByID(Params)
                .then(function (data) {
                    vm.FineSetup.classID = Params.FineID;
                    vm.Fine = {
                        selected: vm.FineTypes.filter(function (ob, i) {
                            return (ob.FineHead === data[0].FineHead);
                        })[0]
                    };

                    vm.FineSetup.FineAmount = data[0].FineAmount;
                    vm.FineSetup.minDays = data[0].MinimumDays;
                    $scope.ChangeLabelName(data[0].FineHeadID);
                });
        };

        $scope.ChangeLabelName = function (model) {
            //debugger;
            if (model === 104) {
                $scope.FineSubDays = 'Number of Subjects';
            }
            else {
                $scope.FineSubDays = 'Minimum Days';
            }
        };

        //**********************************************************HTML Show/Hide ************************************************************************************* */
        $scope.itemEvent = function () {
            $scope.showItem = true;
            $scope.createItem = false;

        };
        $scope.listEvent = function () {
            $scope.showItem = false;
            $scope.createItem = true;
            clear();
        };

        //**********************************************************CRUD************************************************************************************* */
        vm.AddFine = function () {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            if (vm.FineSetup.FineAmount === undefined || vm.FineSetup.FineAmount === null || vm.FineSetup.FineAmount <= 0) {
                logger.error('Please Enter Fine Amount');
                return;
            }

            if (vm.FineSetup.minDays === undefined || vm.FineSetup.minDays === null || vm.FineSetup.minDays <= 0) {
                logger.error('Please Enter Minimum Days');
                return;
            }

            FineService.SaveFine({
                InsFineID: 0,
                FineHead: vm.Fine.selected.FineHead,
                FineHeadID: vm.Fine.selected.FineHeadID,
                FineAmount: vm.FineSetup.FineAmount,
                MinimumDays: vm.FineSetup.minDays,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                isActive: 1,
                CreateBy: 0,
                CreateOn: '2017-10-10',
                CreatePc: 'Apple',
                UpdateBy: 'NULL',
                UpdateOn: '2017-10-10',
                UpdatePc: 'Apple',
                IsDeleted: 0,
                DeleteBy: 'NULL',
                DeleteOn: '2017-10-10',
                DeletePc: 'Apple'

            })
                .then(function (data) {

                    if (data[0].ReturnValue === 'Duplicate') {
                        logger.error('This name Already exists...');
                        loadGrid();
                        clear();
                    }
                    else {
                        logger.info('Saved Successfully!');
                        loadGrid();
                        clear();
                    }
                })
                .catch(function (error) { });
        };





        vm.updateFine = function () {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            if (vm.FineSetup.FineAmount === undefined || vm.FineSetup.FineAmount === null || vm.FineSetup.FineAmount <= 0) {
                logger.error('Please Enter Fine Amount');
                return;
            }
            if (vm.FineSetup.minDays === undefined || vm.FineSetup.minDays === null || vm.FineSetup.minDays <= 0) {
                logger.error('Please Enter Minimum Days');
                return;
            }
            FineService.UpdateFine({

                InsFineID: vm.FineSetup.classID,
                FineHead: vm.Fine.selected.FineHead,
                FineHeadID: vm.Fine.selected.FineHeadID,
                FineAmount: vm.FineSetup.FineAmount,
                MinimumDays: vm.FineSetup.minDays,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                isActive: 1,

                CreateBy: 0,
                CreateOn: '2017-10-10',
                CreatePc: 'Apple',
                UpdateBy: 'NULL',
                UpdateOn: '2017-10-10',
                UpdatePc: 'Apple',
                IsDeleted: 0,
                DeleteBy: 'NULL',
                DeleteOn: '2017-10-10',
                DeletePc: 'Apple'


            })
                .then(function (data) {
                    if (data[0].ReturnValue === 'Duplicate') {
                        logger.error('This name Already exists...');
                        loadGrid();
                        clear();

                    }
                    else {
                        logger.info('Updated Successfully!');
                        loadGrid();

                    }
                })
                .catch(function (error) { });
        };


        vm.deleteFine = function (classID) {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var classParam = {
                classID: classID
            };
            FineService.deleteFineByID(classParam)
                .then(function (data) {
                    vm.Fine = data;
                    loadGrid();
                });


        };

        //**********************************************************Clear/Reset************************************************************************************* */

        $scope.clearField = function () {
            clear();
        };

        function clear() {
            $state.go($state.current.name, {}, { reload: true });
        }

    }
})();
