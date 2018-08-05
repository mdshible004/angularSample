(function () {
    'use strict';

    angular
        .module('app.userAuthentication')
        .controller('UserAuthenticationController', UserAuthenticationController);

    UserAuthenticationController.$inject = ['userAuthenticationService','conversion','mailSettings', 'userService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function UserAuthenticationController(userAuthenticationService,conversion,mailSettings, userService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {





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
        $scope.UpdateItem = false;
        // Create and Show list Container Hide or Show Logic
        $scope.createItem = true;
        $scope.showItem = false;
        $scope.showUser = false;
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        $scope.listEvent = function () {
            $scope.createItem = true;
            $state.go($state.current.name, {}, { reload: true });
        };

        
        $scope.changeGrid = function () {
            $scope.gridOptionsUsr.data = [];
            vm.userAuth.AuthenticationID = null;
            vm.userAuth.UserID = null;
            vm.userAuth.User = null;
            vm.userAuth.Phone = null;
            vm.userAuth.Email = null;
        };


        vm.AddUserAuthentication = function () {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line



            if (vm.userAuth.Password === undefined || vm.userAuth.LoginName === null || vm.userAuth.LoginName === '' || vm.userAuth.LoginName === undefined || vm.userAuth.UserID === undefined || vm.userAuth.ExpireDate === undefined || vm.userAuth.ActiveDate === undefined || vm.userAuth.ExpireDate === '' || vm.userAuth.ActiveDate === '') {
                logger.error('Please fill Field');
            } else {
                if (vm.userAuth.Password !== vm.userAuth.ConfirmPassword) {
                    logger.error('Password Missmatch, Please correct your password');
                    return;
                } else {

                    // var istrim=vm.userAuth.Phone.trim();
                    userAuthenticationService.setUserAuthentication({
                        AuthenticationID: 0,
                        UserID: vm.userAuth.UserID,
                        LoginID: vm.userAuth.LoginName,
                        LoginEmail: vm.userAuth.Email === null ? '' : vm.userAuth.Email,
                        LoginPhone: vm.userAuth.Phone === null ? '' : vm.userAuth.Phone,
                        Password: vm.userAuth.Password,
                        ConfirmPassword: vm.userAuth.ConfirmPassword,
                        RegistrationDate: $scope.OnDate,
                        ExpireDate: conversion.getStringToDate(vm.userAuth.ExpireDate),
                        ExpireTime: vm.userAuth.Expiretime === null || vm.userAuth.Expiretime === undefined ? '1900-01-01 00:00:00' : getTimeSpanToTime(vm.userAuth.Expiretime),
                        ActivationDate: conversion.getStringToDate(vm.userAuth.ActiveDate),
                        ActivationTime: vm.userAuth.Activetime === null || vm.userAuth.Activetime === undefined ? '1900-01-01 00:00:00' : getTimeSpanToTime(vm.userAuth.Activetime),
                        InstituteID: vm.institute.selected.InstituteID,
                        LoggedUserID: $localStorage.userInfo[0].UserID
                    })

                        .then(function (data) {
                            logger.info('Saved!');
                            $scope.RefreshList(); 
                            $scope.createIteom = false;
                        })
                        .catch(function (error) { });
                }
            }


        };


        

        $scope.getUserForAuthenticationByUserID = function (model) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            $scope.UpdateItem = true;
            $scope.showItem = false;
            $scope.showUser = false;
            $scope.createItem = true;

            var params = {
                InstituteID: vm.institute.selected.InstituteID,
                UserID: model.UserID,
                UserTypeID: 0,
                LoggedUserID: $localStorage.userInfo[0].UserID,
                pageNumber: 1,
                pageSize: 0,
                IsPaging: 0
            };
            

            return userAuthenticationService.getUserAuthenticationByUserID(params)
                .then(function (data) {
                    $('#myModal').modal('hide'); //jshint ignore : line
                    vm.User = data;
                    vm.userAuth.AuthenticationID = data[0].AuthenticationID;
                    vm.userAuth.UserID = data[0].UserID;
                    vm.userAuth.User = data[0].UserFullName;
                    vm.userAuth.Phone = data[0].LoginPhone;
                    vm.userAuth.Email = data[0].LoginEmail;
                    //vm.userAuth.LoginName = data[0].LoginID;
                    //vm.userAuth.Password = data[0].Password;
                    //vm.userAuth.ConfirmPassword = data[0].ConfirmPassword;
                    //vm.userAuth.ActiveDate = data[0].ActivationDate;
                    //vm.userAuth.Activetime = getTimeToTimeSpan(data[0].ActivationTime);
                    //vm.userAuth.ExpireDate = data[0].ExpireDate;
                    //vm.userAuth.Expiretime = getTimeToTimeSpan(data[0].ExpireTime);
                });

        };

        var mail, login, phone;
        $scope.getAuthenticationByID = function (model) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            $scope.UpdateItem = true;
            $scope.showItem = false;
            $scope.createItem = true;

            var params = {
                InstituteID: vm.institute.selected.InstituteID,
                AuthenticationID: model.AuthenticationID,
                LoggedUserID: $localStorage.userInfo[0].UserID,
                pageNumber : 1,
                pageSize : 0,
                IsPaging : 0                            
            };
            return userAuthenticationService.getUserAuthenticationByInsId(params)
                .then(function (data) {
                  
                    vm.User = data;
                    //vm.userAuth.AuthenticationID = data[0].AuthenticationID;
                    vm.userAuth.UserID = data[0].UserID;
                    vm.userAuth.User = data[0].UserFullName;
                    vm.userAuth.Phone = data[0].LoginPhone;
                    vm.userAuth.Email = data[0].LoginEmail;
                    vm.userAuth.LoginName = data[0].LoginID;
                    vm.userAuth.Password = data[0].Password;
                    vm.userAuth.ConfirmPassword = data[0].ConfirmPassword;
                    vm.userAuth.ActiveDate = data[0].ActivationDate;
                    vm.userAuth.Activetime = getTimeToTimeSpan(data[0].ActivationTime);
                    vm.userAuth.ExpireDate = data[0].ExpireDate;
                    vm.userAuth.Expiretime = getTimeToTimeSpan(data[0].ExpireTime);

                    mail = data[0].LoginEmail;
                    login = data[0].LoginID;
                    phone = data[0].LoginPhone;
                });
        };


        vm.patchAuth = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line



            if (vm.userAuth.Password === '' || vm.userAuth.LoginName === '' || vm.userAuth.UserID === '' || vm.userAuth.ExpireDate === '' || vm.userAuth.ActiveDate === '' || vm.userAuth.ExpireDate === '' || vm.userAuth.ActiveDate === '') {
                logger.error('Please fill Field');
            } else {
                if (vm.userAuth.Password !== vm.userAuth.ConfirmPassword) {
                    logger.error('Password Missmatch, Please correct your password');
                    return;
                } else {

                    userAuthenticationService.setUserAuthentication({
                        AuthenticationID: vm.userAuth.AuthenticationID,
                        UserID: vm.userAuth.UserID,
                        LoginID: vm.userAuth.LoginName,
                        LoginEmail: vm.userAuth.Email === null ? '' : vm.userAuth.Email,
                        LoginPhone: vm.userAuth.Phone === null ? '' : vm.userAuth.Phone,
                        Password: vm.userAuth.Password,
                        ConfirmPassword: vm.userAuth.ConfirmPassword,
                        RegistrationDate: $scope.OnDate,
                        ExpireDate: conversion.getStringToDate(vm.userAuth.ExpireDate),
                        ExpireTime: vm.userAuth.Expiretime === null || vm.userAuth.Expiretime === undefined ? '1900-01-01 00:00:00' : getTimeSpanToTime(vm.userAuth.Expiretime),
                        ActivationDate: conversion.getStringToDate(vm.userAuth.ActiveDate),
                        ActivationTime: vm.userAuth.Activetime === null || vm.userAuth.Activetime === undefined ? '1900-01-01 00:00:00' : getTimeSpanToTime(vm.userAuth.Activetime),
                        InstituteID: $localStorage.userInfo[0].InstituteID,
                        LoggedUserID: $localStorage.userInfo[0].UserID
                    })

                        .then(function (data) {
                            logger.info('Update Successfully!');

                            //vm.itemEvent();
                        })
                        .catch(function (error) { });
                }
            }


        };

        //$scope.deleteModels = function (AuthID) {


        //    userAuthenticationService.deleteUserAuthentication({
        //        AuthenticationID: AuthID,
        //        InstituteID: $localStorage.userInfo[0].InstituteID,
        //        LoggedUserID: $localStorage.userInfo[0].UserID
        //    })

        //        .then(function (data) {
        //            logger.info('Delete Successfully!');
        //            vm.itemEvent();
        //        })
        //        .catch(function (error) { });

        //};


        $scope.deleteModels = function (model) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)) //jshint ignore : line


            userAuthenticationService.deleteUserAuthentication({
                AuthenticationID: model.AuthenticationID,
                InstituteID: vm.institute.selected.InstituteID,
                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Delete Successfully!');
                    $scope.RefreshList();
                })
                .catch(function (error) { });

        };




        //===================================for regular Expression==============================
        var strongRegularExp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
        var mediumRegularExp = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');
        $scope.checkpwdStrength = {
            'width': '150px',
            'height': '25px',
            'float': 'right'
        };

        $scope.validationInputPwdText = function (value) {
            if (strongRegularExp.test(value)) {
                $scope.checkpwdStrength['background-color'] = 'green';
            } else if (mediumRegularExp.test(value)) {
                $scope.checkpwdStrength['background-color'] = 'orange';
            } else {
                $scope.checkpwdStrength['background-color'] = 'red';
            }
        };
        // =============================================end regular expression=========================
        // =============================================check existing data/ validation ////=========================
        $scope.checkIfExist = function (Prop, Flag) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

           

            var params = {
                Property: Prop,
                Flag: Flag
            };
            return userAuthenticationService.getExistsParams(params)
                .then(function (data) {
                    if (data[0].Result !== 0) {
                        if (Flag === 'Phone') {
                          
                            if (data[0].PropName !== phone) {
                                vm.userAuth.Phone = '';
                                logger.error('Phone number Already Exist');
                            }
                            else {
                                vm.userAuth.Phone = data[0].PropName;
                            }
                        }
                        else if (Flag === 'Mail') {
                           
                            if (data[0].PropName !== mail) {
                                vm.userAuth.Email = '';
                                logger.error('Mail ID Already Exist');
                            }
                            else {
                                vm.userAuth.Email = data[0].PropName;
                            }
                        }
                        else if (Flag === 'LoginName') {
                           
                            if (data[0].PropName !== login) {
                                vm.userAuth.LoginName = '';
                                logger.error('User Already Exist');

                            }
                            else {
                                vm.userAuth.LoginName = data[0].PropName;
                            }
                        }

                    }
                });
        };
        // ===============================end existing data/ validation ////=========================

        //==============================For Date Formating Start===================//

        //function getStringToDate(InputString) {
        //    //debugger
        //    var newStringToDate = InputString.replace(/[/-]/g, '-');
        //    var StringToDate = newStringToDate;
        //    var SplitedDate = StringToDate.split('-');
        //    var Day = SplitedDate[0];
        //    var Month = SplitedDate[1];
        //    var Year = SplitedDate[2];
        //    var FullFormateDate = Month + '-' + Day + '-' + Year;
        //    var Output = $filter('date')(new Date(), FullFormateDate);
        //    return Output;
        //}
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


        //==============================Regular date formating========================================
        $scope.CurrentDate = new Date();

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        today = yyyy + '-' + mm + '-' + dd;
        $scope.OnDate = today;
        //==============================Regular date formating END========================================



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
                vm.getAllUserAuthenticationInfo(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    vm.getAllUserAuthenticationInfo(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    vm.getAllUserAuthenticationInfo(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    vm.getAllUserAuthenticationInfo(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    vm.getAllUserAuthenticationInfo(1);
                }
            }
        };
        vm.getAllUserAuthenticationInfo = function (isPaging) {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line





            if( vm.institute.selected===undefined){
                    $scope.createItem = true;
                     //$scope.showItem = false;
                    $('#myModal').modal('hide'); //jshint ignore : line
                    logger.error('Please Select an Institute.');

            }else{
              
            $scope.gridOptions.enableFiltering = true;
                
            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();
            objcmnParam.InstituteID = vm.institute.selected.InstituteID;
            objcmnParam.AuthenticationID = 0;
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
                rowTemplate: '<div ng-dblclick="grid.appScope.getAuthenticationByID(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                columnDefs: [
                    { name: 'AuthenticationID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'UserID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'UserFullName', displayName: 'Name', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ClassName', displayName: 'Class', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'UserTypeName', displayName: 'User Type', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'InstituteName', displayName: 'Institute Name', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'LoginEmail', displayName: 'Email', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'LoginID', displayName: 'Login Name', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'LoginPhone', displayName: 'Phone', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Password', displayName: 'Password', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ActivationDate', displayName: 'ActivationDate', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ActivationTime', displayName: 'ActivationTime', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ExpireDate', displayName: 'ExpireDate', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ExpireTime', displayName: 'ExpireTime', headerCellClass: $scope.highlightFilteredHeader },
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
                        '<a href="javascript:void(0);"  style="background-color:#0aa699 ; color:white"  class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.getAuthenticationByID(row.entity)">' +
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



            return userAuthenticationService.getUserAuthenticationByInsId(objcmnParam)
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
            vm.getAllUserAuthenticationInfo(0); 

            
           
            
        };
        //************************************************End Grid******************************************************
        //var objcmnParam = {};
        $scope.gridOptionsUsr = [];
        $scope.paginationUsr = {
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

                    this.pageSize = $scope.paginationUsr.totalItems;
                }
                else {
                    this.pageSize = this.ddlpageSize;
                }

                this.pageNumber = 1;
                vm.getUser(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    vm.getUser(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    vm.getUser(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    vm.getUser(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    vm.getUser(1);
                }
            }
        };
        vm.getUser = function (isPaging) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



        if( vm.institute.selected===undefined){
                    $scope.createItem = true;
                     //$scope.showItem = false;
                    $('#myModal').modal('hide'); //jshint ignore : line
                    logger.error('Please Select an Institute.');
            }else{
              
            $scope.gridOptionsUsr.enableFiltering = true;

            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();
                      
            objcmnParam.InstituteID = vm.institute.selected.InstituteID;
            objcmnParam.UserID = 0;
            objcmnParam.UserTypeID = 0;
            objcmnParam.LoggedUserID = $localStorage.userInfo[0].UserID;
            objcmnParam.pageNumber = ($scope.paginationUsr.pageNumber - 1) * $scope.paginationUsr.pageSize;
            objcmnParam.pageSize = $scope.paginationUsr.pageSize;
            objcmnParam.IsPaging = isPaging;
            //objcmnParam.SearchProperty = $scope.IsCallFromSearch === true ? $scope.SearchProperty : '';

            $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
                if (col.filters[0].term) {
                    return 'header-filtered';
                } else {
                    return '';
                }
            };
            $scope.gridOptionsUsr = {
                useExternalPagination: true,
                useExternalSorting: true,
                enableFiltering: true,
                enableRowSelection: true,
                enableSelectAll: true,
                showFooter: true,
                enableGridMenu: true,
                rowTemplate: '<div ng-dblclick="grid.appScope.getUserForAuthenticationByUserID(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                columnDefs: [
                    { name: 'AuthenticationID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'UserID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'UserFullName', displayName: 'Name', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'LoginEmail', displayName: 'Email', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'UserTypeName', displayName: 'UserType', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'InstituteName', displayName: 'Institute', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ClassName', displayName: 'Class', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'LoginPhone', displayName: 'Phone', headerCellClass: $scope.highlightFilteredHeader},                  
                    { name: 'ActivationDate', visible: false, cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ActivationTime', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ExpireDate', visible: false, cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ExpireTime', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    //{cellTemplate: '<img ng-src="{{COL_FIELD}}" style="height:35px; width:35px" />'},
                    {
                        name: 'Option',
                        displayName: 'Option',
                        
                        width: '10%',
                        pinnedRight: true,
                        enableColumnResizing: false,
                        enableFiltering: false,
                        enableSorting: false,
                        headerCellClass: $scope.highlightFilteredHeader,
                        visible: true,
                        cellTemplate: '<button class="label label-success label-mini" style="background-color:#0aa699">' +
                        '<a href="javascript:void(0);" style="background-color:#0aa699; color:white"  class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.getUserForAuthenticationByUserID(row.entity)">' +
                        '<i class="fa fa-edit" aria-hidden="true">&nbsp;Select</i></a></button>'
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
                    return getPage(1, $scope.gridOptionsUsr.totalItems, paginationOptions.sort)
                        .then(function () {
                            $scope.gridOptionsUsr.useExternalPagination = false;
                            $scope.gridOptionsUsr.useExternalSorting = false;
                            getPage = null;
                        });
                },
            };
            
            return userAuthenticationService.getUserAuthenticationByUserID(objcmnParam)
                
                .then(function (data) {
                    if (data.length > 0) {
                      
                        $scope.paginationUsr.totalItems = data[0].RecordTotal;
                        $scope.gridOptionsUsr.data = data;
                        $scope.showItem = false;
                       $('#myModal').modal('show'); //jshint ignore : line
                    }
                    else {
                        logger.error('Your desired data not found');
                    }                   
                });

            }
        };

            
        $scope.UserList = function () {
            
            
            $scope.paginationUsr.pageNumber = 1;
            vm.getUser(0);
             

        };
        //************************************************End Grid******************************************************
        activate();

        function activate() {
            var promises = [getAllInstitute()];
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

    }
    

})();
