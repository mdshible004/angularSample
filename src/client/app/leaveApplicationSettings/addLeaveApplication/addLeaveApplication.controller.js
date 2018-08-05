(function () {
    'use strict';

    angular
        .module('app.leaveApplicationSettings')
        .controller('LeaveApplicationSettingsController', LeaveApplicationSettingsController);

    LeaveApplicationSettingsController.$inject = ['leaveService', 'mailSettings', 'commonService', 'subjectSettingsSevice', 'branchSettings', 'mediumsetting', 'classSettings', 'teacherAttendanceSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function LeaveApplicationSettingsController(leaveService, mailSettings, commonService, subjectSettingsSevice, branchSettings, mediumsetting, classSettings, teacherAttendanceSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {



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
                var d = new Date();
                var n = d.getFullYear();
                var fromDate = moment(vm.formDateSetup, 'M-D-YYYY'); //jshint ignore : line
                var toDate = moment(vm.toDateSetup, 'M-D-YYYY'); //jshint ignore : line
                var fromYear = parseInt(vm.formDateSetup.split('-')[2]);
                var toYear = parseInt(vm.toDateSetup.split('-')[2]);
                var ssYear = n;
                if (ssYear > toYear && ssYear > fromYear) {
                    logger.error('Year should be bigger than ' + ssYear);
                    vm.formDateSetup = '';
                    vm.toDateSetup = '';
                    vm.diffDays = 0;
                }
                else {
                    if ((toYear - ssYear) > 1 || (fromYear - ssYear) > 1) {
                        logger.error('Applied year should be smaller than ' + (ssYear + 2));
                        (toYear - ssYear) > 1 ? vm.toDateSetup = '' : vm.toDateSetup = vm.toDateSetup; //jshint ignore : line
                        (fromYear - ssYear) > 1 ? vm.formDateSetup = '' : vm.formDateSetup = vm.formDateSetup; //jshint ignore : line
                        vm.diffDays = 0;
                        return;
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
            }
            else {
                return;
            }

            //vm.diffDays = (toDate.diff(fromDate, 'days')) + 1;
        };

        $scope.apDate = function () {
            if (vm.aToDateSetup !== undefined && vm.aFormDateSetup !== undefined) {
                var d = new Date();
                var n = d.getFullYear();
                var fromDate = moment(vm.aFormDateSetup, 'M-D-YYYY'); //jshint ignore : line
                var toDate = moment(vm.aToDateSetup, 'M-D-YYYY'); //jshint ignore : line
                var fromYear = parseInt(vm.aFormDateSetup.split('-')[2]);
                var toYear = parseInt(vm.aToDateSetup.split('-')[2]);
                var ssYear = n;
                if (ssYear > toYear && ssYear > fromYear) {
                    logger.error('Approved year should be bigger than ' + ssYear);
                    vm.aFormDateSetup = '';
                    vm.aToDateSetup = '';
                    vm.diffDaysApproved = 0;
                }
                else {

                    if ((toYear - ssYear) > 1 || (fromYear - ssYear) > 1) {
                        logger.error('Approved year should be smaller than ' + (ssYear + 2));
                        (toYear - ssYear) > 1 ? vm.aToDateSetup = '' : vm.aToDateSetup = vm.aToDateSetup; //jshint ignore : line
                        (fromYear - ssYear) > 1 ? vm.aFormDateSetup = '' : vm.aFormDateSetup = vm.aFormDateSetup; //jshint ignore : line
                        vm.diffDaysApproved = 0;
                        return;
                    }
                    else {
                        if (toDate.diff(fromDate, 'days') < 0) {
                            logger.error('Approve To date Invalid');
                            vm.aToDateSetup = '';
                            vm.diffDaysApproved = 0;
                        }
                        else {
                            vm.diffDaysApproved = (toDate.diff(fromDate, 'days')) + 1;
                        }
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
                $scope.getHrmLeaveApplication(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    $scope.getHrmLeaveApplication(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    $scope.getHrmLeaveApplication(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    $scope.getHrmLeaveApplication(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    $scope.getHrmLeaveApplication(1);
                }
            }
        };
        $scope.getHrmLeaveApplication = function (isPaging) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            $scope.gridOptions.enableFiltering = true;

            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();            
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID;
            objcmnParam.ApplicationID = 0;
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
                rowTemplate: '<div ng-dblclick="grid.appScope.editHrmLeaveApplication(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                columnDefs: [
                    { name: 'ApplicationDate', displayName: 'ApplicationDate', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'UserFullName', displayName: 'Applicant', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'LeaveType', displayName: 'LeaveType', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Responsible_Person', displayName: 'Responsible_Person', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Contact', displayName: 'Contact', headerCellClass: $scope.highlightFilteredHeader },

                    //{ name: 'AppliedFrom', displayName: 'AppliedFrom', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    //{ name: 'AppliedTo', displayName: 'AppliedTo', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'AppliedLeaveDuration', displayName: 'AppliedDuration', headerCellClass: $scope.highlightFilteredHeader },
                    //{ name: 'ApprovedFrom', displayName: 'ApprovedFrom', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    //{ name: 'ApprovedTo', displayName: 'ApprovedTo', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'LeaveDuration', displayName: 'ApprovedDuration', headerCellClass: $scope.highlightFilteredHeader },
                    {
                        name: 'Option',
                        displayName: 'Option',
                        width: '20%',
                        pinnedRight: true,
                        enableColumnResizing: false,
                        enableFiltering: false,
                        enableSorting: false,
                        headerCellClass: $scope.highlightFilteredHeader,
                        visible: true,
                        cellTemplate: '<button class="label label-success label-mini" style="background-color:#0aa699; color:white">' +
                        '<a href="javascript:void(0);" data-toggle="modal" data-dismiss="modal" style="background-color:#0aa699; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editHrmLeaveApplication(row.entity)">' +
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

            var funcName = '/getHrmLeaveApplication';
            var data = [];
            leaveService.getHrmLeaveApplication(objcmnParam)
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
            $scope.getHrmLeaveApplication(0);
            //$scope.mod = true;
            $scope.showItem = true;
            $scope.createItem = false;
        };
        //************************************************End Grid******************************************************

        $scope.editHrmLeaveApplication = function (model) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            $scope.UpdateItem = true;
            $scope.showItem = false;
            $scope.createItem = true;
            vm.ApplicationID = model.ApplicationID;
            var params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                ApplicationID: vm.ApplicationID,
                LoggedUser: $localStorage.userInfo[0].UserID,
                PageNo: 1,
                RowCountPerPage: 0,
                IsPaging: 0,
                SearchProperty: ''
            };
            return leaveService.getHrmLeaveApplication(params)
                .then(function (data) {

                    vm.Applications = data;
                    //vm.ApplicationID = data[0].ApplicationID;
                    vm.Name = data[0].UserFullName;
                    vm.leaveType = {
                        selected: vm.Applications.filter(function (ob, i) {
                            return (ob.LeaveTypeID === data[0].LeaveTypeID);
                        })[0]
                    };

                    vm.UID = data[0].Responsible_personID;
                    $scope.UserID = data[0].ApplicantID;
                    vm.formDateSetup = data[0].AppliedFrom;
                    vm.toDateSetup = data[0].AppliedTo;
                    vm.diffDays = data[0].AppliedLeaveDuration;
                    vm.aFormDateSetup = data[0].ApprovedFrom;
                    vm.aToDateSetup = data[0].ApprovedTo;
                    vm.diffDaysApproved = data[0].LeaveDuration;
                    vm.reason = data[0].Reason;
                    vm.contact = data[0].Contact;
                    vm.ResName = data[0].Responsible_Person;
                    vm.description = data[0].Description;
                    vm.ApplicationDate = data[0].ApplicationDate;

                });
        };

        $scope.deleteModels = function (model) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)); //jshint ignore : line



            leaveService.deleteHrmLeaveApplication({
                InstituteID: $localStorage.userInfo[0].InstituteID,
                ApplicationID: model.ApplicationID,
                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                    $scope.RefreshList();
                })
                .catch(function (error) { });

        };
        vm.ApplicationID = 0;
        vm.ApplicationDate = '';
        vm.setHrmLeaveApplication = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            leaveService.setHrmLeaveApplication({
                'ApplicationID': vm.ApplicationID,
                'CustomCode': '0',
                'Description': vm.description,
                'ApplicationDate': vm.ApplicationDate,
                'ApplicantID': $scope.UserID,
                'LeaveTypeID': vm.leaveType.selected.LeaveTypeID,
                'ReplacingEmpID': vm.UID,
                'AppliedFromDate': vm.formDateSetup,
                'AppliedToDate': vm.toDateSetup,
                'AppliedLeaveDuration': vm.diffDays,
                'FromDate': vm.aFormDateSetup,
                'ToDate': vm.aToDateSetup,
                'LeaveDuration': vm.diffDaysApproved,
                'ContactDuringLeave': vm.contact,
                'Reason': vm.reason,
                'InstituteID': $localStorage.userInfo[0].InstituteID,
                'IsApproved': 1,
                'StatusID': 0,
                'LoggedUserID': $localStorage.userInfo[0].UserID
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
            var promises = [getHolidayName(), getCmnYears(), getLeaveType()];
            return $q.all(promises).then(function () { });
        }

        function getHolidayName() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod));//jshint ignore : line



            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
            };
            return leaveService.getHolidaysByInstituteId(Params)
                .then(function (data) {
                    vm.holidayNames = data;

                });
        }

        function getLeaveType() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
            };
            return leaveService.getLeaveTypeByInstituteId(Params)
                .then(function (data) {
                    vm.leaveTypes = data;

                });
        }

        function getCmnYears() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            return leaveService.getCmnYear()
                .then(function (data) {
                    vm.years = data;

                });
        }

        //***************End ServerSide Search********************************************

        //var objcmnParam = {};
        $scope.gridOptionsModal = [];
        $scope.paginationModal = {





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

                    this.pageSize = $scope.paginationModal.totalItems;
                }
                else {
                    this.pageSize = this.ddlpageSize;
                }

                this.pageNumber = 1;
                $scope.getHrmLeaveUserByUserID(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    $scope.getHrmLeaveUserByUserID(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    $scope.getHrmLeaveUserByUserID(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    $scope.getHrmLeaveUserByUserID(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    $scope.getHrmLeaveUserByUserID(1);
                }
            }
        };
        $scope.getHrmLeaveUserByUserID = function (isPaging) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            $scope.gridOptionsModal.enableFiltering = true;

            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();            
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID;
            objcmnParam.UserID = 0;
            objcmnParam.PageNo = ($scope.paginationModal.pageNumber - 1) * $scope.paginationModal.pageSize;
            objcmnParam.RowCountPerPage = $scope.paginationModal.pageSize;
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
            $scope.gridOptionsModal = {
                useExternalPagination: true,
                useExternalSorting: true,
                enableFiltering: true,
                enableRowSelection: true,
                enableSelectAll: true,
                showFooter: true,
                enableGridMenu: true,
                rowTemplate: '<div ng-dblclick="grid.appScope.editModelsss(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                columnDefs: [
                    { name: 'UserFullName', displayName: 'Name', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'PhoneNo', displayName: 'Phone', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'UserTypeName', displayName: 'UserType', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ClassName', displayName: 'Class', headerCellClass: $scope.highlightFilteredHeader },
                    {
                        name: 'Option',
                        displayName: 'Option',
                        width: '20%',
                        pinnedRight: true,
                        enableColumnResizing: false,
                        enableFiltering: false,
                        enableSorting: false,
                        headerCellClass: $scope.highlightFilteredHeader,
                        visible: true,
                        cellTemplate: '<button class="label label-success label-mini" style="background-color:#0aa699">' +
                        '<a href="javascript:void(0);" data-toggle="modal" data-dismiss="modal" style="background-color:#0aa699;color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editModelsss(row.entity)">' +
                        '<i class="fa fa-edit" aria-hidden="true">&nbsp;Select</i></a></button>'
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

            var funcName = '/getHrmLeaveUserByUserID';
            var data = [];
            leaveService.getHrmLeaveUserByUserID(objcmnParam)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.paginationModal.totalItems = data[0].RecordTotal;
                        $scope.gridOptionsModal.data = data;
                    }
                    else {
                        logger.error('Your desired data not found');
                    }
                    $scope.loaderMore = false;
                });
        };
        $scope.RefreshList1 = function () {
            $scope.paginationModal.pageNumber = 1;
            $scope.getHrmLeaveUserByUserID(0);
            $scope.showItem = false;
            vm.a = 1;
        };
        $scope.RefreshList2 = function () {
            $scope.paginationModal.pageNumber = 1;
            $scope.getHrmLeaveUserByUserID(0);
            $scope.showItem = false;
            vm.a = 2;
        };
        //************************************************End Grid******************************************************
        $scope.editModelsss = function (model) {
            if (vm.a === 1) {
                $scope.UserID = model.UserID;
                vm.Name = model.UserFullName;
            }
            else {
                vm.ResName = model.UserFullName;
                vm.UID = model.UserID;
            }

        };
    }
})();
