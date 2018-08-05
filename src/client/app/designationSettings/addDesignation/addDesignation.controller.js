(function () {
    'use strict';

    angular
        .module('app.designationSettings')
        .controller('designationSettingsController', designationSettingsController);

    designationSettingsController.$inject = ['mailSettings', 'designationSettings', 'branchSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$window', '$localStorage'];
    /* @ngInject */
    function designationSettingsController(mailSettings, designationSettings, branchSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $window, $localStorage) {


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




        var objcmnParam = {};
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

        // post mail Settings

        vm.designationSettings = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            if (vm.instituteID === undefined || vm.designationSetup.DesignationName === undefined) {
                logger.error('Please select Designation Name and Institute');
            } else {
                designationSettings.postDesignation({
                    UserDesignationID: 0,
                    DesignationName: vm.designationSetup.DesignationName,
                    StatusID: 0,
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
                        if (data[0].ReturnValue === 'Duplicate') {
                            logger.error('Designation Already Exists.....!');
                        } else {
                            logger.info('Saved!');
                            $state.go($state.current.name, {}, { reload: true });
                            getDesignation();

                        }


                    })
                    .catch(function (error) { });
            }
        };

        $scope.editDesignation = function (model) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            objcmnParam.InstituteID = model.InstituteID;
            objcmnParam.UserDesignationID = model.UserDesignationID;
            objcmnParam.LoggedUserID = $localStorage.userInfo[0].UserID;
            objcmnParam.pageNumber = 1;
            objcmnParam.pageSize = 1;
            objcmnParam.IsPaging = 1;
            objcmnParam.SearchProperty = '';

            designationSettings.getAllDesignation(objcmnParam)
                .then(function (data) {
                    vm.designationSetup.DesignationName = data[0].DesignationName;
                    vm.designationSetup.StatusID = data[0].StatusID;
                    vm.designationSetup.UserDesignationID = data[0].UserDesignationID;
                    // logger.info('Saved!');
                    //$state.transitionTo('deliverypartner.listpartner');

                    vm.institute = {
                        selected: vm.institutes.filter(function (ob, i) {
                            return (ob.InstituteName === data[0].InstituteName);
                        })[0]
                    };
                })
                .catch(function (error) { });
            //console.log(vm.parents);
        };

        vm.UpdateDesignation = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line

            if (vm.institute.selected === undefined || vm.designationSetup.DesignationName === '') {
                logger.error('Please select Designation Name and Institute');
            } else {
                designationSettings.postDesignation({
                    UserDesignationID: vm.designationSetup.UserDesignationID,
                    DesignationName: vm.designationSetup.DesignationName,
                    StatusID: 0,
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

                        if (data[0].ReturnValue === 'Duplicate') {
                            logger.error('Designation Already Exists.....!');
                        } else {
                            $scope.RefreshList();
                            logger.info('Update Successfully!');
                            // $state.go($state.current.name, {}, { reload: true });
                            getDesignation();
                            $('#myModal').modal('hide'); //jshint ignore : line


                        }

                    })
                    .catch(function (error) { });
            }

        };
        $scope.deleteDesignation = function (model) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)); //jshint ignore : line


            designationSettings.deleteUserDesignation({
                UserDesignationID: model.UserDesignationID,
                InstituteID: model.InstituteID,
                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                    $scope.RefreshList();
                })
                .catch(function (error) { });

        };



        activate();

        function activate() {
            var promises = [getAllInstitute(), getDesignation()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        function getAllInstitute() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return mailSettings.getAllInstitutes()
                .then(function (data) {
                    vm.institutes = data;
                    vm.instituteID = vm.InstituteID;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.InstituteID); })[0] };

                });
        }
        function getDesignation() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return designationSettings.getAllDesignations()
                .then(function (data) {
                    vm.designations = data;
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
            //debugger;
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
                vm.getAllDesignations(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    vm.getAllDesignations(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    vm.getAllDesignations(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    vm.getAllDesignations(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    vm.getAllDesignations(1);
                }
            }
        };
        vm.getAllDesignations = function (isPaging) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            if (vm.institute.selected === undefined) {
                $scope.createItem = true;
                //$scope.showItem = false;
                $('#myModal').modal('hide'); //jshint ignore : line
                logger.error('Please Select an Institute.');

            } else {

                $scope.gridOptions.enableFiltering = true;

                $scope.loaderMore = true;
                $scope.lblMessage = 'loading please wait....!';
                $scope.result = 'color-red';
                //$scope.cmnParam();
                objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID === 1 ? 0 : $localStorage.userInfo[0].InstituteID;
                objcmnParam.UserDesignationID = 0;
                objcmnParam.LoggedUserID = 10;
                objcmnParam.pageNumber = ($scope.pagination.pageNumber - 1) * $scope.pagination.pageSize;
                objcmnParam.pageSize = $scope.pagination.pageSize;
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
                    rowTemplate: '<div ng-dblclick="grid.appScope.editDesignation(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                    columnDefs: [
                        { name: 'UserDesignationID', visible: false, headerCellClass: $scope.highlightFilteredHeader },

                        { name: 'DesignationName', displayName: 'DesignationName', headerCellClass: $scope.highlightFilteredHeader },
                        { name: 'InstituteName', displayName: 'InstituteName', headerCellClass: $scope.highlightFilteredHeader },

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
                            '<a href="javascript:void(0);"  style="background-color:#0aa699;color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editDesignation(row.entity)">' +
                            '<i class="fa fa-edit" data-toggle="modal" data-target="#myModal" aria-hidden="true">&nbsp;Edit</i></a></button>' +

                            '<button class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                            '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteDesignation(row.entity)">' +
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


                return designationSettings.getAllDesignation(objcmnParam)
                    .then(function (data) {
                        if (data.length > 0) {
                            $scope.pagination.totalItems = data[0].RecordTotal;
                            $scope.gridOptions.data = data;
                            $scope.showItem = true;
                            $scope.createItem = false;

                        }
                        else {
                            logger.error('Your desired data not found');
                        }
                        //$scope.loaderMore = false;
                    });
            }
        };

        $scope.RefreshList = function () {
            //$scope.UpdateItem = false;
            //$('#myModal1').modal('show');
            $scope.pagination.pageNumber = 1;
            vm.getAllDesignations(0);
            

        };
        //************************************************End Grid******************************************************

    }
})();
