(function () {
    'use strict';

    angular
        .module('app.notificationSettings')
        .controller('notificationSettingsController', notificationSettingsController);

    notificationSettingsController.$inject = ['notificationSettings', 'mailSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$location', '$localStorage'];
    /* @ngInject */
        function notificationSettingsController(notificationSettings, mailSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $location, $localStorage) {
        var objcmnParam = {};


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
            $state.go($state.current.name, {}, { reload: true });
        };

        // Reset Button Logic
        $scope.clearField = function () {
            $scope.vm.itemEntry = null;
            $state.go($state.current.name, {}, { reload: true });
        };
        // Post Notification
        vm.AddNotificationSettings = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line



            if (vm.notificationType.selected === undefined || vm.institute.selected === undefined || vm.addNotification.Subject === undefined || vm.addNotification.Body === undefined || vm.notificationType === null || vm.institute === null || vm.addNotification.Subject === '' || vm.addNotification.Body === '')
            {
                logger.error('Please fill All information');
            } else {

                notificationSettings.postNotificationInformation({
                    InsNotificationSetupID: 0,
                    NotificationTypeID: vm.notificationTypeID,
                    Subject: vm.addNotification.Subject,
                    Body: vm.addNotification.Body,
                    IsActive: 1,
                    InstituteID: vm.instituteID,
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
                        if(data[0].ReturnValue==='Duplicate'){
                                logger.error('Notification Already Exist.......!');
                            }
                            else{
                            logger.info('Saved!');
                            //$scope.RefreshList();
                            $state.go($state.current.name, {}, { reload: true });

                            }
                      
                    })

                    .catch(function (error) { });
                // console.log(vm.parents);
            }
        };
        $scope.editnotification = function (model) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line
            
           // $scope.hideModal=true;
            
            objcmnParam.InstituteID = model.InstituteID;
            objcmnParam.InsNotificationSetupID = model.InsNotificationSetupID;
            objcmnParam.LoggedUser = 0;
            objcmnParam.PageNo = 0;
            objcmnParam.RowCountPerPage = 0;
            objcmnParam.IsPaging = 0;
            objcmnParam.SearchProperty = '';

            notificationSettings.getNotification(objcmnParam)

                .then(function (data) {
                    // vm.addNotification.InsNotificationSetupID
                    vm.addNotification.Subject = data[0].Subject;
                    vm.addNotification.Body = data[0].Body;
                    vm.addNotification.InsNotificationSetupID = data[0].InsNotificationSetupID;
                    vm.institute = {
                        selected: vm.institutes.filter(function (ob, i) {
                            return (ob.InstituteName === data[0].InstituteName);
                        })[0]
                    };
                    vm.notificationType = {
                        selected: vm.notificationTypes.filter(function (ob, i) {
                            return (ob.NotificationTypeName === data[0].NotificationTypeName);
                        })[0]
                    };
                    //$state.transitionTo('deliverypartner.listpartner');
                })
                .catch(function (error) { });
            //console.log(vm.parents);
        };
        
        vm.updateNotification = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line



            if (vm.notificationType.selected === undefined || vm.institute.selected === undefined || vm.addNotification.Subject === undefined || vm.addNotification.Body === undefined  || vm.addNotification.Subject === '' || vm.addNotification.Body === '') {
                logger.error('Please fill All information');
            } else {
                notificationSettings.postNotificationInformation({
                    InsNotificationSetupID: vm.addNotification.InsNotificationSetupID,
                    NotificationTypeID: vm.notificationType.selected.NotificationTypeID,
                    Subject: vm.addNotification.Subject,
                    Body: vm.addNotification.Body,
                    IsActive: 1,
                    InstituteID: vm.institute.selected.InstituteID,
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
                        
                            if(data[0].ReturnValue==='Duplicate'){
                                logger.error('Notification Already Exist.......!');
                            }
                            else{
                            logger.info('Updated Successfully!');
                            $scope.RefreshList();
                             $('#myModal').modal('hide'); //jshint ignore :line

                            }
                     
                        //$scope.showItem=true;
                    })
                    .catch(function (error) { });
                //console.log(vm.parents);
            }
        };


        $scope.deleteModels = function (notificationid) {


             //Generate Token API Pass Call
             authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)) //jshint ignore : line



            notificationSettings.deleteInstNotification({
                InsNotificationSetupID: notificationid.InsNotificationSetupID,
    
                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                    getAllNotifications();
                    $scope.RefreshList();
                })
                .catch(function (error) { });

        };


        
        activate();

        function activate() {
            var promises = [getAllInstitute(), getAllNotifications(), getAllNotificationTypeNames()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        function getAllInstitute() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            return mailSettings.getAllInstitutes()
                .then(function (data) {
                    vm.institutes = data;
                    vm.instituteID = vm.InstituteID;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.InstituteID); })[0] };

                });
        }
        function getAllNotifications() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line

            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID === 1 ? 0 : $localStorage.userInfo[0].InstituteID;
            objcmnParam.InsNotificationSetupID = 0;
            objcmnParam.LoggedUser = $localStorage.userInfo[0].UserID;
            objcmnParam.PageNo = 0;
            objcmnParam.RowCountPerPage = 0;
            objcmnParam.IsPaging = 0;
            objcmnParam.SearchProperty = '';

            return notificationSettings.getAllNotification(objcmnParam)
                .then(function (data) {
                    vm.notifications = data;
                });
        }
        function getAllNotificationTypeNames() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line
            
            return notificationSettings.getAllNotifications()
                .then(function (data) {
                    vm.notificationTypes = data;
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
                vm.getAllNotification(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    vm.getAllNotification(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    vm.getAllNotification(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    vm.getAllNotification(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    vm.getAllNotification(1);
                }
            }
        };
        vm.getAllNotification = function (isPaging) {

            //debugger;
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



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
                objcmnParam.InsNotificationSetupID = 0;
                objcmnParam.LoggedUser = 10;
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
                    rowTemplate: '<div ng-dblclick="grid.appScope.editnotification(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                    columnDefs: [
                        { name: 'InsNotificationSetupID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                       
                        { name: 'InstituteName', displayName: 'InstituteName', headerCellClass: $scope.highlightFilteredHeader },
                        { name: 'NotificationTypeName', displayName: 'NotificationTypeName', headerCellClass: $scope.highlightFilteredHeader },
                        { name: 'Subject', displayName: 'Subject', headerCellClass: $scope.highlightFilteredHeader },
                        
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
                            '<a href="javascript:void(0);" data-toggle="modal" data-target="#myModal" style="background-color:#0aa699; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editnotification(row.entity)">' +
                            '<i class="fa fa-edit" aria-hidden="true">&nbsp;Edit</i></a></button>' +

                            '<button class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                            '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteModels(row.entity)">' +
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

               // debugger;
                return notificationSettings.getNotification(objcmnParam)
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
            vm.getAllNotification(0);




        };
        //************************************************End Grid******************************************************

    }
})();
