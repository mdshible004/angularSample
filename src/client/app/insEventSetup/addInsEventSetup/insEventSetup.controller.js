(function () {
    'use strict';

    angular
        .module('app.insEventSetup')
        .controller('insEventSetupController', insEventSetupController);

    insEventSetupController.$inject = ['instituteSettings', 'insEventSetup', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'moment'];
    /* @ngInject */
    function insEventSetupController(instituteSettings, insEventSetup, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, moment) {

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
        vm.instituteID = $localStorage.userInfo[0].InstituteID;
        vm.IsClassOff = false;

        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.itemEvent = function () {
            //$scope.IsVisible = $scope.IsVisible ? false : true;
            $scope.showItem = true;
            $scope.createItem = false;

        };
        $scope.listEvent = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        $scope.dateValidation = function () {
            //debugger;
            if (vm.formDateSetup <= vm.toDateSetup && vm.formDateSetup !== '' && vm.formDateSetup !== undefined && vm.toDateSetup !== '' && vm.toDateSetup !== undefined) {
                var fromDate = moment(vm.formDateSetup, 'M-D-YYYY');
                var toDate = moment(vm.toDateSetup, 'M-D-YYYY');
                vm.noofdate = (toDate.diff(fromDate, 'days')) + 1;
            }
            else {
                if (vm.formDateSetup !== '' && vm.formDateSetup !== undefined && vm.toDateSetup !== '' && vm.toDateSetup !== undefined) {
                    vm.toDateSetup = vm.formDateSetup;
                    vm.noofdate = 1;
                    logger.warning('From date can not be greater than To date!!!!!');
                }
                else {
                    vm.noofdate = null;
                }
            }

            //    Reset Button
        };

        $scope.CheckIfBlank = function () {
            if (vm.formDateSetup === '' || vm.toDateSetup === '') {
                vm.noofdate = null;
            }
        };
        vm.EventID = 0;
        $scope.InstituteID = $localStorage.userInfo[0].InstituteID;
        // //Post Class 
        vm.AddEventSetup = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line

            if (vm.eventname === undefined || vm.formDateSetup === undefined || vm.toDateSetup === undefined || vm.event === undefined || vm.starttime === undefined || vm.Institute === undefined) {
                logger.error('Please fill All');
            } else {
                insEventSetup.postEvent({
                    EventID: vm.EventID,
                    EventTypeID: vm.event.selected.EventTypeID,
                    Event: vm.eventname,
                    FromDate: vm.formDateSetup,
                    Remarks: vm.remarks,
                    ToDate: vm.toDateSetup,
                    StarTime: vm.starttime === null ? '1900-01-01 00:00:00' : getTimeSpanToTime(vm.starttime),
                    NoOfDay: vm.noofdate,
                    IsClassOff: vm.IsClassOff,
                    InstituteID: vm.Institute.selected.InstituteID,
                    CreateBy: 0,
                    CreateOn: '2017-11-14',
                    CreatePc: 'Apple',
                    UpdateBy: null,
                    UpdateOn: '2017-11-14',
                    UpdatePc: 'Apple',
                    DeleteBy: null,
                    DeleteOn: '2017-11-14',
                    DeletePc: 'Apple',
                    StatusID: null,
                    IsDeleted: 0
                })
                    .then(function (data) {
                        if (data[0].ReturnValue === 'Duplicate') {
                            logger.error('Event Already Exists.....!');
                        } else {
                            logger.info('Saved!');

                            getAllEvents();
                            $state.go($state.current.name, {}, { reload: true });
                        }

                    })
                    .catch(function (error) { });
                //console.log(vm.parents);
            }
        };

        //vm.EditEventSetup = function () {

        //    //Generate Token API Pass Call
        //    authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line

        //    if (vm.eventname === undefined || vm.formDateSetup === undefined || vm.toDateSetup === undefined || vm.eventname === '' || vm.formDateSetup === '' || vm.toDateSetup === '' || vm.starttime === '') {
        //        logger.error('Please fill All');
        //    } else {
        //        insEventSetup.postEvent({
        //            EventID: vm.eventSetup.EventID,
        //            EventTypeID: vm.event.selected.EventTypeID,
        //            Event: vm.eventname,
        //            FromDate: vm.formDateSetup,
        //            ToDate: vm.toDateSetup,
        //            StarTime: vm.starttime === null ? '1900-01-01 00:00:00' : getTimeSpanToTime(vm.starttime),
        //            NoOfDay: vm.noofdate,
        //            IsClassOff: vm.IsClassOff,
        //            InstituteID: vm.Institute.selected.InstituteID,
        //            CreateBy: 0,
        //            CreateOn: '2017-11-14',
        //            CreatePc: 'Apple',
        //            UpdateBy: null,
        //            UpdateOn: '2017-11-14',
        //            UpdatePc: 'Apple',
        //            DeleteBy: null,
        //            DeleteOn: '2017-11-14',
        //            DeletePc: 'Apple',
        //            StatusID: null,
        //            IsDeleted: 0
        //        })
        //            .then(function (data) {
        //                if (data[0].ReturnValue === 'Duplicate') {
        //                    logger.error('Event Already Exists.....!');
        //                } else {
        //                    logger.info('Update Successfully!');
        //                    getAllEvents();
        //                }

        //            })
        //            .catch(function (error) { });

        //    }
        //};

        vm.deleteUserEvent = function (eventID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)); //jshint ignore : line



            insEventSetup.deleteEvent({
                EventID: eventID,

                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                    getAllEvents();
                })
                .catch(function (error) { });

        };

        activate();

        function activate() {
            var promises = [getEventsId(), getAllEvents(), getInstitute()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }


        function getEventsId() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            return insEventSetup.getEventType()
                .then(function (data) {
                    vm.events = data;
                });
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
        //==============================For Date Formating Start===================//

        function getTimeSpanToTime(InputDatetime) {

            var DateToString = InputDatetime.toString();
            var SplitedTime = DateToString.split(' ');

            var OutputTime = '1900-01-01 ' + SplitedTime[4];

            return OutputTime;
        }

        function getTimeToTimeSpan(InputTime) {

            var Year = '1900';
            var Month = '00';
            var Day = '01';
            var Times = InputTime.split(':');
            var Hour = Times[0];
            var Minute = Times[1];

            var OutputTime = new Date(Year, Month, Day, Hour, Minute, 0);

            return OutputTime;
        }
        //==============================For Date Formating END===================//


        vm.getEventByID = function (EventID) {
            //debugger;

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var params = {
                insID: 0,
                EventID: parseInt(EventID)
            };
            insEventSetup.getAllEventById(params)

                .then(function (data) {
                    $scope.createItem = true;
                    $scope.showItem = false;
                    vm.EventID = data[0].EventID;
                    vm.event = {
                        selected: vm.events.filter(function (ob, i) {
                            return (ob.EventType === data[0].EventType);
                        })[0]
                    };
                    vm.eventname = data[0].Event;
                    vm.remarks = data[0].Remarks;
                    vm.IsClassOff = data[0].IsClassOff;
                    vm.formDateSetup = data[0].FromDate;
                    vm.toDateSetup = data[0].ToDate;
                    vm.noofdate = data[0].NoOfDay;
                    vm.starttime = getTimeToTimeSpan(data[0].StarTime);
                    vm.instituteID = data[0].InstituteID;
                    vm.Institute = { selected: vm.Institutes.filter(function (ob, i) { return (ob.InstituteID === data[0].InstituteID); })[0] };
                })
                .catch(function (error) { });
            //console.log(vm.parents);
        };
        // ------------------
        var params;
        function getAllEvents() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            if ($localStorage.userInfo[0].InstituteID === 1) {
                params = {
                    insID: 0,
                    EventID: 0
                };
                return insEventSetup.getAllEventById(params)
                    .then(function (data) {
                        vm.eventss = data;
                    });
            } else {
                params = {
                    EventID: 0,
                    insID: $localStorage.userInfo[0].InstituteID
                };
                return insEventSetup.getAllEventById(params)
                    .then(function (data) {
                        vm.eventss = data;
                    });

            }
        }


    }
})();
