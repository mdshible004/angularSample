(function () {
    'use strict';

    angular
        .module('app.chartOfAccounts')
        .controller('ChartOfAccountsController', ChartOfAccountsController);

    ChartOfAccountsController.$inject = ['chartOfAccountsService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function ChartOfAccountsController(chartOfAccountsService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

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


        // Create and Show list Container Hide or Show Logic
        $scope.createItem = true;
        $scope.showItem = false;
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        $scope.listEvent = function () {
            $scope.createItem = true;
            $state.go($state.current.name, {}, { reload: true });
        };



        vm.AddCOASetting = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            if (vm.COATypeID === undefined || vm.COASetup.Account === undefined) {
                logger.error('Please Select Head Type and Account Head');
            } else {

                chartOfAccountsService.postChartOfAccount({
                    COAID: $scope.COAID === undefined ? 0 : $scope.COAID,
                    COATypeID: vm.COATypeID,
                    COAName: vm.COASetup.Account,
                    ParentID: vm.ParentID === undefined ? null : vm.ParentID,
                    InstituteID: $localStorage.userInfo[0].InstituteID,
                    LoggedUserID: $localStorage.userInfo[0].UserID,
                    IsCash: vm.IsCash === undefined ? 0 : vm.IsCash,
                    IsDefaultCash: vm.IsDefaultCash === undefined ? 0: vm.IsDefaultCash
                })

                    .then(function (data) {
                        logger.info('Saved!');
                        //$scope.RefreshList();
                        $state.go($state.current.name, {}, { reload: true });
                        //$scope.itemEvent();
                    })
                    .catch(function (error) { });
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
                $scope.itemEvent(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    $scope.itemEvent(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    $scope.itemEvent(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    $scope.itemEvent(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    $scope.itemEvent(1);
                }
            }
        };
        $scope.itemEvent = function (isPaging) {
            $scope.gridOptions.enableFiltering = true;

            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();  
            objcmnParam.InsId = $localStorage.userInfo[0].InstituteID; //$localStorage.userInfo[0].InstituteID;
            objcmnParam.CoaID = 0;
            objcmnParam.CoaTypeId = 0;
            objcmnParam.LoggedUser = $localStorage.userInfo[0].UserID;        
            objcmnParam.PageNo = ($scope.pagination.pageNumber - 1) * $scope.pagination.pageSize;
            objcmnParam.RowCountPerPage = $scope.pagination.pageSize;
            objcmnParam.IsPaging = isPaging;
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
                    { name: 'COAName', displayName: 'COAName', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'COATypeName', displayName: 'COAType', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'COANameParent', displayName: 'COAParent',  headerCellClass: $scope.highlightFilteredHeader },
                   
                    {
                        name: 'Option',
                        displayName: 'Option',
                        width: '16%',
                        pinnedRight: true,
                        enableColumnResizing: false,
                        enableFiltering: false,
                        enableSorting: false,
                        headerCellClass: $scope.highlightFilteredHeader,
                        visible: true,
                        cellTemplate: '<button class="label label-success label-mini" style="background-color:#0aa699">' +
                        '<a href="javascript:void(0);" data-toggle="modal" data-target="#myModal" data-dismiss="modal" style="background-color:#0aa699; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.COASettings(row.entity)">' +
                        '<i class="fa fa-edit" aria-hidden="true">&nbsp;Select</i></a></button>' +

                        '<span class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                        '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteCOA(row.entity)">' +
                        '<i class="fa fa-trash" aria-hidden="true">&nbsp;Delete</i></a></span>'
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

            //var funcName = '/getAllStudent';
            var data = [];
            return chartOfAccountsService.getChartOfAccForUiGrid(objcmnParam)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.pagination.totalItems = data[0].RecordTotal;
                        $scope.gridOptions.data = data;
                       
                        //vm.registrationSetup = data;

                    }
                    else {
                        logger.error('Your desired data not found');
                    }
                    //$scope.loaderMore = false;
                });
        };
        $scope.RefreshList = function () {
             //$scope.createItem = true;
            // $scope.showItem = true;
             $scope.GridShowDetails = true;
            $scope.pagination.pageNumber = 1;
            $scope.itemEvent(0);
        };
        //************************************************End Grid******************************************************


        

        var FuncName = '';
        $scope.COASettings = function (model) {
           
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            //$scope.index = index;
            var COAParams = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                COAID: model.COAID

            };
            chartOfAccountsService.getChartOfAccountBycoaID(COAParams)

                .then(function (data) {

                    $scope.COAID = data[0].COAID;
                    vm.COASetup.Id = data[0].COAID;
                    vm.COASetup.Account = data[0].COAName;
                    vm.ParentID = data[0].ParentID;
                    vm.COATypeID = data[0].COATypeID;
                    vm.IsDefaultCash = data[0].IsDefaultCash;
                    vm.IsCash = data[0].IsCash;
                    FuncName = 'Edit';
                    
                    vm.COA = {
                        selected: vm.coaType.filter(function (ob, i) {
                            return (ob.COATypeID === data[0].COATypeID);
                        })[0]
                    };
                    vm.HeadSelected(vm.COATypeID);
                });
        };



        $scope.deleteCOA = function (model) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)); //jshint ignore : line


            chartOfAccountsService.deleteChartOfAccount({
                COAID: model.COAID,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                     $scope.loaderMore = false;
                    logger.info('Delete Successfully!');
                    $scope.RefreshList();
                    $scope.GridShowDetails = true;
                    //$scope.itemEvent();
                })
                .catch(function (error) { });

        };

        vm.patchCOA = function () {
            
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.putMethod)); //jshint ignore : line


            chartOfAccountsService.postChartOfAccount({
                COAID: vm.COASetup.Id,
                COATypeID: vm.COATypeID,
                COAName: vm.COASetup.Account,
                ParentID: vm.ParentID === undefined ? null : vm.ParentID,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                LoggedUserID: $localStorage.userInfo[0].UserID,
                IsCash: vm.COASetup.IsCash,
                IsDefaultCash: vm.COASetup.IsDefaultCash
            })

                .then(function (data) {
                    
                    logger.info('Updated Successfully!');
                    $scope.createItem = true;
                    //$scope.RefreshList();
                    //$scope.GridShowDetails = true;
                })
                .catch(function (error) { });

        };




        vm.HeadSelected = function (headtypeID) {
            // console.log(vm.COA.selected.COATypeID);

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            vm.coaByType = null;
            var params = {
                Insid: $localStorage.userInfo[0].InstituteID,
                COATypeID: headtypeID
            };
            return chartOfAccountsService.getChartOfAccForParentDDL(params)
                .then(function (data) {
                    vm.coaByTypeID = data;
                    if (FuncName === 'Edit') {
                        vm.coaByType = {
                            selected: vm.coaByTypeID.filter(function (ob, i) {
                                return (ob.COAID === vm.ParentID);
                            })[0]
                        };
                        FuncName = '';
                    }

                });


        };

        activate();

        function activate() {
            var promises = [getCOATypeByInsID()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }
        function getCOATypeByInsID() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var params = {
                Insid: $localStorage.userInfo[0].InstituteID
            };
            return chartOfAccountsService.getChartOfAccountTypeByInsID(params)
                .then(function (data) {
                    vm.coaType = data;


                });
        }




    }
})();
