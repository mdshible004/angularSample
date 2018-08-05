(function () {
    'use strict';

    angular
        .module('app.shiftSettings')
        .controller('shiftSettingsController', shiftSettingsController);

    shiftSettingsController.$inject = ['shiftSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants','$localStorage'];
    /* @ngInject */
    function shiftSettingsController(shiftSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants,$localStorage) {



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
            $state.go($state.current.name, {}, {reload: true});
            $scope.showItem = false;
            $scope.createItem = true;
        };

        // Reset Button Logic
        $scope.clearField = function () {
            vm.addShift.ShiftName = null;
        };

        $scope.checkShift = function (model) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            //debugger;
            var cmnParam = {};
            cmnParam.ShiftName = model;
            shiftSettings.getShiftByShift(cmnParam)
                .then(function (data) {
                    if (data[0].ReturnValue !== 0) {
                        logger.error('Shift Already exists....');
                        vm.addShift.ShiftName = '';
                    }
                })
                .catch(function (error) { });
        };

        //Post Shift
        vm.ShiftID = 0;
        vm.AddShiftSettings = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line



            if(vm.addShift.ShiftName===undefined || vm.addShift.ShiftName==='' || vm.addShift.ShiftName===null){
                logger.error('Please fill Shift Name...');
            }
            else{
            shiftSettings.postShiftInformation({
                ShiftID: vm.ShiftID,
                ShiftName: vm.addShift.ShiftName,
                CreateBy: 0,
                CreateOn: '10.10.2017',
                CreatePc: null,
                UpdateBy: null,
                UpdateOn: '10.10.2017',
                UpdatePc: null,
                IsDeleted: 0,
                DeleteBy: null,
                DeleteOn: '10.10.2017',
                DeletePc: null
            })
                .then(function (data) {
                    if (data[0].ReturnValue === 'Duplicate') {
                        logger.error('Name Already exists....');
                    }
                    else {
                        logger.info('Saved Successfully');
                        $state.go($state.current.name, {}, {reload: true});
                    }
                    
                })
                .catch(function (error) { });
            
        }
    };
        vm.editShift = function (ShiftID) {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            var params = {
                ShiftID: ShiftID
            };
            shiftSettings.getAllShiftByID(params)
                .then(function (data) {
                    vm.addShift.ShiftName = data[0].ShiftName;
                    vm.ShiftID = data[0].ShiftID;
                    $scope.showItem = false;
                    $scope.createItem = true;
                })
                .catch(function (error) { });

        };


        vm.deleteShift = function (Shiftid) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)) //jshint ignore : line





            shiftSettings.deleteShift({
                ShiftID: Shiftid,
               
                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                    getShift();
                })
                .catch(function (error) { });

        };

        activate();

        function activate() {


            var promises = [getShift()];
            return $q.all(promises).then(function () {
            });
        }
        function getShift() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return shiftSettings.getAllShift()
                .then(function (data) {
                    vm.shifts = data;
                });
        }

    }
})();
