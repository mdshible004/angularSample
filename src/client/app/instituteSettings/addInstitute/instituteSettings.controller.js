(function () {
    'use strict';

    angular
        .module('app.instituteSettings')
        .controller('instituteSettingsController', instituteSettingsController);

    instituteSettingsController.$inject = ['instituteSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', 'apiConfig', '$localStorage'];
    /* @ngInject */
    function instituteSettingsController(instituteSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, apiConfig, $localStorage) {
        


         var vm = this;
         //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;




        var objcmnParam = {};
        vm.imgHost = apiConfig.imagehost;

        vm.IsActive = false;
        $scope.showItem = false;
        $scope.createItem = true;

        $scope.listEvent = function () {

            $scope.showItem = false;
            $scope.createItem = true;
            $state.go($state.current.name, {}, { reload: true });
        };
        function clear() {
            $state.go($state.current.name, {}, { reload: true });
        }

        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        $scope.imgShow = false;
        $scope.imgShowSignature = false;

       

        //  ---------------Image Upload -------------------

        $scope.uploadFiles = function (file, errFiles) {
            //debugger;
            $scope.f = file;
            if (errFiles.length > 0) {
                logger.error('Max size 1MB required!!!');
                return;
            }
            if (file !== null && file.$ngfBlobUrl != null) {
                $scope.Uimage = file.$ngfBlobUrl;
            }
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: apiConfig.imagehost + 'api/onEms/uploads/' + $localStorage.userInfo[0].InstituteName + '/' + null + '/' + null,
                    method: 'POST',
                    data: { file: file }
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        var data = JSON.parse(response.data);
                            vm.ImageUrl = data.path;
                    });
                }, function (response) {
                    if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data;
                    }
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            }
            $scope.imgShow = true;
        };


        // ------------------- Signature -------------
        $scope.uploadFilesSignature = function (file, errFiles) {
            $scope.f = file;
            if (errFiles.length > 0) {
                logger.error('Max size 1MB required!!!');
                return;
            }
            if (file !== null && file.$ngfBlobUrl != null) {
                $scope.Simage = file.$ngfBlobUrl;
            }
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: apiConfig.imagehost + 'api/onEms/uploads/' + $localStorage.userInfo[0].InstituteName + '/' + null + '/' + null,
                    method: 'POST',
                    data: { file: file }
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        var data = JSON.parse(response.data);
                        vm.SignatureUrl = data.path;
                    });
                }, function (response) {
                    if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data;
                    }
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            }
            $scope.imgShowSignature = true;
        };

        //vm.IsActive = false;
        vm.AddInstituteSetting = function () {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line

            if (vm.instituteSetup.InstituteName === null || vm.instituteSetup.InstituteName === undefined || vm.instituteSetup.InstituteName === '') {
                logger.error('Please Enter Institute Name');

            } else {
                //debugger
                instituteSettings.postInstituteInformation({
                    InstituteID: 0,
                    InstituteCode: vm.instituteSetup.InstituteCode === undefined ? '' : vm.instituteSetup.InstituteCode,
                    ResigtrationNo: vm.instituteSetup.ResigtrationNo === undefined || vm.instituteSetup.ResigtrationNo === '' ? '' : vm.instituteSetup.ResigtrationNo,
                    InstituteNo: vm.instituteSetup.InstituteNo === undefined || vm.instituteSetup.InstituteNo === '' ? '' : vm.instituteSetup.InstituteNo,
                    InstituteName: vm.instituteSetup.InstituteName,
                    InstituteShortName: vm.instituteSetup.InstituteShortName === undefined || vm.instituteSetup.InstituteShortName === '' ? '' : vm.instituteSetup.InstituteShortName,
                    InstituteTypeID: vm.InstituteTypeID === undefined ? null : vm.InstituteTypeID,
                    BoardID: vm.BoardID === undefined ? null : vm.BoardID,
                    FounderName: vm.instituteSetup.FounderName === undefined || vm.instituteSetup.FounderName === '' ? '' : vm.instituteSetup.FounderName,
                    EstublishedYear: vm.instituteSetup.EstublishedYear === undefined ? null : vm.instituteSetup.EstublishedYear,
                    StatusID: vm.statusID === undefined ? null : vm.statusID,
                    ContactNo: vm.instituteSetup.ContactNo === undefined ? '' : vm.instituteSetup.ContactNo,
                    NoOfBuilding: vm.instituteSetup.NoOfBuilding === undefined ? null : vm.instituteSetup.NoOfBuilding,
                    InstituteLogo: vm.ImageUrl === undefined ? null : vm.ImageUrl,
                    PrinSignatureURL: vm.SignatureUrl === undefined ? null : vm.SignatureUrl ,
                    IsActive: vm.IsActive,
                    CreateBy: 0,
                    CreateOn: '2017-11-14',
                    CreatePc: 'Apple',
                    UpdateBy: null,
                    UpdateOn: '2017-11-14',
                    UpdatePc: 'Apple',
                    IsDeleted: 0,
                    DeleteBy: null,
                    DeleteOn: '2017-11-14',
                    DeletePc: 'Apple',

                })
                    .then(function (data) {
                        if (data[0].ReturnValue === 'Duplicate') {
                            logger.error('Institute Already Exists..............!');
                        } else {
                            logger.info('Saved!');
                            $scope.showItem = false;
                            //$scope.RefreshList();
                            $state.go($state.current.name, {}, { reload: true });

                        }

                    })
                    .catch(function (error) { });
            }



        };


        var Year = new Date().getFullYear();

        $scope.ChecEstYear = function (model) {
            if (model > Year) {
                logger.error('Est Year can not be greater than current year!!!!!!!');
                vm.instituteSetup.EstublishedYear = Year;
            }
        };


        vm.instituteSetup={};
        $scope.getInstituteByID = function (model) {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            objcmnParam.InstituteID = model.InstituteID;
            objcmnParam.LoggedUser = $localStorage.userInfo[0].UserID;
            objcmnParam.PageNo = 0;
            objcmnParam.RowCountPerPage = 0;
            objcmnParam.IsPaging = 0;
            objcmnParam.SearchProperty = '';

            instituteSettings.getInstituteForUI(objcmnParam)

                .then(function (data) {
                    vm.instituteSetup.InstituteCode = data[0].InstituteCode;
                    vm.instituteSetup.InstituteID = data[0].InstituteID;
                    vm.instituteSetup.ResigtrationNo = data[0].ResigtrationNo;
                    vm.instituteSetup.InstituteNo = data[0].InstituteNo;
                    vm.instituteSetup.InstituteName = data[0].InstituteName;
                    vm.instituteSetup.InstituteShortName = data[0].InstituteShortName;
                    vm.UIsActive = data[0].IsActive;
                    //debugger;
                    if (data[0].StatusID !== null) {
                        vm.statusID = data[0].StatusID;
                        vm.status = {
                            selected: vm.statuses.filter(function (ob, i) {
                                return (ob.StatusID === vm.statusID);
                            })[0]
                        };
                    }
                    vm.insTypes = {
                        selected: vm.insType.filter(function (ob, i) {
                            return (ob.InstituteTypeID === data[0].InstituteTypeID);
                        })[0]
                    };
                    vm.board = {
                        selected: vm.boards.filter(function (ob, i) {
                            return (ob.BoardID === data[0].BoardID);
                        })[0]
                    };
                    vm.instituteSetup.FounderName = data[0].FounderName;
                    vm.instituteSetup.EstublishedYear = data[0].EstublishedYear;
                    vm.instituteSetup.ContactNo = data[0].ContactNo;
                    vm.instituteSetup.NoOfBuilding = data[0].NoOfBuilding;
                    vm.ImageUrl = data[0].InstituteLogo;
                    vm.SignatureUrl = data[0].PrinSignatureURL;
                });
        };






        vm.patchInstitute = function () {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line

            if (vm.instituteSetup.InstituteName === null || vm.instituteSetup.InstituteName === undefined || vm.instituteSetup.InstituteName === '') {
                logger.error('Please Enter Institute Name');

            } else {
                vm.SignatureUrl = ($scope.PrinSignatureURL === undefined) ? vm.SignatureUrl : $scope.PrinSignatureURL;
                vm.ImageUrl = ($scope.InstituteLogo === undefined) ? vm.ImageUrl : $scope.InstituteLogo;

                instituteSettings.postInstituteInformation({
                    InstituteID: vm.instituteSetup.InstituteID,
                    InstituteCode: vm.instituteSetup.InstituteCode === undefined ? '' : vm.instituteSetup.InstituteCode,
                    ResigtrationNo: vm.instituteSetup.ResigtrationNo === undefined ? '' : vm.instituteSetup.ResigtrationNo,
                    InstituteNo: vm.instituteSetup.InstituteNo === undefined ? '' : vm.instituteSetup.InstituteNo,
                    InstituteName: vm.instituteSetup.InstituteName,
                    InstituteShortName: vm.instituteSetup.InstituteShortName === undefined ? '' : vm.instituteSetup.InstituteShortName,
                    InstituteTypeID: (vm.insTypes.selected === undefined) ? null : vm.insTypes.selected.InstituteTypeID,
                    BoardID: (vm.board.selected === undefined) ? null : vm.board.selected.BoardID,
                    FounderName: vm.instituteSetup.FounderName === undefined ? '' : vm.instituteSetup.FounderName,
                    EstublishedYear: vm.instituteSetup.EstublishedYear === undefined ? null : vm.instituteSetup.EstublishedYear,
                    StatusID: vm.statusID=== undefined ? null : vm.status.selected.StatusID,
                    ContactNo: vm.instituteSetup.ContactNo === undefined ? '' : vm.instituteSetup.ContactNo,
                    NoOfBuilding: vm.instituteSetup.NoOfBuilding === undefined ? null : vm.instituteSetup.NoOfBuilding,
                    InstituteLogo: vm.ImageUrl === undefined ? null : vm.ImageUrl,
                    PrinSignatureURL: vm.SignatureUrl === undefined ? null : vm.SignatureUrl,
                    IsActive: vm.UIsActive,
                    CreateBy: 0,
                    CreateOn: '2017-11-14',
                    CreatePc: 'Apple',
                    UpdateBy: null,
                    UpdateOn: '2017-11-14',
                    UpdatePc: 'Apple',
                    IsDeleted: 0,
                    DeleteBy: null,
                    DeleteOn: '2017-11-14',
                    DeletePc: 'Apple'
                })
                    .then(function (data) {

                        if (data[0].ReturnValue === 'Duplicate') {
                            logger.error('Institute Already Exists..............!');
                        } else {
                            logger.info('Updated Successfully!');
                            $scope.showItem = false;
                            //vm.getAllInstitute();
                            $scope.RefreshList();
                            $('#myModal').modal('hide'); //jshint ignore : line

                        }





                    })
                    .catch(function (error) { });
            }
        };



        $scope.deleteModels = function (model) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)); //jshint ignore : line

            instituteSettings.deleteInstitute({
                InstituteID: model.InstituteID,
                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    logger.info('Deleted Successfully!');
                    $scope.RefreshList();
                })
                .catch(function (error) { });

        };

        activate();

        function activate() {
            var promises = [getAllBoard(), getAllStatus(), getAllInstituteTypes()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }

        function getAllBoard() {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            return instituteSettings.getBoards()
                .then(function (data) {
                    vm.boards = data;
                });
        }
        function getAllStatus() {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            return instituteSettings.getStatus()
                .then(function (data) {
                    vm.statuses = data;
                });
        } 
        //vm.getAllInstitute = function () {
        //    return instituteSettings.getAllInsInstitute()
        //        .then(function (data) {
        //            vm.institutes = data;
        //            $scope.showItem = true;
        //            $scope.createItem = false;
        //        });
        //};


        function getAllInstituteTypes() {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            return instituteSettings.getInstituteTypes()
                .then(function (data) {
                  
                    vm.insType = data;
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
                vm.getAllInstitute(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    vm.getAllInstitute(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    vm.getAllInstitute(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    vm.getAllInstitute(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    vm.getAllInstitute(1);
                }
            }
        };
        vm.getAllInstitute = function (isPaging) {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            $scope.gridOptions.enableFiltering = true;

            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();
            objcmnParam.InstituteID = 0;
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
                rowTemplate: '<div ng-dblclick="grid.appScope.getInstituteByID(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                columnDefs: [
                    { name: 'InstituteID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'InstituteName', displayName: 'Institute', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ResigtrationNo', displayName: 'Resigtration No', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'FounderName', displayName: 'Founder', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'EstublishedYear', displayName: 'Estublished Year', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'InstituteTypeName', displayName: 'Institute Type', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Status', displayName: 'Status', headerCellClass: $scope.highlightFilteredHeader },
                    //{ name: 'IsActive', displayName: 'IsActive', headerCellClass: $scope.highlightFilteredHeader },
                  
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
                        '<a href="javascript:void(0);"  style="background-color:#0aa699; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.getInstituteByID(row.entity)">' +
                        '<i class="fa fa-edit"   data-toggle="modal" data-target="#myModal" aria-hidden="true">&nbsp;Edit</i></a></button>' +

                        '<button class="label label-danger label-mini" style="text-align:center; display:none; background-color:brown; color:white !important">' +
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


            return instituteSettings.getInstituteForUI(objcmnParam)
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
            vm.getAllInstitute(0);

            $scope.createItem = false;
            $scope.showItem = true;

        };

         //************************************************Start Grid******************************************************

    }
})();
