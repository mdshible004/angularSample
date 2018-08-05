(function () {
    'use strict';

    angular
        .module('app.addressSettings')
        .controller('addressSettingsController', addressSettingsController);

    addressSettingsController.$inject = ['addressSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function addressSettingsController(addressSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

        var vm = this;

        //himel test for check in
        //jahangir
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
            $state.go($state.current.name, {}, { reload: true });
        };

        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };
        //Post Shift
        vm.AddAdressSettings = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, postMethod)); //jshint ignore : line

            if (vm.addCity.cityName === undefined || vm.state === undefined || vm.addCity.cityName === '' || vm.addCity.cityName === null) {
                logger.error('Please fill CityName and State');
            }
            else {
                addressSettings.postAdressInformation({
                    CityID: 0,
                    CityName: vm.addCity.cityName,
                    CityShortName: vm.addCity.cityShortName === undefined ? '' : vm.addCity.cityShortName,
                    StateID: vm.state.selected.StateID,
                    CreateBy: 0,
                    CreateOn: '2017-01-01',
                    CreatePc: null,
                    UpdateBy: null,
                    UpdateOn: '2017-01-01',
                    UpdatePc: null,
                    IsDeleted: 0,
                    DeleteBy: null,
                    DeleteOn: '2017-01-01',
                    DeletePc: null
                })
                    .then(function (data) {
                        if (data[0].ReturnValue === 'Duplicate') {
                            logger.error('City Name Already Exist..!');
                        } else {
                            logger.info('Saved!');
                            //$state.go($state.current.name, {}, {reload: true});
                            getAdresses();
                            $state.go($state.current.name, {}, { reload: true });
                            //$scope.itemEvent();
                            //$state.transitionTo('deliverypartner.listpartner');
                        }
                    })
                    .catch(function (error) { });
                //console.log(vm.parents);
            }
        };
        vm.editCity = function (cityID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var params = {
                cityID: cityID
            };
            addressSettings.getCityById(params)

                .then(function (data) {
                    vm.addCity.cityName = data[0].CityName;
                    vm.cityId = data[0].CityID;
                    vm.addCity.cityShortName = data[0].CityShortName;
                    vm.state = {
                        selected: vm.states.filter(function (ob, i) {
                            return (ob.StateName === data[0].State);
                        })[0]
                    };
                    //$state.transitionTo('deliverypartner.listpartner');
                })
                .catch(function (error) { });
            //console.log(vm.parents);
        };
        vm.updateCity = function () {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            if (vm.addCity.cityName === undefined || vm.state === undefined || vm.addCity.cityName === '' || vm.addCity.cityName === null || vm.state === '' || vm.state === null) {
                logger.error('Please fill CityName and State');
            }
            else {
                addressSettings.postAdressInformation({
                    CityID: vm.cityId,
                    CityName: vm.addCity.cityName,
                    CityShortName: vm.addCity.cityShortName,
                    StateID: vm.state.selected.StateID,
                    CreateBy: 0,
                    CreateOn: '2017-01-01',
                    CreatePc: null,
                    UpdateBy: null,
                    UpdateOn: '2017-01-01',
                    UpdatePc: null,
                    IsDeleted: 0,
                    DeleteBy: null,
                    DeleteOn: '2017-01-01',
                    DeletePc: null
                })
                    .then(function (data) {
                        if (data[0].ReturnValue === 'Duplicate') {
                            logger.error('City Name Already Exist..!');
                        } else {
                            logger.info('Updated Successfully');
                            getAdresses();
                            // $scope.itemEvent();
                            //$state.go($state.current.name, {}, {reload: true});
                        }
                    })
                    .catch(function (error) { });
                //console.log(vm.parents);
            }

        };


        activate();

        function activate() {
            var promises = [getstate(), getAdresses()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }
        function getstate() {
            return addressSettings.getallstates()
                .then(function (data) {
                    vm.states = data;
                });
        }
        function getAdresses() {
            return addressSettings.getAllAdress()
                .then(function (data) {
                    vm.cities = data;
                });
        }


        vm.deleteCity = function (CityID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)); //jshint ignore : line


            addressSettings.deleteAddress({
                CityID: CityID,

                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                    getAdresses();
                })
                .catch(function (error) { });

        };




    }
})();
