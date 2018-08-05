
(function () {
    'use strict';

    angular
        .module('app.manualTeacherAttendance')
        .controller('ManualTeacherAttendanceController', ManualTeacherAttendanceController);

    ManualTeacherAttendanceController.$inject = ['branchSettingsSevice', 'commonService', 'conversion', 'teacherAttendanceSevice', 'studentAttendanceSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function ManualTeacherAttendanceController(branchSettingsSevice, commonService, conversion, teacherAttendanceSevice, studentAttendanceSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {



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



        vm.dateSetup = {};
        vm.dateSetup.dateName = conversion.NowDateCustom();
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
        };

        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        $scope.intime = [];
        $scope.openPresentIndex = function (index) {
            $scope.presentIndex = index;

        };
        $scope.changeGrid = function () {
            vm.teacherAttendances = [];
            $scope.showItem = false;
        };

        $scope.btnDis = false;
        $scope.btnHide = true;
        $scope.switch = function (e) {
            if (e === 1) {
                vm.teacherAttendances[$scope.presentIndex].Present = 0;
            } else {
                vm.teacherAttendances[$scope.presentIndex].Present = 1;
            }


        };
        $scope.allSelectCheckBox = function (IsCheck) {
            //debugger;
            if (IsCheck === true) {
                for (var i = 0; i < $scope.gridOptions.data.length; i++) {
                    $scope.gridOptions.data[i].Present = true;
                }
            }
            else {
                for (var j = 0; j < $scope.gridOptions.data.length; j++) {
                    $scope.gridOptions.data[j].Present = 0;
                }
            }
        };
        // vm.teacherAttendances[i].AttendanceID===null?0:vm.teacherAttendances[i].AttendanceID
        vm.postManualTeacherAttendance = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            // $scope.btnDis = true;
            $scope.btnHide = true;
            studentAttendanceSevice.setManualStudentAttendance({
                AttendanceID: null,
                UserID: 100,
                BadgeNumber: null,
                Name: null,
                Date: vm.dateSetup.dateName === '' || vm.dateSetup.dateName === undefined ? null : conversion.getStringToDate(vm.dateSetup.dateName),
                Times: null,
                Present: null,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                CreateBy: 0,
                CreateOn: '10-10-2017',
                CreatePc: 'Bond',
                UpdateBy: 0,
                UpdateOn: '10-10-2017',
                UpdatePc: 'Bond',
                IsDeleted: 0,
                DeleteBy: 0,
                DeleteOn: '10-10-2017',
                DeletePc: 'Bond',
                AttendanceArr: $scope.gridOptions.data,
                MatchPresentArr: vm.matchPresent,
                MatchTimeArr: vm.matchTime
            })
                .then(function (data) {
                    logger.info('Saved Successfully');
                    $state.go($state.current.name, {}, { reload: true });

                })
                .catch(function (error) { });


        };
        vm.getTeacherAttendanceByParams = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            if (vm.dateSetup === undefined) { console.log('himel'); }
            else {
                $scope.showItem = true;
                $scope.btnHide = false;

                var hrmDeviceParams = {
                    BrunchID: vm.BrunchID === undefined || vm.BrunchID === null ? 0 : vm.BrunchID,
                    DepartmentID: vm.DepartmentID === undefined || vm.DepartmentID === null ? 0 : vm.DepartmentID,
                    Date: vm.dateSetup.dateName === '' || vm.dateSetup.dateName === undefined ? null : conversion.getStringToDate(vm.dateSetup.dateName),
                    InstituteID: $localStorage.userInfo[0].InstituteID,
                    UserTypeID: 4

                };
                return teacherAttendanceSevice.getHrmDeviceByParmsforTeacherManual(hrmDeviceParams)
                    .then(function (data) {
                        vm.teacherAttendances = data;
                        $scope.showItem = true;
                        vm.matchPresent = [];
                        vm.matchTime = [];
                        for (var i = 0; i < data.length; i++) {
                            vm.matchPresent[i] = data[i].Present;
                            vm.matchTime[i] = data[i].Intime;
                            var ab = data[i].Intime;
                            if (ab === null) {
                                ab = '2018-02-01T09:00:00.000Z';
                            }
                            else {
                                ab = ab;
                            }
                            vm.teacherAttendances[i].Intime = getTimeToTimeSpan(ab);
                        }
                    });
            }
        };


        //************************************************Start Grid******************************************************
        //***************Start ServerSide Search********************************************
        $scope.SearchProperty = '';
        $scope.IsCallFromSearch = false;
        $scope.SearchCancel = function () {
            $scope.SearchProperty = '';
            $scope.SearchNow($scope.SearchProperty);
        };

        $scope.SearchNow = function (searchstring) {
            //debugger;
            $scope.IsCallFromSearch = searchstring === '' ? false : true;
            $scope.SearchProperty = searchstring.toString();
            //$scope.pagination.pageNumber = 2;
            //$scope.pagination.firstPage();
        };
        //***************End ServerSide Search********************************************

        //var objcmnParam = {};
        $scope.gridOptions = [];
        $scope.getAllTeacherMAList = function () {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line




            $scope.gridOptions.enableFiltering = true;
            //$scope.gridOptions.showColumnFooter = true;
            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();            
            //objcmnParam.pageNumber = ($scope.pagination.pageNumber - 1) * $scope.pagination.pageSize;
            //objcmnParam.pageSize = $scope.pagination.pageSize;
            //objcmnParam.IsPaging = isPaging;
            //objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID;
            //objcmnParam.LoggedUserID = $localStorage.userInfo[0].UserID;
            //objcmnParam.typeID = 4;
            //objcmnParam.SearchProperty = $scope.IsCallFromSearch === true ? $scope.SearchProperty : '';

            $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
                if (col.filters[0].term) {
                    return 'header-filtered';
                } else {
                    return '';
                }
            };
            $scope.gridOptions = {
                useExternalPagination: true,
                useExternalSorting: true,
                enableFiltering: true,
                enableRowSelection: true,
                enableSelectAll: true,
                showFooter: true,
                //showGridFooter: true,
                //showColumnFooter: true,
                enableGridMenu: true,
                enableCellEditOnFocus: true,
                columnDefs: [
                    {
                        name: 'SL', displayName: 'SL', headerCellClass: 'text-center', cellTemplate: '<span>{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</span>', width: '4%', enableCellEdit: false, enableFiltering: false
                        //cellClass: function (grid, row) { $scope.gridApi = grid.renderContainers.body.visibleRowCache; return 'text-center'; }, width: '4%', enableCellEdit: false, enableFiltering: false,
                        //aggregationType: uiGridConstants.aggregationTypes.count,
                        //footerCellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">{{col.getAggregationValue()}}</div>',
                        //aggregationHideLabel: true,
                        //filters: [{ condition: function (term, value, row, column) { if ('undefined' === typeof (term) || null === term) return true; try { if (term.charAt(0) === '>') { var val = term.slice(1); return parseFloat(value) > parseFloat(val); } else if (term.charAt(0) === '<') { var val = term.slice(1); return parseFloat(value) < parseFloat(val); } else { return parseFloat(value) === parseFloat(term); } } catch (ex) { console.warn(ex); } } }]
                    },
                    { name: 'Date', displayName: 'Date', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader, width: '12%' },
                    { name: 'Brunch', displayName: 'Branch', headerCellClass: $scope.highlightFilteredHeader, width: '10%' },
                    { name: 'Department', displayName: 'Department', headerCellClass: $scope.highlightFilteredHeader, width: '10%' },
                    { name: 'Name', displayName: 'Name', headerCellClass: $scope.highlightFilteredHeader, width: '15%' },
                    { name: 'RFID', displayName: 'Teacher ID', headerCellClass: $scope.highlightFilteredHeader, width: '10%' },
                    { name: 'EmailID', displayName: 'EmailID', headerCellClass: $scope.highlightFilteredHeader, width: '18%' },
                    {
                        name: 'Present', displayName: 'Is Present', cellClass: 'text-center', type: 'boolean', headerCellClass: $scope.highlightFilteredHeader,
                        cellTemplate: '<input type="checkbox" style="height:20px; width:20px" ng-model="row.entity.Present"/>', width: '9%', enableCellEdit: false//, enableFiltering: false //ng-click="grid.appScope.switch(row.entity)"
                    },
                    {
                        name: 'Intime', displayName: 'In Time', cellClass: 'text-center', type: 'boolean', headerCellClass: $scope.highlightFilteredHeader, width: '12%',
                        cellTemplate: '<input type="time" ng-model="row.entity.Intime"/>'
                    }
                ],
                //enableGridMenu: true,
                //enableSelectAll: true,
                exporterCsvFilename: 'TtMA.csv',
                exporterPdfDefaultStyle: { fontSize: 9 },
                exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
                exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
                exporterPdfHeader: { text: 'Teacher M. Att. List', style: 'headerStyle' },
                exporterPdfFooter: function (currentPage, pageCount) {
                    return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                },
                exporterPdfCustomFormatter: function (docDefinition) {
                    docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                    docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                    return docDefinition;
                },
                exporterPdfOrientation: 'landscape',
                exporterPdfPageSize: 'LETTER',
                exporterPdfMaxGridWidth: 500,
                exporterCsvLinkElement: angular.element(document.querySelectorAll('.custom-csv-link-location')),
                exporterExcelFilename: 'TtMA.xlsx',
                exporterExcelSheetName: 'Sheet1'
            };
            $scope.gridOptions.data = [];
            if (vm.dateSetup === undefined) { console.log('himel'); }
            else {
                var hrmDeviceParams = {
                    BrunchID: vm.BrunchID === undefined || vm.BrunchID === null ? 0 : vm.BrunchID,
                    DepartmentID: vm.DepartmentID === undefined || vm.DepartmentID === null ? 0 : vm.DepartmentID,
                    Date: vm.dateSetup.dateName === '' || vm.dateSetup.dateName === undefined ? null : conversion.getStringToDate(vm.dateSetup.dateName),
                    InstituteID: $localStorage.userInfo[0].InstituteID,
                    UserTypeID: 4

                };
                return teacherAttendanceSevice.getHrmDeviceByParmsforTeacherManual(hrmDeviceParams)
                    .then(function (data) {
                        //debugger;
                        if (data.length > 0) {
                            $scope.showItem = true;
                            $scope.btnHide = false;
                            $scope.gridOptions.data = data;

                            vm.matchPresent = [];
                            vm.matchTime = [];

                            for (var i = 0; i < $scope.gridOptions.data.length; i++) {
                                vm.matchPresent[i] = $scope.gridOptions.data[i].Present;
                                //vm.matchTime[i] = $scope.gridOptions.data[i].Intime;
                                var ab = $scope.gridOptions.data[i].Intime;
                                if (ab === null) {
                                    ab = '1900-01-01T09:00:00.000Z';
                                }
                                else {
                                    ab = ab;
                                }
                                vm.matchTime[i] = ab;
                                $scope.gridOptions.data[i].Intime = getTimeToTimeSpan(ab);
                                $scope.gridOptions.data[i].Present = $scope.gridOptions.data[i].Present === 1 ? true : 0;
                                vm.matchPresent[i] = vm.matchPresent[i] === 1 ? true : 0;
                                $scope.gridOptions.data[i].Date = vm.dateSetup.dateName;
                            }
                        }
                        else {
                            logger.error('Your desired data not found');
                        }
                        $scope.loaderMore = false;
                    });
            }
        };
        //************************************************End Grid******************************************************


        activate();

        function activate() {
            var promises = [getInsBranchDdl(), getInsDepartmentDdl()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }

        function getInsBranchDdl() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return branchSettingsSevice.getBranchByInstituteId(Params)
                .then(function (data) {
                    vm.branches = data;
                });
        }

        function getInsDepartmentDdl() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteDepertment(Params)
                .then(function (data) {
                    vm.departments = data;
                });
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
            var Times = InputTime.split('T');
            var Hour = Times[0];
            var Minute = Times[1];
            var t = Times[1].split('.');
            var tm = t[0].split(':');
            var tDay = tm[0];
            var tHour = tm[0];
            var tMinute = tm[1];

            var OutputTime = new Date(Year, Month, Day, tHour, tMinute, 0);

            return OutputTime;
        }
        //==============================For Date Formating END===================//

    }
})();

