(function () {
    'use strict';

    angular
        .module('app.vacationSettings')
        .controller('vacationSettingsController', vacationSettingsController);

    vacationSettingsController.$inject = ['instituteSettings', 'vacationSettingsService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'moment'];
    /* @ngInject */
    function vacationSettingsController(instituteSettings, vacationSettingsService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, moment) {



        var vm = this;
        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        vm.instituteID = $localStorage.userInfo[0].InstituteID;
        //Token Generate Decleration



        // Create and Show list Container Hide or Show Logic
        $scope.showItem = true;
        $scope.createItem = true;
        // $scope.itemEvent = function () {
        //     //$scope.IsVisible = $scope.IsVisible ? false : true;
        //     $scope.showItem = true;
        //    $scope.createItem = true;

        // };
        $scope.listEvent = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.createItem = true;
            $state.go($state.current.name, {}, { reload: true });
        };

        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };
        $scope.InstituteID = $localStorage.userInfo[0].InstituteID;

        //    Date calculation

        $scope.dateValidation = function () {
            //debugger;
            if (vm.formDateSetup <= vm.toDateSetup && vm.formDateSetup !== '' && vm.formDateSetup !== undefined && vm.toDateSetup !== '' && vm.toDateSetup !== undefined) {
                var fromDate = moment(vm.formDateSetup, 'M-D-YYYY');
                var toDate = moment(vm.toDateSetup, 'M-D-YYYY');
                vm.diffDays = (toDate.diff(fromDate, 'days')) + 1;
            }
            else {
                if (vm.formDateSetup !== '' && vm.formDateSetup !== undefined && vm.toDateSetup !== '' && vm.toDateSetup !== undefined) {
                    vm.toDateSetup = vm.formDateSetup;
                    vm.diffDays = 1;
                    logger.warning('From date can not be greater than To date!!!!!');
                }
                else {
                    vm.diffDays = null;
                }
            }

            //    Reset Button
        };

        $scope.CheckIfBlank = function () {
            if (vm.formDateSetup === '' || vm.toDateSetup === '') {
                vm.diffDays = null;
            }
        };

        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        //   show button

        $scope.load = function () {
            $state.go($state.current.name, {}, { reload: true });
        };


        // post vacation

        vm.saveVacation = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line




            if (vm.vacationTypeID === undefined || vm.formDateSetup === undefined || vm.toDateSetup === undefined || vm.Institute === undefined) {
                logger.error('Please fill All');
            } else {
                vacationSettingsService.setInsVacation({
                    VacationID: 0,
                    VacationTypeID: vm.vacation.selected.VacationTypeID,
                    FromDate: vm.formDateSetup,
                    ToDate: vm.toDateSetup,
                    NoOfDay: vm.diffDays,
                    Remarks: vm.remarks === undefined ? '' : vm.remarks,
                    InstituteID: vm.Institute.selected.InstituteID,
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
                            logger.error('Vacation Already Exists....!');
                        }
                        else {
                            logger.info('Saved!');
                            $state.go($state.current.name, {}, { reload: true });
                            $scope.itemEvent();

                        }

                        //$state.transitionTo('deliverypartner.listpartner');
                    })
                    .catch(function (error) { });
                //console.log(vm.parents);
            }
        };

        // edit vacation

        vm.editVacation = function (VacationID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            var params = {
                VacationID: VacationID,
                InsID: 0

            };
            vacationSettingsService.getVacationById(params)

                .then(function (data) {
                    vm.vacation = {
                        selected: vm.vacations.filter(function (ob, i) {
                            return (ob.VacationType === data[0].VacationType);
                        })[0]
                    };
                    vm.formDateSetup = data[0].FromDate;
                    vm.VacationID = data[0].VacationID;
                    vm.toDateSetup = data[0].ToDate;
                    vm.diffDays = data[0].NoOfDay;
                    vm.remarks = data[0].Remarks;
                    vm.instituteID = data[0].InstituteID;
                    vm.Institute = { selected: vm.Institutes.filter(function (ob, i) { return (ob.InstituteID === data[0].InstituteID); })[0] };

                })
                .catch(function (error) { });

        };
        // Update vacation

        vm.updateVacation = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line




            if (vm.vacationTypeID === '' || vm.formDateSetup === '' || vm.toDateSetup === '') {
                logger.error('Please fill All');
            } else {
                vacationSettingsService.setInsVacation({
                    VacationID: vm.VacationID,
                    VacationTypeID: vm.vacation.selected.VacationTypeID,
                    FromDate: vm.formDateSetup,
                    ToDate: vm.toDateSetup,
                    NoOfDay: vm.diffDays,
                    Remarks: vm.remarks === undefined ? '' : vm.remarks,
                    InstituteID: vm.Institute.selected.InstituteID,
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
                            logger.error('Vacation Already Exists....!');
                        }
                        else {
                            logger.info('Updated Successfully!');
                            $scope.itemEvent();

                        }
                        //$state.transitionTo('deliverypartner.listpartner');
                    })
                    .catch(function (error) { });
                //console.log(vm.parents);
            }
        };


        activate();

        function activate() {
            var promises = [getVacationDdl(), getInstitute()];
            return $q.all(promises).then(function () {
            });
        }
        function getVacationDdl() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return vacationSettingsService.getCmnVacation()
                .then(function (data) {
                    vm.vacations = data;
                });
        }


        $scope.fun = false;
        $scope.itemEvent = function getVacation() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            $scope.fun = true;
            $scope.createItem = false;
            var params;
            if ($localStorage.userInfo[0].InstituteID === 1) {
                params = {
                    InsID: 0,
                    VacationID: 0
                };
                return vacationSettingsService.getVacationById(params)
                    .then(function (data) {
                        vm.vacationDate = data;
                    });
            } else {
                params = {
                    VacationID: 0,
                    InsID: $localStorage.userInfo[0].InstituteID
                };
                return vacationSettingsService.getVacationById(params)
                    .then(function (data) {
                        vm.vacationDate = data;
                    });

            }
        };


        //     // ---------------------------------
        //    function getVacation() {
        //           var params={
        //            VacationID:0,
        //            InsID:vm.Institute.selected.InstituteID
        //           }
        //         return vacationSettingsService.getVacationById(params)
        //             .then(function (data) {
        //                 vm.vacationDate = data;

        //             });
        //     }

        //     // ----------------------------------------------
        vm.deleteVacation = function (vacid) {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)) //jshint ignore : line



            vacationSettingsService.deleteVacation({
                VacationID: vacid,

                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                    // getVacation();
                })
                .catch(function (error) { });

        };

        function getInstitute() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            var params = {
                instituteID: $localStorage.userInfo[0].InstituteID
            };

            if (params.instituteID === 1) {
                return instituteSettings.getAllInsInstitute()
                    .then(function (data) {
                        vm.Institutes = data;
                        vm.instituteID = $localStorage.userInfo[0].InstituteID;
                        vm.Institute = { selected: vm.Institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };
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


    }
})();
