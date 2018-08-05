(function () {
    'use strict';

    angular
        .module('app.insShiftSettings')
        .controller('insShiftSettingsController', insShiftSettingsController);

    insShiftSettingsController.$inject = ['insShiftSettings', 'mailSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function insShiftSettingsController(insShiftSettings, mailSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {



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
        $scope.showShift = false;
        $scope.createItem = true;
        $scope.saveBtn = false;

        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };


        $scope.openShiftIndex = function (index) {
            $scope.shiftindex = index;
            $scope.shifts[$scope.shiftindex].id = $scope.shiftindex;
        };

        $scope.switch = function (e) {
            if (e === 1) {
                $scope.shifts[$scope.shiftindex].IsActive = 0;
            } else {
                $scope.shifts[$scope.shiftindex].IsActive = 1;
            }


        };

        $scope.gridChange = function(){
            $scope.shifts = [];
            $scope.showShift = false;
    
           };

        // vm.mediumID =  $scope.mediums.MediumID

        vm.saveShift = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            var shiftsArr = [];
            if ($scope.shifts !== undefined) {
                for (var i = 0; i < $scope.shifts.length; i++) {
                    if ($scope.shifts[i].IsActive === 0 && $scope.shifts[i].InstShiftID === null) {
                        console.log('Shibli');
                        //logger.error('Please Select Your Shift');
                    } else {
                        shiftsArr.push($scope.shifts[i]);
                    }
                }
                if (shiftsArr.length > 0) {
                    insShiftSettings.postInsShift({
                        InstShiftID: null,
                        InstituteID: vm.institute.selected.InstituteID,
                        ShiftID: null,
                        IsActive: 0,
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
                        shiftsArr: shiftsArr
                    })
                        .then(function (data) {
                            logger.info('Saved!');
                            $state.go($state.current.name, {}, { reload: true });
                        })
                        .catch(function (error) { });
                }else{
                    logger.error('Please Select a Shift');
                }

            }


            else {
                logger.error('Please Select Your Institute and Shift');
            }
        };



        // $scope.index;
        vm.showshift = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var params = {
                insID: vm.instituteID
            };
            if (params.insID === undefined || params.insID === null) {
                logger.error('Please Select an Institute');
            } else {
                insShiftSettings.getAllInsShiftById(params)

                    .then(function (data) {
                        $scope.shifts = data;
                        $scope.showShift = true;
                        $scope.saveBtn = true;

                    });
            }

        };


        activate();

        function activate() {
            var promises = [getAllInstitute()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }

        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        function getAllInstitute() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return mailSettings.getAllInstitutes()
                .then(function (data) {
                    vm.institutes = data;
                    vm.instituteID = vm.InstituteID;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.InstituteID); })[0] };

                });
        }

    }
})();
