(function () {
    'use strict';

    angular
        .module('app.CustomCode')
        .controller('CustomCodeController', CustomCodeController);

    CustomCodeController.$inject = ['commonService', 'classSettingsService', 'menuSettings', 'branchSettingsSevice', 'customCodeService', 'filterurl', '$filter', '$q', 'authservice', 'apiConfig', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', '$localStorage', 'uiGridConstants'];
    /* @ngInject */
    function CustomCodeController(commonService, classSettingsService, menuSettings, branchSettingsSevice, customCodeService, filterurl, $filter, $q, authservice, apiConfig, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, $localStorage, uiGridConstants) {

        var vm = this;//jshint ignore : line
        //debugger;
        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration


        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.LoggedUserID = parseInt($localStorage.userInfo[0].UserID);
        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.showSection = false;
        $scope.createItem = true;


        $scope.gridOptionsCustomCodeList = [];
        var objcmnParam = {};

        //Default Parameters Begin
        var LUserID = vm.LoggedUserID;
        var LInstituteID = vm.InstituteID;

        var isExisting = 0;
        var page = 1;
        var pageSize = 1000;
        var isPaging = 0;
        var totalData = 0;

        //List Declaration
        $scope.ListInstitute = [];
        $scope.ListMenues = [];
        $scope.ListBranch = [];

        //Depended Events 
        //1 AddCustomCodeDetails(Add Button Push Operation) 
        //2 using Details In Save Envents
        //3 clearDetails Assign null 
        //4 EditCustomCode
        //5 Delete Details

        $scope.ListCustomCodeDetails = [];

        //Depended Events On Load 
        $scope.ListCustomCodeList = [];

        //Default Parameters End
        //Load Default Index param in scope Begin 
        $scope.ToogleDiv = 0;
        $scope.ToogleShowListButtonName = 'Show List';

        //Depended Events Edit Clear
        $scope.RecordID = 0;
        $scope.btnSaveUpdateText = 'Save';
        $scope.PageTitle = 'Create Custom Code';
        $scope.ListTitle = 'Records';
        //PageLoad

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
        //Pagination
        $scope.pagination = {
            paginationPageSizes: [15, 25, 50, 75, 100, 500, 1000, 'All'],
            ddlpageSize: 15, pageNumber: 1, pageSize: 15, totalItems: 0,

            getTotalPages: function () {
                return Math.ceil(this.totalItems / this.pageSize);
            },
            pageSizeChange: function () {
                if (this.ddlpageSize === 'All') {
                    this.pageSize = $scope.pagination.totalItems;
                } else {
                    this.pageSize = this.ddlpageSize;
                }
                this.pageNumber = 1;
                $scope.loadRecordsUser(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    $scope.loadRecordsUser(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    $scope.loadRecordsUser(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    $scope.loadRecordsUser(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    $scope.loadRecordsUser(1);
                }
            }
        };
        //**********----Get Custom Code List----***************
        function loadRecords_CustomCodeList(isPaging) {
            // For Loading
            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';

            //Ui Grid
            objcmnParam.pageNumber = ($scope.pagination.pageNumber - 1) * $scope.pagination.pageSize;
            objcmnParam.pageSize = $scope.pagination.pageSize;
            objcmnParam.IsPaging = isPaging;
            objcmnParam.InstituteID = vm.InstituteID;
            objcmnParam.LoggedUserID = vm.LoggedUserID;
            objcmnParam.SearchProperty = $scope.IsCallFromSearch === true ? $scope.SearchProperty : '';

            $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
                if (col.filters[0].term) {
                    return 'header-filtered';
                } else {
                    return '';
                }
            };

            $scope.gridOptionsCustomCodeList = {
                columnDefs: [
                    { name: 'InstituteName', displayName: 'Institute', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'MenuName', title: 'Menu Name', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'BrunchName', title: 'Branch', headerCellClass: $scope.highlightFilteredHeader },
                    {
                        name: 'Edit',
                        displayName: 'Edit',
                        width: '13%',
                        enableColumnResizing: false,
                        enableFiltering: false,
                        enableSorting: false,
                        headerCellClass: $scope.highlightFilteredHeader,
                        cellTemplate: '<span class="label label-success label-mini" style="background-color:#0aa699">' +
                        '<a href="javascript:void(0);" data-toggle="modal" style="background-color:#0aa699; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.EditCustomCode(row.entity)">' +
                        '<i class="fa fa-edit" aria-hidden="true">&nbsp;Edit</i></a></span>' +

                        '<span class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                        '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteMasterList(row.entity)">' +
                        '<i class="fa fa-trash" aria-hidden="true">&nbsp;Delete</i></a></span>'
                    }
                ],

                enableFiltering: true,
                enableGridMenu: true,
                enableSelectAll: true,
                exporterCsvFilename: 'CustomeCode.csv',
                exporterPdfDefaultStyle: { fontSize: 9 },
                exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
                exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
                exporterPdfHeader: { text: 'Custome Code List', style: 'headerStyle' },
                exporterPdfFooter: function (currentPage, pageCount) {
                    return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                },
                exporterPdfCustomFormatter: function (docDefinition) {
                    docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                    docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                    return docDefinition;
                },
                exporterPdfOrientation: 'portrait',
                exporterPdfPageSize: 'LETTER',
                exporterPdfMaxGridWidth: 500,
                exporterCsvLinkElement: angular.element(document.querySelectorAll('.custom-csv-link-location')),
            };

            var apiRoute = apiConfig.host + '/GetAllCustomCode';
            var processCustomCode = customCodeService.getMasterList(apiRoute, objcmnParam);
            processCustomCode.then(function (response) {
                //debugger;
                if (response.data.length > 0) {
                    $scope.pagination.totalItems = response.data[0].RecordTotal;
                    $scope.gridOptionsCustomCodeList.data = response.data;
                    $scope.ListCustomCodeList = response.data;
                    $scope.loaderMore = false;
                }
            },
                function (error) {
                    console.log('Error: ' + error);
                });
        }

        //**********----Add Event----***************
        $scope.AddCustomCodeDetails = function (dataModel) {
            //var IsDuplicate = false;
            //var list = $scope.ListCustomCodeDetails;
            var item = $scope.ListCustomCodeDetails.filter(function (ob, i) { return (ob.ParameterName === dataModel && ob.IsDeleted === false); })[0];
            //angular.forEach(list, function (value, key) {
            //    if (value.ParameterName === dataModel && value.IsDeleted === false) {
            //        IsDuplicate = true;
            //    }
            //});
            if (item === undefined) {
                var obj = {
                    RecordDetailID: 0,
                    RecordID: 0,
                    ParameterName: vm.ParameterName === undefined ? '' : vm.ParameterName,
                    Length: vm.Length === undefined ? null : vm.Length,
                    Seperator: vm.Seperator === undefined ? '' : vm.Seperator,
                    Sequence: vm.Sequence === undefined ? null : vm.Sequence,
                    IsDeleted: false
                };
                $scope.ListCustomCodeDetails.push(obj);

            }
            else {
                logger.warning('Already Exist!!!');
            }
            $scope.clearDetailsParameter();
        };

        //******************************Click Event *********************
        //Event Show List 
        $scope.ShowList = function () {
            //debugger;
            if ($scope.ToogleDiv === 0) {
                //$scope.ToogleShowListButtonName = 'Show List';
                $('#rowDetials').show(); //jshint ignore : line
                $('#cmnCustomCode').show(); //jshint ignore : line
                $('#rowList').hide(); //jshint ignore : line
                $scope.ToogleDiv = 1;
            }
            else {
                //$scope.ToogleShowListButtonName = 'Hide List';
                $('#rowDetials').hide(); //jshint ignore : line
                $('#cmnCustomCode').hide(); //jshint ignore : line
                $('#rowList').show(); //jshint ignore : line
                $scope.ToogleDiv = 0;
                loadRecords_CustomCodeList(0);
            }
        };
        $scope.ShowList();

        $scope.clear = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        //Edit List 
        $scope.EditCustomCode = function (dataModel) {
            //debugger;
            //Load Master 
            //$scope.ListCustomCodeList Load On Page Loading
            //debugger
            var list = $scope.ListCustomCodeList;
            angular.forEach(list, function (value, key) {
                if (value.RecordID === dataModel.RecordID) {
                    $scope.RecordID = value.RecordID;
                    vm.MenuID = value.MenuID;
                    vm.menu = { selected: vm.ListMenues.filter(function (ob, i) { return (ob.MenuID === vm.MenuID); })[0] };

                    vm.instituteID = value.InstituteID;
                    vm.BrunchID = value.BrunchID;
                    loadRecords_Institute('Edit');

                    vm.Prefix = value.Prefix === value.Prefix;
                    vm.Suffix = value.Suffix === value.Suffix;
                    vm.IsInstitute = value.IsInstitute;
                    vm.IsBranchCode = value.IsBranchCode;
                }
            });
            //Load Details By ID
            try {
                var params = {
                    InstituteID: dataModel.InstituteID,
                    LoggedUserID: vm.LoggedUserID,
                    RecordID: dataModel.RecordID
                };
                var apiRoute = apiConfig.host + '/spGetCustomCodeDetailByID';
                var processdetails = customCodeService.getDetailsByID(apiRoute, params);
                processdetails.then(function (response) {

                    $scope.clearDetails();
                    $scope.ListCustomCodeDetails = response.data;
                },
                    function (error) {
                        console.log('Error: ' + error);
                    });

            }
            catch (e) {

            }
            $scope.ToogleDiv = 0;
            $scope.ShowList();
            $scope.btnSaveUpdateText = 'Update';

        };

        //**********----Save----***************
        $scope.Save = function () {
            //debugger
            if ($scope.ListCustomCodeDetails.length > 0) {
                var customCodeMaster = {
                    RecordID: $scope.RecordID,
                    MenuID: vm.MenuID,
                    InstituteID: vm.instituteID,
                    BrunchID: vm.BrunchID === undefined ? null : vm.BrunchID,
                    Prefix: vm.Prefix === undefined ? '' : vm.Prefix,
                    Suffix: vm.Suffix === undefined ? '' : vm.Suffix,
                    IsInstitute: vm.IsInstitute === true ? 1 : 0,
                    IsBranchCode: vm.IsBranchCode === true ? 1 : 0,
                    LoggedUserID: vm.LoggedUserID,
                    //InstituteID: vm.instituteID,
                    customCodeDetails: $scope.ListCustomCodeDetails
                };

                customCodeService.setCustomCode(customCodeMaster)
                    .then(function (data) {
                        ////debugger;
                        logger.info('Saved Successfully!!!!');
                        $state.go($state.current.name, {}, { reload: true });
                    })
                    .catch(function (error) { });
            } else {
                logger.warning('Please Add custom custom code first!!!');
            }
        };

        //************ Reset Form *******************
        $scope.NewInstance = function () {
            $scope.clearMaster();
            $scope.clearDetailsParameter();
            $scope.clearDetails();
            $scope.ToogleDiv = 0;
            $scope.ShowList();
            $scope.RecordID = 0;
            vm.IsInstitute = false;
            vm.IsBranchCode = false;
            $scope.btnSaveUpdateText = 'Save';
            loadRecords_CustomCodeList(0);
        };

        //**********----Clear Details Panel----***************
        $scope.clearDetailsParameter = function () {
            vm.parameter = undefined;
            vm.ParameterName = undefined;
            vm.Sequence = '';
            vm.Length = '';
            vm.Seperator = '';
        };

        //**********----Clear Master Panel----***************
        $scope.clearMaster = function () {
            vm.menu = undefined;
            vm.MenuID = null;
            vm.institute = undefined;
            vm.instituteID = null;
            vm.Branch = undefined;
            vm.BrunchID = null;
            vm.branches = [];
            vm.Prefix = '';
            vm.Suffix = '';
            vm.IsInstitute = false;
            vm.IsBranchCode = false;
        };

        //**********----Clear Mater Panel----***************
        $scope.clearDetails = function () {
            $scope.ListCustomCodeDetails = [];
        };

        //**********----Delete Details ----***************
        $scope.deleteDetailsList = function (dataModel, index) {
            var IsConf = confirm('You are about to delete ' + dataModel.ParameterName + '. Are you sure?'); //jshint ignore : line
            if (IsConf) {
                if (dataModel.RecordDetailID === 0) {
                    $scope.ListCustomCodeDetails.splice(index, 1);
                }
                else {
                    dataModel.IsDeleted = true;
                }
                //var list = $scope.ListCustomCodeDetails;
                //angular.forEach(list, function (value, key) {
                //    if (value.ParameterName === dataModel.ParameterName) {
                //        value.IsDeleted = true;
                //    }
                //});
            }
        };

        //******************* Delete From Master List ********************
        $scope.deleteMasterList = function (dataModel) {
            //debugger
            var IsConf = confirm('You are about to delete ' + dataModel.MenuName + '. Are you sure?'); //jshint ignore : line
            if (IsConf) {
                //var list = $scope.ListCustomCodeList;
                //angular.forEach(list, function (value, key) {
                //    if (value.RecordID === dataModel.RecordID) {
                //        value.IsDeleted = true;
                //    }
                //});
                //debugger
                var apiRoute = apiConfig.host + '/spDeleteCustomCodeMasterDetail/' + dataModel.RecordID;
                var customCodeDeleteProcess = customCodeService.deleteByID(apiRoute);
                customCodeDeleteProcess.then(function (response) {
                    //debugger
                    if (response.data[0].result === 1) {
                        logger.info('Data deleted successfully!!!!');
                        loadRecords_CustomCodeList(0);
                    }
                }, function (error) {
                    console.log('Error: ' + error);
                });
            }
        };




        activate();

        function activate() {
            var promises = [loadRecords_Menues(), loadRecords_Institute(), loadparameterList(), loadRecords_CustomCodeList(0)];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }

        //Load Default Index param in scope End
        //**********----Get Mennues DropDown On Page Load----***************
        vm.MenuID = vm.menuId;
        function loadRecords_Menues() {
            var menuParams = {
                menuId: 0
            };

            menuSettings.getMenu(menuParams)
                .then(function (data) {
                    vm.ListMenues = data;
                    vm.menu = { selected: vm.ListMenues.filter(function (ob, i) { return (ob.MenuID === vm.MenuID); })[0] };
                },
                function (error) {
                    console.log('Error: ' + error);
                });
        }

        vm.instituteID = $localStorage.userInfo[0].InstituteID;
        //**********----Get Institute DropDown On Page Load----***************
        function loadRecords_Institute(status) {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            return classSettingsService.getInstitute()
                .then(function (data) {
                    vm.institutes = data;
                    vm.instituteID = vm.instituteID;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };
                    vm.loadRecords_Branch(status, vm.instituteID);
                });
        }

        function loadparameterList() {
            vm.parameterList = [
                { ParameterName: 'Prefix' },
                { ParameterName: 'Suffix' },
                { ParameterName: 'Day' },
                { ParameterName: 'Month' },
                { ParameterName: 'Year' },
                { ParameterName: 'IsInstituteRequired' },
                { ParameterName: 'AutoNo' }];
        }

        vm.loadRecords_Branch = function (status, institute) {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line
            vm.branches = [];
            var params = {
                instituteId: institute
            };

            branchSettingsSevice.getBranchByInstituteId(params)
                .then(function (data) {
                    //debugger;
                    vm.branches = data;
                    if (status === 'Edit') {
                        vm.Branch = { selected: vm.branches.filter(function (ob, i) { return (ob.BrunchID === vm.BrunchID); })[0] };
                    }
                });
        };

    }
})();
