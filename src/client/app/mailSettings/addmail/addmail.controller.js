(function () {
    'use strict';

    angular
        .module('app.mailSettings')
        .controller('mailSettingsController', mailSettingsController);

    mailSettingsController.$inject = ['mailSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function mailSettingsController(mailSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {



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

        //$scope.checkMailvalidation=function(validation){
        //    debugger;
        //   $scope.checkval= /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        //    if(validation!== $scope.checkval){
        //        logger.error('Invalid Email...');
        //        vm.addMail.FromEmail=null;
        //    }
        //}

        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };
        //Post Shift
        vm.AddMailSettings = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            if (vm.addMail.Subject === undefined || vm.addMail.Body === undefined || vm.addMail.FromEmail === undefined || vm.MailTypeID === undefined || vm.instituteID === undefined) {
                logger.error('Please fill All.');

            } else {
                //    if(vm.addMail.FromEmail !==/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/)
                //     {
                //         logger.error('Enter a valid Email') ;

                //     }else{

                mailSettings.postMailInformation({
                    InsMailSetupID: 0,
                    InstituteID: vm.institute.selected.InstituteID,
                    MailTypeID: vm.mail.selected.MailTypeID,
                    Subject: vm.addMail.Subject,
                    Body: vm.addMail.Body,
                    FromEmail: vm.addMail.FromEmail,
                    IsActive: 1,
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
                        if (data[0].ReturnValue === 1) {
                            logger.info('Saved!');
                            $state.go($state.current.name, {}, { reload: true });
                        }
                        else {
                            logger.error('Mail Already Exists....!');
                        }

                       
                    })
                    .catch(function (error) { });
            }
            // }
            //console.log(vm.parents);
        };


        $scope.editMail = function (model) {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            //$scope.cmnParam();@
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID === 1 ? 0 : $localStorage.userInfo[0].InstituteID;
            objcmnParam.InsMailSetupID = model.InsMailSetupID;
            objcmnParam.LoggedUser = $localStorage.userInfo[0].UserID;
            objcmnParam.PageNo = 0;
            objcmnParam.RowCountPerPage = 0;
            objcmnParam.IsPaging = 0;
            objcmnParam.SearchProperty = '';
            mailSettings.getAllMailUI(objcmnParam)

                .then(function (data) {
                    vm.addMail.Subject = data[0].Subject;
                    vm.addMail.Body = data[0].Body;

                    vm.addMail.FromEmail = data[0].FromEmail;
                    vm.addMail.InsMailSetupID = data[0].InsMailSetupID;
                    vm.institute = {
                        selected: vm.institutes.filter(function (ob, i) {
                            return (ob.InstituteName === data[0].InstituteName);
                        })[0]
                    };
                    vm.mail = {
                        selected: vm.mails.filter(function (ob, i) {
                            return (ob.MailTypeName === data[0].MailTypeName);
                        })[0]
                    };
                    //$state.transitionTo('deliverypartner.listpartner');
                })
                .catch(function (error) { });
            //console.log(vm.parents);
        };
        vm.updateMail = function () {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            if (vm.addMail.Subject === undefined || vm.addMail.Body === undefined || vm.addMail.FromEmail === undefined || vm.mail === undefined || vm.institute === undefined || vm.addMail.Subject === '' || vm.addMail.Body === '' || vm.addMail.FromEmail === '') {
                logger.error('Please fill All.');

            } else {
                mailSettings.postMailInformation({
                    InsMailSetupID: vm.addMail.InsMailSetupID,
                    InstituteID: vm.institute.selected.InstituteID,
                    MailTypeID: vm.mail.selected.MailTypeID,
                    Subject: vm.addMail.Subject,
                    Body: vm.addMail.Body,
                    FromEmail: vm.addMail.FromEmail,
                    IsActive: 1,
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
                        logger.info('Update Successfully!');
                        $scope.RefreshList();
                        $('#myModal').modal('hide'); //jshint ignore : line
                        //$state.transitionTo('deliverypartner.listpartner');
                    })
                    .catch(function (error) { });
                //console.log(vm.parents);
                // }
            }
        };

        $scope.deleteMail = function (model) {
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            mailSettings.deleteinsMail({
                //Generate Token API Pass Call
                InsMailSetupID: model.InsMailSetupID,
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
            var promises = [getmail(), getAllInstitute(), getAllmail()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }
        function getmail() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return mailSettings.getAllmails()
                .then(function (data) {
                    vm.mails = data;
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

        function getAllmail() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return mailSettings.getallMailInformation()
                .then(function (data) {
                    vm.email = data;
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
                vm.getAllmail(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    vm.getAllmail(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    vm.getAllmail(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    vm.getAllmail(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    vm.getAllmail(1);
                }
            }
        };
        vm.getAllmail = function (isPaging) {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            $scope.gridOptions.enableFiltering = true;

            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();@
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID === 1 ? 0 : $localStorage.userInfo[0].InstituteID;
            objcmnParam.InsMailSetupID = 0;
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
                rowTemplate: '<div ng-dblclick="grid.appScope.editMail(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                columnDefs: [
                    { name: 'InstituteID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Subject', displayName: 'Subject', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'MailTypeName', displayName: 'Mail Type ', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'FromEmail', displayName: 'From Email', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'InstituteName', displayName: 'Institute', headerCellClass: $scope.highlightFilteredHeader },


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
                        '<a href="javascript:void(0);"  style="background-color:#0aa699;color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editMail(row.entity)">' +
                        '<i class="fa fa-edit"   data-toggle="modal" data-target="#myModal" aria-hidden="true">&nbsp;Edit</i></a></button>' +

                        '<button class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                        '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteMail(row.entity)">' +
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


            return mailSettings.getAllMailUI(objcmnParam)
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
            vm.getAllmail(0);

            $scope.createItem = false;
            $scope.showItem = true;

        };

        //************************************************Start Grid******************************************************






    }
})();
