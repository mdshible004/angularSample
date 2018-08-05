(function () {
    'use strict';

    angular
        .module('app.AcademicCalendar')
        .controller('AcademicCalendarController', AcademicCalendarController);

    AcademicCalendarController.$inject = ['mailSettings', 'commonService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function AcademicCalendarController(mailSettings, commonService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

        var vm = this;
        $scope.GridShowDetails = false;
        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration
        $scope.CurrYear = new Date().getFullYear().toString();
        $scope.IfExist = false;

        $scope.IfExistAcademicYearCalendar = function () {
            //debugger;
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            var params = {
                InstituteID: vm.instituteID,
                YearName: vm.YearName
            };
            return commonService.IfExistAcademicYearCalendar(params)
                .then(function (data) {
                    if (data[0].ReturnValue === 1) {
                        $scope.IfExist = true;
                    }
                    else {
                        $scope.IfExist = false;
                    }
                });
        };

        $scope.SetFullYearCalendar = function () {
            //debugger;
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line
            
            var params = {
                InstituteID: vm.instituteID,
                StartOfYear: '01-01-' + vm.YearName,
                EndOfYear: '12-31-' + vm.YearName
            };
            return commonService.SetFullYearCalendar(params)
                .then(function (data) {
                    if (data[0].ReturnValue === 1) {
                        logger.info('Academic Calendar Created Successfully!!!!!');
                        $state.go($state.current.name, {}, { reload: true });
                    }
                    else {
                        logger.error('Proceed error!!!!!');
                    }
                });
        };

        $scope.RemoveFullYearCalendar = function () {
            //debugger;
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            var params = {
                InstituteID: vm.instituteID,
                YearName: vm.YearName
            };
            return commonService.RemoveFullYearCalendar(params)
                .then(function (data) {
                    if (data[0].ReturnValue === 1) {
                        logger.info('Academic Calendar' + vm.YearName + ' has been removed successfully!!!!!');
                        $state.go($state.current.name, {}, { reload: true });
                    }
                    else {
                        $scope.IfExist = true;
                    }
                });
        };

        $scope.setYear = function () {
            vm.YearName = $scope.CurrYear;
            vm.year = {
                selected: vm.YearList.filter(function (ob, i) {
                    return (ob.YearName === vm.YearName);
                })[0]
            };
        };

        activate();

        function activate() {
            var promises = [getAllYear(), getAllInstitute()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }

        function getAllYear() {
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            return commonService.getCmnYear()
                .then(function (data) {
                    //data.push({ ShiftID: 0, ShiftName: 'None' });
                    vm.YearList = data;
                    vm.YearName = $scope.CurrYear;
                    vm.year = {
                        selected: vm.YearList.filter(function (ob, i) {
                            return (ob.YearName === vm.YearName);
                        })[0]
                    };
                    $scope.IfExistAcademicYearCalendar();
                });
        }

        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.instituteID = $localStorage.userInfo[0].InstituteID;
        function getAllInstitute() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return mailSettings.getAllInstitutes()
                .then(function (data) {
                    vm.institutes = data;
                    vm.instituteID = vm.instituteID;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };

                });
        }


    }
})();
