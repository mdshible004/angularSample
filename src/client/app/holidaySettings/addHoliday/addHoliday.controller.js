(function () {
    'use strict';

    angular
        .module('app.holidaySettings')
        .controller('HolidaySettingsController', HolidaySettingsController);

    HolidaySettingsController.$inject = ['leaveService', 'mailSettings', 'commonService', 'subjectSettingsSevice', 'branchSettings', 'mediumsetting', 'classSettings', 'teacherAttendanceSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function HolidaySettingsController(leaveService, mailSettings, commonService, subjectSettingsSevice, branchSettings, mediumsetting, classSettings, teacherAttendanceSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

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
            //If DIV is visible it will be hidden and vice versa.
            $scope.showItem = false;
            $scope.createItem = true;
        };

        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        $scope.date = function () {
            if (vm.toDateSetup !== undefined && vm.formDateSetup !== undefined) {
                var fromDate = moment(vm.formDateSetup, 'M-D-YYYY'); //jshint ignore : line
                var toDate = moment(vm.toDateSetup, 'M-D-YYYY'); //jshint ignore : line
                var fromYear = parseInt(vm.formDateSetup.split('-')[2]);
                var toYear = parseInt(vm.toDateSetup.split('-')[2]);
                var ssYear = vm.year === undefined ? fromYear : parseInt(vm.year.selected.YearName);
                if (ssYear !== toYear && ssYear !== fromYear) {
                    logger.error('Year Doesnt Match');
                    vm.formDateSetup = '';
                    vm.toDateSetup = '';
                    vm.diffDays = 0;
                }
                else {
                    if (toDate.diff(fromDate, 'days') < 0) {
                        logger.error('To date Invalid');
                        vm.toDateSetup = '';
                        vm.diffDays = 0;
                    }
                    else {
                        vm.diffDays = (toDate.diff(fromDate, 'days')) + 1;
                    }
                }
            }
            else {
                return;
            }

            //vm.diffDays = (toDate.diff(fromDate, 'days')) + 1;
        };
        $scope.func = function () {
            if (vm.formDateSetup === '' || vm.formDateSetup === undefined) {
                return;
            }
            else {
                $scope.date();
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
            $scope.pagination.pageNumber = 2;
            $scope.pagination.firstPage();
        };
        //***************End ServerSide Search********************************************

        var objcmnParam = {};
        $scope.gridOptions = [];
        $scope.pagination = {
            paginationPageSizes: [15, 25, 50, 75, 100, 500, 1000, 'All'],
            ddlpageSize: 15,
            pageNumber: 1,
            pageSize: 15,
            totalItems: 0,

            getTotalPages: function () {
                return Math.ceil(this.totalItems / this.pageSize);
            },
            pageSizeChange: function () {
                if (this.ddlpageSize === 'All') {

                    this.pageSize = $scope.pagination.totalItems;
                }
                else {
                    this.pageSize = this.ddlpageSize;
                }

                this.pageNumber = 1;
                $scope.getHrmHolidaysList(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    $scope.getHrmHolidaysList(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    $scope.getHrmHolidaysList(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    $scope.getHrmHolidaysList(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    $scope.getHrmHolidaysList(1);
                }
            }
        };
        $scope.getHrmHolidaysList = function (isPaging) {


            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line




            $scope.gridOptions.enableFiltering = true;

            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();            
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID;
            objcmnParam.HoliDaySetupID = 0;
            objcmnParam.PageNo = ($scope.pagination.pageNumber - 1) * $scope.pagination.pageSize;
            objcmnParam.RowCountPerPage = $scope.pagination.pageSize;
            objcmnParam.IsPaging = isPaging;
            objcmnParam.LoggedUser = $localStorage.userInfo[0].UserID;
            objcmnParam.SearchProperty = $scope.IsCallFromSearch === true ? $scope.SearchProperty : '';

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
                enableGridMenu: true,
                rowTemplate: '<div ng-dblclick="grid.appScope.editHolidaysByID(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                columnDefs: [
                    { name: 'InstituteName', displayName: 'Institute', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'YearName', displayName: 'Year', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'HoliDayName', displayName: 'Holiday', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'DateFrom', displayName: 'From Date', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'DateTo', displayName: 'To Date', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'TotalDays', displayName: 'Total Days', headerCellClass: $scope.highlightFilteredHeader },
                    {
                        name: 'Option',
                        displayName: 'Option',
                        width: '18%',
                        pinnedRight: true,
                        enableColumnResizing: false,
                        enableFiltering: false,
                        enableSorting: false,
                        headerCellClass: $scope.highlightFilteredHeader,
                        visible: true,
                        cellTemplate: '<button class="label label-success label-mini" style="background-color:#0aa699; color:white">' +
                        '<a href="javascript:void(0);" data-toggle="modal" data-dismiss="modal" style="background-color:#0aa699; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editHolidaysByID(row.entity)">' +
                        '<i class="fa fa-edit" aria-hidden="true">&nbsp;Edit</i></a></button>' +

                        '<button class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                        '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteModels(row.entity)">' +
                        '<i class="fa fa-trash" aria-hidden="true">&nbsp;Delete</i></a></button>'
                    }
                ],
                //enableGridMenu: true,
                //enableSelectAll: true,
                exporterCsvFilename: 'BankAccount.csv',
                exporterPdfDefaultStyle: { fontSize: 9 },
                exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
                exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
                exporterPdfHeader: { text: 'Account List', style: 'headerStyle' },
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
                exporterExcelFilename: 'BankAccount.xlsx',
                exporterExcelSheetName: 'Sheet1'
            };

            var funcName = '/getHrmHolidaysList';
            var data = [];
            leaveService.getHolidaysListByInstituteId(objcmnParam)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.pagination.totalItems = data[0].RecordTotal;
                        $scope.gridOptions.data = data;
                    }
                    else {
                        logger.error('Your desired data not found');
                    }
                    $scope.loaderMore = false;
                });
        };
        $scope.RefreshList = function () {
            $scope.pagination.pageNumber = 1;
            $scope.getHrmHolidaysList(0);
            //$scope.mod = true;
            $scope.showItem = false;
        };
        //************************************************End Grid******************************************************

        $scope.editHolidaysByID = function (model) {


            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            $scope.UpdateItem = true;
            $scope.showItem = false;
            $scope.createItem = true;
            vm.HoliDaySetupID = model.HoliDaySetupID;
            var params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                HoliDaySetupID: model.HoliDaySetupID,
                LoggedUser: $localStorage.userInfo[0].UserID,
                PageNo: 1,
                RowCountPerPage: 0,
                IsPaging: 0,
                SearchProperty: ''
            };
            return leaveService.getHolidaysListByInstituteId(params)
                .then(function (data) {

                    vm.Holidays = data;
                    vm.diffDays = data[0].TotalDays;
                    vm.holiday = {
                        selected: vm.Holidays.filter(function (ob, i) {
                            return (ob.HolidayID === data[0].HolidayID);
                        })[0]
                    };
                    vm.year = {
                        selected: vm.Holidays.filter(function (ob, i) {
                            return (ob.YearID === data[0].YearID);
                        })[0]
                    };

                    vm.formDateSetup = data[0].DateFrom;
                    vm.toDateSetup = data[0].DateTo;
                    vm.IsActive = data[0].IsActive;

                });
        };

        $scope.deleteModels = function (model) {



            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)); //jshint ignore : line



            leaveService.deleteHrmHoliday({
                InstituteID: $localStorage.userInfo[0].InstituteID,
                HoliDaySetupID: model.HoliDaySetupID,
                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                    $scope.RefreshList();
                })
                .catch(function (error) { });

        };

        vm.postHolidays = function () {


            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            leaveService.setCmnHolidays({
                'HoliDaySetupID': vm.HoliDaySetupID > 0 ? vm.HoliDaySetupID : 0,
                'HoliDaySetupNo': '0',
                'HolidayID': vm.holiday.selected.HolidayID,
                'Description': 'DEMO',
                'DateFrom': vm.formDateSetup,
                'DateTo': vm.toDateSetup,
                'TotalDays': vm.diffDays,
                'InstituteID': $localStorage.userInfo[0].InstituteID,
                'YearID': parseInt(vm.year.selected.YearID),
                'IsActive': vm.IsActive === false ? 0 : 1,
                'StatusID': 1,
                'CreateBy': 0,
                'CreateOn': '',
                'CreatePc': 'lol',
                'UpdateBy': 20,
                'UpdateOn': '',
                'UpdatePc': 'ME',
                'IsDeleted': 0,
                'DeleteBy': 5,
                'DeleteOn': '',
                'DeletePc': 'ME'
            })
                .then(function (data) {
                    logger.info('Saved!');

                    $state.go($state.current.name, {}, { reload: true });
                })
                .catch(function (error) { });


        };

        $scope.switchIsActive = function (e) {

            if (e === true) {
                $scope.subjectArr[$scope.subjectindex].IsActive = 1;
            } else {
                $scope.subjectArr[$scope.subjectindex].IsActive = 0;
            }

        };

        activate();

        function activate() {
            var promises = [getHolidayName(), getCmnYears()];
            return $q.all(promises).then(function () { });
        }

        function getHolidayName() {

            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
            };
            return leaveService.getHolidaysByInstituteId(Params)
                .then(function (data) {
                    vm.holidayNames = data;

                });
        }

        function getCmnYears() {

            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return leaveService.getCmnYear()
                .then(function (data) {
                    vm.years = data;

                });
        }

    }
})();
