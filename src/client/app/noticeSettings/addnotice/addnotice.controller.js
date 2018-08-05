(function () {
    'use strict';

    angular
        .module('app.noticeSettings')
        .controller('noticeSettingsController', noticeSettingsController);

    noticeSettingsController.$inject = ['noticeSettingsSevice', 'commonService', 'conversion', '$window', 'notificationSettings', 'mailSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$location', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function noticeSettingsController(noticeSettingsSevice, commonService, conversion, $window, notificationSettings, mailSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $location, $localStorage, apiConfig) {
        var objcmnParam = {};
        var vm = this;
        //==============for report header information ===
        $scope.imgHost = apiConfig.imagehost;
        $scope.InstituteLogo = $localStorage.userInfo[0].InstituteLogo;
        $scope.InsEmail = $localStorage.userInfo[0].InsEmail;
        $scope.InsAddress = $localStorage.userInfo[0].InsAddress;
        $scope.InsWeb = $localStorage.userInfo[0].InsWeb;
        $scope.InsPhoneNo = $localStorage.userInfo[0].InsPhoneNo;
        $scope.InstituteName = $localStorage.userInfo[0].InstituteName;

        // ============end report Heasder information===

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
        //vm.UserTypeIDArray = [];
        vm.NoticeID = 0;
        //vm.NoticeUserID = 0;
        vm.AddNotificationSettings = function () {
            //vm.UserTypeIDArray.push(vm.userTypeID);
            noticeSettingsSevice.postInsNotice({
                NoticeID: vm.NoticeID,
                //NoticeUserID: vm.NoticeUserID,
                NoticeDate: vm.dateSetup === undefined || vm.dateSetup === '' ? '' : conversion.getStringToDate(vm.dateSetup),
                NoticeExpDate: vm.dateExpSetup === undefined || vm.dateExpSetup === '' ? '' : conversion.getStringToDate(vm.dateExpSetup),
                NoticeTypeID: vm.noticeTypeID,
                NoticeHead: vm.noticeHead,
                NoticeBody: vm.noticeBody,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                LoggedUserID: $localStorage.userInfo[0].UserID,
                UserTypeID: vm.userTypeID,
                UserTypeIDArr: $scope.UserTypeSelectedList
            })
                .then(function (data) {
                    logger.info('Saved!');

                    $state.go($state.current.name, {}, { reload: true });
                })

                .catch(function (error) { });

        };
        $scope.editnotice = function (model) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line
            $scope.showItem = false;
            $scope.createItem = true;
            objcmnParam.InstituteID = model.InstituteID;
            objcmnParam.NoticeID = model.NoticeID;
            objcmnParam.LoggedUser = 0;
            objcmnParam.PageNo = 0;
            objcmnParam.RowCountPerPage = 0;
            objcmnParam.IsPaging = 0;
            objcmnParam.SearchProperty = '';

            $scope.getUserTypeListByID(objcmnParam);

            noticeSettingsSevice.getNoticeListByInsId(objcmnParam)

                .then(function (data) {
                    $scope.CheckedName.ID = data[0].UserTypeIDs;
                    $scope.CheckedName.Name = ', ' + data[0].UserTypeNames;
                    vm.noticeHead = data[0].NoticeHead;
                    vm.noticeBody = data[0].NoticeBody;
                    vm.dateSetup = data[0].NoticeDate === null || data[0].NoticeDate === '' ? '' : conversion.getDateToString(data[0].NoticeDate);
                    vm.dateExpSetup = data[0].NoticeExpDate === null || data[0].NoticeExpDate === '' ? '' : conversion.getDateToString(data[0].NoticeExpDate);
                    vm.NoticeID = data[0].NoticeID;
                    //vm.NoticeUserID = data[0].NoticeUserID;
                    vm.noticeTypeID = data[0].NoticeTypeID;
                    vm.noticeType = {
                        selected: vm.noticeTypes.filter(function (ob, i) {
                            return (ob.NoticeTypeID === data[0].NoticeTypeID);
                        })[0]
                    };
                    vm.notice = {
                        selected: vm.noticesFor.filter(function (ob, i) {
                            return (ob.UserTypeID === data[0].UserTypeID);
                        })[0]
                    };
                })
                .catch(function (error) { });
        };

        $scope.getUserTypeListByID = function (objcmnParam) {
            //debugger;
            noticeSettingsSevice.SpGetInsNoticeUserList(objcmnParam)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.UserTypeSelectedList = data;
                        angular.forEach(vm.noticesFor, function (nf) {
                            nf.selected = false;
                        });

                        angular.forEach($scope.UserTypeSelectedList, function (UTSL) {
                            angular.forEach(vm.noticesFor, function (nf) {
                                if (UTSL.UserTypeID === nf.UserTypeID) {
                                    nf.selected = true;
                                }
                            });
                        });
                    }
                })
                .catch(function (error) { });
        };

        $scope.deleteNotice = function (model) {
            //debugger;

            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)) //jshint ignore : line

            var params = {
                InstituteID: model.InstituteID,
                LoggedUserID: $localStorage.userInfo[0].UserID,
                NoticeID: model.NoticeID//,
                //NoticeUserID: model.NoticeUserID
            };


            noticeSettingsSevice.DeleteNoticeListId(params)

                .then(function (data) {
                    if (data.length > 0) {
                        logger.info('Delete Successfully!');
                        $scope.RefreshList();
                    }
                })
                .catch(function (error) { });

        };



        activate();

        function activate() {
            var promises = [getAllInstitute(), getAllNotices(), getAllNoticeTypeNames(), getAllNoticeForDDL()];
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
        function getAllNotices() {

            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line

            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID;
            objcmnParam.NoticeID = 0;
            objcmnParam.LoggedUser = $localStorage.userInfo[0].UserID;
            objcmnParam.PageNo = 0;
            objcmnParam.RowCountPerPage = 0;
            objcmnParam.IsPaging = 0;
            objcmnParam.SearchProperty = '';

            return noticeSettingsSevice.getNoticeListByInsId(objcmnParam)
                .then(function (data) {
                    vm.notifications = data;
                });
        }
        function getAllNoticeTypeNames() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            return commonService.getCmnNoticeTypeDDL()
                .then(function (data) {
                    vm.noticeTypes = data;
                });
        }
        $scope.noticeForMulti = []; $scope.noticesForList = [];
        function getAllNoticeForDDL() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            return commonService.getCmnNoticeForDDL()
                .then(function (data) {
                    //debugger;
                    vm.noticesFor = data;
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
                vm.getAllNotice(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    vm.getAllNotice(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    vm.getAllNotice(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    vm.getAllNotice(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    vm.getAllNotice(1);
                }
            }
        };
        vm.getAllNotice = function (isPaging) {

            $scope.gridOptions.enableFiltering = true;

            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID;
            objcmnParam.NoticeID = 0;
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
                rowTemplate: '<div ng-dblclick="grid.appScope.editnotice(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                columnDefs: [
                    { name: 'NoticeTypeName', displayName: 'NoticeType', headerCellClass: $scope.highlightFilteredHeader },

                    { name: 'InstituteName', displayName: 'InstituteName', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'NoticeDate', displayName: 'Date', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'UserTypeNames', displayName: 'Notice For', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'NoticeHead', displayName: 'NoticeHead', headerCellClass: $scope.highlightFilteredHeader },

                    {
                        name: 'Option',
                        displayName: 'Option',
                        width: '21%',
                        pinnedRight: true,
                        enableColumnResizing: false,
                        enableFiltering: false,
                        enableSorting: false,
                        headerCellClass: $scope.highlightFilteredHeader,
                        visible: true,
                        cellTemplate: '<button class="label label-success label-mini" style="background-color:#0aa699">' +
                        '<a href="javascript:void(0);" data-toggle="modal" data-target="#myModal" style="background-color:#0aa699; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editnotice(row.entity, 0)">' +
                        '<i class="fa fa-edit" aria-hidden="true">&nbsp;Edit</i></a></button>' +

                        '<button class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                        '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteNotice(row.entity)">' +
                        '<i class="fa fa-trash" aria-hidden="true">&nbsp;Delete</i></a></button>' +

                        '<button class="label label-success label-mini" style="background-color:#0e710f">' +
                        '<a href="javascript:void(0);" data-toggle="modal" data-target="#myModal" style="background-color:#0e710f; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.printNotice(row.entity, 1)">' +
                        '<i class="fa fa-print" aria-hidden="true">&nbsp;Print</i></a></button>'

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

            return noticeSettingsSevice.getNoticeListByInsId(objcmnParam)
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

                });

        };

        $scope.RefreshList = function () {
            $scope.pagination.pageNumber = 1;
            vm.getAllNotice(0);

        };

        //************************************************End Grid******************************************************

        $scope.printNotice = function (model) {
            vm.noticeHead = model.NoticeHead;
            vm.noticeBody = model.NoticeBody;
            vm.dateSetup = model.NoticeDate;
            vm.dateExpSetup = model.NoticeExpDate;
            vm.NoticeID = model.NoticeID;
            //vm.NoticeUserID = model.NoticeUserID;
            vm.noticeType = {
                selected: vm.noticeTypes.filter(function (ob, i) {
                    return (ob.NoticeTypeID === model.NoticeTypeID);
                })[0]
            };
            vm.notice = {
                selected: vm.noticesFor.filter(function (ob, i) {
                    return (ob.UserTypeID === model.UserTypeID);
                })[0]
            };
            setTimeout(function () {

                var content = document.getElementById('print').innerHTML;
                var mywindow = window.open('', 'Print', 'height=1000,width=2000');
                var is_chrome = Boolean(mywindow.chrome);
                mywindow.document.write('<html><head><title></title>');
                mywindow.document.write('</head><body >');
                mywindow.document.write(content);
                mywindow.document.write('</body> <br/><br/>');
                mywindow.document.write('<footer style="position: fixed;bottom: 0;"> <font color="green">Powered By :</font><font color="blue"> onAir International Ltd. </font><br><font color="green">Web URL:</font><font color="blue">  www.onems.live </font></footer>');
                mywindow.document.write('</html>');

                if (is_chrome) {
                    setTimeout(function () { // wait until all resources loaded 
                        mywindow.document.close(); // necessary for IE >= 10
                        mywindow.focus(); // necessary for IE >= 10
                        mywindow.print(); // change window to winPrint
                        mywindow.close(); // change window to winPrint
                    }, 250);
                } else {
                    mywindow.document.close(); // necessary for IE >= 10
                    mywindow.focus(); // necessary for IE >= 10

                    mywindow.print();
                    mywindow.close();
                }
                return true;
            }, 1);
        };


        //$('.selected-items-box').bind('click', function (e) {
        //    $('.wrapper .list').slideToggle('fast');
        //    debugger;
        //    $scope.ShowItemList = $scope.ShowItemList == true ? false : true;            
        //});


        //*******************************************Multi Checked DropDown***************************************        
        $scope.setSlid = function (type) {
            //debugger;
            $('.wrapper .list').slideToggle('fast'); //jshint ignore : line
            $scope.ShowItemList = $scope.ShowItemList === true ? false : true;
        };

        $scope.ShowItemList = false;
        $scope.UserTypeSelectedList = [];

        $scope.getSelectedItems = function (item) {
            //debugger;
            if (item.selected === false) {
                var CSelectList = $scope.UserTypeSelectedList.filter(function (ob, i) { return (ob.UserTypeID === item.UserTypeID); })[0];
                if (CSelectList !== undefined) {
                    $scope.UserTypeSelectedList.splice($scope.UserTypeSelectedList.indexOf(CSelectList), 1);
                }
            }
            else if (item.selected === true) {
                var PSelectList = $scope.UserTypeSelectedList.filter(function (ob, i) { return (ob.UserTypeID === item.UserTypeID); })[0];
                if (PSelectList === undefined) {
                    $scope.UserTypeSelectedList.push({
                        NoticeID: vm.NoticeID,
                        //ParenntUserType: item.ParenntUserType,
                        //ParentID: item.ParentID,
                        UserTypeID: item.UserTypeID,
                        UserTypeName: item.UserTypeName,
                        selected: item.selected
                    });
                }
            }

            $scope.showTopOMultiCheck(item);
            //return item.selected;
        };

        $scope.CheckedAll = false; $scope.UnCheckedAll = false;
        $scope.setSelectedItemsChecked = function (CheckedAll) {
            if (CheckedAll === true) {
                $scope.UnCheckedAll = false;
                angular.forEach(vm.noticesFor, function (ntc) {
                    ntc.selected = CheckedAll;
                    $scope.getSelectedItems(ntc);
                });
            }
            else {
                angular.forEach(vm.noticesFor, function (ntc) {
                    ntc.selected = false;
                    $scope.getSelectedItems(ntc);
                });
            }
        };

        $scope.CheckedName = {};
        $scope.CheckedName.ID = '';
        $scope.CheckedName.Name = '';
        $scope.showTopOMultiCheck = function (ntc) {
            if (ntc.selected === true) {
                var P = false;
                P = $scope.CheckedName.ID.includes(ntc.UserTypeID);

                if (P === false) {
                    $scope.CheckedName.Name += ', ' + ntc.UserTypeName;
                    $scope.CheckedName.ID += ', ' + ntc.UserTypeID;
                }
            }
            else {
                if (ntc.selected === false) {
                    var S = false;
                    S = $scope.CheckedName.ID.includes(ntc.UserTypeID);
                    if (S === true) {
                        $scope.CheckedName.Name = $scope.CheckedName.Name.replace(', ' + ntc.UserTypeName, '');
                        $scope.CheckedName.ID = $scope.CheckedName.ID.replace(', ' + ntc.UserTypeID, '');
                    }
                }
            }
            $scope.SetIsCheckedAll();
        };

        $scope.SetIsCheckedAll = function () {
            var IsCheckedAll = vm.noticesFor.filter(function (ob, i) { return (ob.selected === undefined || ob.selected === false); })[0];
            if (IsCheckedAll !== undefined && (IsCheckedAll.selected === undefined || IsCheckedAll.selected === false)) {
                $scope.CheckedAll = false;
            }
            else {
                $scope.CheckedAll = true;
            }
        };
        //*******************************************Multi Checked DropDown***************************************

    }
})();
