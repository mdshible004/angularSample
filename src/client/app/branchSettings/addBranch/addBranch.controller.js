(function () {
    'use strict';

    angular
        .module('app.branchSettings')
        .controller('branchSettingsController', branchSettingsController);

    branchSettingsController.$inject = ['mailSettings', 'branchSettingsSevice', 'classSettingsService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function branchSettingsController(mailSettings, branchSettingsSevice, classSettingsService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

        var vm = this;

        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.LoggedInstituteID = $localStorage.userInfo[0].InstituteID;
        vm.instituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration





        var objcmnParam = {};
        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.itemEvent = function () {
            //$scope.IsVisible = $scope.IsVisible ? false : true;
            $scope.showItem = true;
            $scope.createItem = false;
            $state.go($state.current.name, {}, { reload: true });

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

        vm.instituteSelected = function (e, status) {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.instituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            var params = {
                instituteId: e
            };

            branchSettingsSevice.getBranchByInstituteId(params)
                .then(function (data) {
                    //debugger;
                    vm.branchs = data;

                    if (status === 'Edit' && vm.ParentID !== null) {
                        vm.branche = {
                            selected: vm.branchs.filter(function (ob, i) {
                                return (ob.ParentID === vm.ParentID);
                            })[0]
                        };
                    }

                });
        };

        // post branch Settings


        vm.branchSettings = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.instituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            if (vm.BranchSetup.BrunchName === undefined || vm.instituteID === undefined) {
                logger.error('Please select Branch Name And Institute.');
            } else {

                branchSettingsSevice.postInsBranch({
                    BrunchID: 0,
                    BrunchNo: vm.BranchSetup.BrunchNo === undefined ? '' : vm.BranchSetup.BrunchNo,
                    BrunchName: vm.BranchSetup.BrunchName,
                    ParentID: vm.ParentID === undefined ? null : vm.ParentID,
                    InstituteID: vm.instituteID,
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
                            logger.info('save Successfully');
                            $scope.RefreshList();

                        }

                    })
                    .catch(function (error) { });
            }

        };


        $scope.editBranch = function (model) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.instituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            objcmnParam.InstituteID = model.InstituteID;
            //objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID === 1 ? 0 : $localStorage.userInfo[0].InstituteID;
            objcmnParam.LoggedUser = $localStorage.userInfo[0].UserID;
            objcmnParam.BrunchID = model.BrunchID;
            objcmnParam.PageNo = 0;
            objcmnParam.RowCountPerPage = 0;
            objcmnParam.IsPaging = 0;
            objcmnParam.SearchProperty = '';
            branchSettingsSevice.getAllBranchUI(objcmnParam)

                .then(function (data) {

                    vm.BranchSetup.BrunchID = undefined;
                    vm.BranchSetup.BrunchNo = undefined;
                    vm.BranchSetup.BrunchName = undefined;
                    vm.instituteID = undefined;
                    vm.ParentID = undefined;
                    vm.institute = undefined;
                    vm.branche = undefined;
                    vm.institute = undefined;

                    vm.BranchSetup.BrunchID = data[0].BrunchID;
                    vm.BranchSetup.BrunchNo = data[0].BrunchNo;
                    vm.BranchSetup.BrunchName = data[0].BrunchName;
                    vm.instituteID = data[0].InstituteID;                
                    vm.ParentID = data[0].ParentID;
                    getAllInstitute('Edit');
                })
                .catch(function (error) { });
        };

        vm.UpdateBranch = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.instituteID, vm.LoggedUserID, vm.menuId, vm.putMethod)); //jshint ignore : line


            if (vm.institute.selected.InstituteID === undefined || vm.BranchSetup.BrunchName === '') {
                logger.error('Please select Institute and Branch Name.');
            } else {

                branchSettingsSevice.postInsBranch({
                    BrunchID: vm.BranchSetup.BrunchID,
                    BrunchNo: vm.BranchSetup.BrunchNo,
                    BrunchName: vm.BranchSetup.BrunchName,
                    ParentID: vm.ParentID === undefined ? null : vm.ParentID,
                    InstituteID: vm.institute.selected.InstituteID,
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
                        logger.info('update Successfully');
                        $scope.RefreshList();
                    })
                    .catch(function (error) { });
            }

        };

        $scope.deleteBranch = function (model) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.instituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)); //jshint ignore : line


            branchSettingsSevice.deleteInsBranches({
                BrunchID: model.BrunchID,
                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                    $scope.RefreshList();
                })
                .catch(function (error) { });

        };




        //$scope.ShowBranch = function () {
        //    $scope.showItem = true;
        //    $scope.createItem = false;
        //    branchSettingsSevice.getBranchB()
        //        .then(function (data) {
        //            vm.branches = data;
        //        });
        //};

        activate();

        function activate() {
            var promises = [getAllInstitute('')];
            return $q.all(promises).then(function () {
            });
        }
        
        function getAllInstitute(status) {
            //debugger;
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.instituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line
            
            return mailSettings.getAllInstitutes()
                .then(function (data) {
                    //debugger;
                    vm.institutes = data;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };
                    vm.instituteSelected(vm.instituteID, status);
                });

        }

        //************************************************Start Grid******************************************************
        //*************ServerSide Search****************
        $scope.SearchProperty = '';
        $scope.IsCallFromSearch = false;
        $scope.SearchCancel = function () {
            $scope.SearchProperty = '';
            $scope.SearchNow($scope.SearchProperty);
        };

        $scope.SearchNow = function (searchstring) {
            ////debugger;
            $scope.IsCallFromSearch = searchstring === '' ? false : true;
            $scope.SearchProperty = searchstring.toString();
            $scope.pagination.pageNumber = 2;
            $scope.pagination.firstPage();
        };


        //*************ServerSide Search****************

        //var objcmnParam = {};
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
                vm.getAllBranch(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    vm.getAllBranch(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    vm.getAllBranch(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    vm.getAllBranch(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    vm.getAllBranch(1);
                }
            }
        };
        vm.getAllBranch = function (isPaging) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.instituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            $scope.gridOptions.enableFiltering = true;

            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID === 1 ? 0 : $localStorage.userInfo[0].InstituteID;
            objcmnParam.LoggedUser = $localStorage.userInfo[0].UserID;
            objcmnParam.BrunchID = 0;
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
                rowTemplate: '<div ng-dblclick="grid.appScope.getInstituteByID(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                columnDefs: [
                    { name: 'InstituteID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'BrunchNo', displayName: 'Branch No', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'BrunchName', displayName: 'Branch Name', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ParentBranch', displayName: 'Parent Branch', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Institute', displayName: 'Institute', headerCellClass: $scope.highlightFilteredHeader },
                    //{ name: 'InstituteTypeName', displayName: 'Institute Type', headerCellClass: $scope.highlightFilteredHeader },
                    // { name: 'Status', displayName: 'Status', headerCellClass: $scope.highlightFilteredHeader },
                    //{ name: 'IsActive', displayName: 'IsActive', headerCellClass: $scope.highlightFilteredHeader },

                    {
                        name: 'Option',
                        displayName: 'Option',
                        width: '12%',
                        pinnedRight: true,
                        enableColumnResizing: false,
                        enableFiltering: false,
                        enableSorting: false,
                        headerCellClass: $scope.highlightFilteredHeader,
                        visible: true,
                        cellTemplate: '<button class="label label-success label-mini" style="background-color:#0aa699">' +
                        '<a href="javascript:void(0);"  style="background-color:#0aa699; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editBranch(row.entity)">' +
                        '<i class="fa fa-edit"   data-toggle="modal" data-target="#myModal" aria-hidden="true">&nbsp;Edit</i></a></button>' +

                        '<button class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                        '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteBranch(row.entity)">' +
                        '<i class="fa fa-trash" aria-hidden="true">&nbsp;Delete</i></a></button>'
                    }
                ],
                //enableGridMenu: true,
                //enableSelectAll: true,
                //---------------------------
                exporterCsvFilename: 'ProductList.csv',
                exporterPdfDefaultStyle: { fontSize: 9 },
                exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
                exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
                exporterPdfHeader: { text: 'Product List', style: 'headerStyle' },
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
                exporterExcelFilename: 'Product.xlsx',
                exporterExcelSheetName: 'Sheet1',

                exporterAllDataFn: function () {
                    var getPage = 0;
                    var paginationOptions = {};
                    return getPage(1, $scope.gridOptions.totalItems, paginationOptions.sort)
                        .then(function () {
                            $scope.gridOptions.useExternalPagination = false;
                            $scope.gridOptions.useExternalSorting = false;
                            getPage = null;
                        });
                },
            };


            return branchSettingsSevice.getAllBranchUI(objcmnParam)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.pagination.totalItems = data[0].RecordTotal;
                        $scope.gridOptions.data = data;


                    }
                    else {
                        logger.error('Your desired data not found');
                    }
                    //$scope.loaderMore = false;
                });
        };

        $scope.RefreshList = function () {
            //$scope.UpdateItem = false;
            //$('#myModal1').modal('show');
            $scope.pagination.pageNumber = 1;
            vm.getAllBranch(0);

            $scope.createItem = false;
            $scope.showItem = true;

        };

        //************************************************Start Grid******************************************************

    }
})();

