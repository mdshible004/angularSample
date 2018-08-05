(function () {
    'use strict';

    angular
        .module('app.bankAccountSeetting')
        .controller('bankAccountSeettingController', bankAccountSeettingController);

    bankAccountSeettingController.$inject = ['bankAccountService', 'commonService', 'chartOfAccountsService', 'journalService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function bankAccountSeettingController(bankAccountService, commonService, chartOfAccountsService, journalService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

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


        vm.AccountID = 0;


        //$scope.cmnParam = function () { objcmnParam = conversion.cmnParams(); }
        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.IsVisible = false;
        $scope.itemEvent = function () {
            $scope.IsVisible = $scope.IsVisible ? false : true;
            if ($scope.IsVisible === true) {
                $scope.showItem = true;
                $scope.createItem = false;
            }
            else {
                $scope.showItem = false;
                $scope.createItem = true;
                $scope.clearField();
            }
        };

        $scope.switch = function (isDefault) {

            if (isDefault === true) {
                vm.IsDefault = true;
            }
            else {
                vm.IsDefault = false;
            }
        };
        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        $scope.Save = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line

            vm.IsDefault = vm.IsDefault === true ? 1 : 0;
            vm.CustomCode = vm.CustomCode === undefined || vm.CustomCode === '' || vm.CustomCode === null ? '' : vm.CustomCode;
            vm.Branch = vm.Branch === undefined || vm.Branch === null || vm.Branch === '' ? '' : vm.Branch;
            var funcName = '/setBankAccount';
            return bankAccountService.postModels(funcName, vm)
                .then(function (data) {
                    if (data[0].ReturnValue === 1) {
                        if (vm.AccountID === 0) {
                            logger.info('Saved Successfully');
                        }
                        else {
                            logger.info('Update Successfully');
                        }
                        //getAllBankAccount(0);
                        $scope.clearField();
                    }
                });
        };

        $scope.editModels = function (model) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            vm.AccountID = model.AccountID;
            var funcName = '/getBankAccountByID';
            return bankAccountService.getModelsByID(funcName, vm)
                .then(function (data) {
                    vm.AccountID = data[0].AccountID;
                    vm.BankID = data[0].BankID;
                    vm.bank = { selected: vm.AllBanks.filter(function (ob, i) { return (ob.BankID === data[0].BankID); })[0] };
                    vm.AccountTypeID = data[0].AccountTypeID;
                    vm.type = { selected: vm.AllBankAccountType.filter(function (ob, i) { return (ob.AccountTypeID === data[0].AccountTypeID); })[0] };
                    vm.COAID = data[0].COAID;
                    vm.CL = { selected: vm.COAList.filter(function (ob, i) { return (ob.COAID === data[0].COAID); })[0] };
                    vm.Branch = data[0].BankBranch;
                    vm.CustomCode = data[0].CustomCode;
                    vm.AccountName = data[0].AccountName;
                    vm.AccountNo = data[0].AccountNo;
                    vm.IsDefault = data[0].IsDefault;
                    $scope.showItem = false;
                    $scope.createItem = true;
                    $scope.IsVisible = false;
                });
        };

        $scope.deleteModels = function (model) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)); //jshint ignore : line


            vm.AccountID = model.AccountID;
            var funcName = '/deleteBankAccountByID';
            return bankAccountService.postModels(funcName, vm)
                .then(function (data) {
                    if (data[0].ReturnValue === 1) {
                        logger.info('Deleted Successfully');
                        //getAllBankAccount(0);
                        //$scope.clearField();
                    }
                });
        };

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

        //************************************************Start Grid******************************************************
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
                getAllBankAccount(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    getAllBankAccount(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    getAllBankAccount(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    getAllBankAccount(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    getAllBankAccount(1);
                }
            }
        };
        function getAllBankAccount(isPaging) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            $scope.gridOptions.enableFiltering = true;

            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();            
            objcmnParam.pageNumber = ($scope.pagination.pageNumber - 1) * $scope.pagination.pageSize;
            objcmnParam.pageSize = $scope.pagination.pageSize;
            objcmnParam.IsPaging = isPaging;
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID;
            objcmnParam.LoggedUserID = $localStorage.userInfo[0].UserID;
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
                rowTemplate: '<div ng-dblclick="grid.appScope.editModels(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                columnDefs: [
                    { name: 'AccountID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'BankID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'COAID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'AccountTypeID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'CustomCode', displayName: 'Custom Code', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'AccountNo', displayName: 'Account No', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'BankBranch', displayName: 'Branch', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'AccountName', displayName: 'Account Name', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'AccountTypeName', displayName: 'Account Type', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'COAName', displayName: 'Account Head', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'IsDefault', displayName: 'Is Default', headerCellClass: $scope.highlightFilteredHeader },
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
                        cellTemplate: '<button class="label label-success label-mini" style="background-color:#0aa699">' +
                        '<a href="javascript:void(0);" data-toggle="modal" style="background-color:#0aa699; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editModels(row.entity)">' +
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

            var funcName = '/getAllBankAccount';
            return bankAccountService.getModelsByID(funcName, objcmnParam)
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
        }
        //************************************************End Grid******************************************************

        activate();

        function activate() {
            var promises = [getAllBank(), getAllBankAccountType(), loadCOAList(), getAllBankAccount(0), getWorkFlow()];
            return $q.all(promises).then(function () {
            });
        }

        //*************** WorkFlow Start********************** */

        function getWorkFlow() {
            var params = { menuID: vm.menuId, instituteId: vm.InstituteID };
            return commonService.getWorkFlow(params).then(function (data) {
                //console.log(data);
            });
        }

         //*************** WorkFlow Start********************** */

        function getAllBank() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var funcName = '/getAllBanks';
            return bankAccountService.getModels(funcName)
                .then(function (data) {
                    vm.AllBanks = data;
                });
        }

        function getAllBankAccountType() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var funcName = '/getAllBankAccountType';
            return bankAccountService.getModels(funcName)
                .then(function (data) {
                    vm.AllBankAccountType = data;
                });
        }
        function loadCOAList() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            return journalService.getCOAList()
                .then(function (data) {
                    vm.COAList = data;
                });
        }
    }
})();

