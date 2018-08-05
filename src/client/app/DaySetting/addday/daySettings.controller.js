(function () {
    'use strict';

    angular
        .module('app.daySettings')
        .controller('daySettingsController', daySettingsController);

    daySettingsController.$inject = ['daySettingsSevice', 'instituteSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function daySettingsController(daySettingsSevice, instituteSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {


        var vm = this;
        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        var params;
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
        //post Day Setting
        vm.saveDay = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            if (vm.day === undefined || vm.Institute === undefined) {
                logger.error('Please select Day and institute');
            }
            else {
                daySettingsSevice.postday({
                    WeekendID: 0,
                    DayID: vm.day.selected.DayID,
                    InstituteID: vm.Institute.selected.InstituteID,
                    CreateBy: 0,
                    CreateOn: '10-10-2017',
                    CreatePc: 'Bond',
                    UpdateBy: 0,
                    UpdateOn: '10-10-2017',
                    UpdatePc: 'Bond',
                    IsDeleted: 0,
                    DeleteBy: 0,
                    DeleteOn: '10-10-2017',
                    DeletePc: 'Bond'
                })
                    .then(function (data) {
                        if (data[0].ReturnValue === 'Duplicate') {
                            logger.error('Name Already exists....');
                        }
                        else {
                            logger.info('Saved Successfully');
                            getweekend();
                            $state.go($state.current.name, {}, { reload: true });
                            //  window.onload = setTimeout('location.reload(true);', 1500);
                        }

                    })
                    .catch(function (error) { });
            }
        };

        vm.editWeekend = function (weekendID) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            var params = {
                weekendID: weekendID
            };
            daySettingsSevice.getWeekendById(params)

                .then(function (data) {
                    vm.addday.WeekendID = data[0].WeekendID;
                    vm.day = {
                        selected: vm.days.filter(function (ob, i) {
                            return (ob.Day === data[0].Day);
                        })[0]
                    };
                    vm.Institute = { selected: vm.Institutes.filter(function (ob, i) { return (ob.InstituteID === data[0].InstituteID); })[0] };
                    //$state.transitionTo('deliverypartner.listpartner');

                })
                .catch(function (error) { });
            //console.log(vm.parents);
        };

        vm.updateWeekend = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.putMethod)); //jshint ignore : line



            if (vm.day === undefined) {
                logger.error('Please select Day');
            }
            else {
                daySettingsSevice.postday({
                    WeekendID: vm.addday.WeekendID,
                    DayID: vm.day.selected.DayID,
                    InstituteID: vm.Institute.selected.InstituteID,
                    CreateBy: 0,
                    CreateOn: '10-10-2017',
                    CreatePc: 'Bond',
                    UpdateBy: 0,
                    UpdateOn: '10-10-2017',
                    UpdatePc: 'Bond',
                    IsDeleted: 0,
                    DeleteBy: 0,
                    DeleteOn: '10-10-2017',
                    DeletePc: 'Bond'
                })
                    .then(function (data) {
                        logger.info('Updated Successfully!');
                        getweekend();
                        //$state.transitionTo('deliverypartner.listpartner');
                    })
                    .catch(function (error) { });
                //console.log(vm.parents);
            }

        };


        activate();

        function activate() {
            var promises = [getday(), getweekend(), getInstitute()];
            return $q.all(promises).then(function () {
            });
        }
        function getday() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return daySettingsSevice.getAllDay()
                .then(function (data) {
                    vm.days = data;
                });
        }
        function getweekend() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            if ($localStorage.userInfo[0].InstituteID === 1) {
                params = {
                    insID: 0,
                    wkID: 0
                };
                return daySettingsSevice.getAllWeekend(params)
                    .then(function (data) {
                        vm.weekends = data;
                    });
            } else {
                params = {  
                    wkID: 0,
                    insID: $localStorage.userInfo[0].InstituteID
                };
                return daySettingsSevice.getAllWeekend(params)
                    .then(function (data) {
                        vm.weekends = data;
                    });

            }
        }


        function getInstitute() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var params = {
                instituteID: $localStorage.userInfo[0].InstituteID
            };

            if (params.instituteID === 1) {
                return instituteSettings.getAllInsInstitute()
                    .then(function (data) {
                        vm.Institutes = data;


                    });
            }
            else {

                return instituteSettings.getInsInstituteByID(params)
                    .then(function (data) {
                        vm.Institutes = data;
                        $scope.isReadOnly = true;
                        vm.Institute = { selected: vm.Institutes.filter(function (ob, i) { return (ob.InstituteID === data[0].InstituteID); })[0] };

                    });
            }
        }
        vm.deleteWeekend = function (WeekendID) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)); //jshint ignore : line


            daySettingsSevice.deleteInsWeekend({
                WeekendID: WeekendID,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                    getweekend();
                })
                .catch(function (error) { });

        };



    }
})();
