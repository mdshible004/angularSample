(function () {
    'use strict';

    angular
        .module('app.syllabus')
        .controller('SyllabusController', SyllabusController);

    SyllabusController.$inject = ['syllabusSevice', 'conversion', 'classSettingsService', 'subjectSettingsSevice', 'exameRoutineEntry', 'insExameSetting', 'commonService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function SyllabusController(syllabusSevice, conversion, classSettingsService, subjectSettingsSevice, exameRoutineEntry, insExameSetting, commonService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, apiConfig) {

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
        $scope.imgShowSignature = false;


        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.showItem1 = false;
        $scope.createItem = true;
        $scope.addRoutin = true;
        $scope.addExameRoutin = false;
        $scope.addpassmarks = false;
        $scope.editRoutint = false;
        $scope.createmarks = false;
        $scope.itemEvent = function () {
            $scope.showItem = true;
            $scope.createItem = true;
            $scope.addRoutin = true;

        };


        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };


        $scope.create = function () {
            $scope.createItem = true;
            $scope.addRoutin = true;
            $scope.addExameRoutin = false;
            $scope.createmarks = false;
            $scope.addpassmarks = false;
        };

        vm.getAcademicClassDay = function () {
            $scope.showItem1 = false;
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line
                        
            //$scope.addExameRoutin = true;
            $scope.createItem = true;
            
            var Params = {
                InstituteID: vm.institute.selected.InstituteID,
                MediumID: vm.medium.selected.MediumID,
                ClassID: vm.ClassID === undefined ? null : vm.ClassID,
                DepartmentID: vm.DepartmentID === undefined ? null : vm.DepartmentID,
                SectionID: vm.SectionID === undefined ? null : vm.SectionID,
                SubjectID: vm.SubjectID === undefined ? null : vm.SubjectID,
                ExamID: vm.ExamID === undefined ? null : vm.ExamID

            };
            return syllabusSevice.getAcademicClassDay(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        if (data[0].SuccessValue === 1) {
                            $scope.addRoutin = true;
                            vm.classDays = data;
                        }
                        else {
                            $scope.addRoutin = false;
                            logger.info('Your desired syllabus already exists, You can update it');
                        }
                    } else {
                        $scope.addRoutin = false;
                        logger.error('Your desired data not found !!!');
                    }
                });

        };

        vm.getAcademicClassDayByID = function (model) {

            $scope.showItem1 = false;

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line            
            //$scope.addExameRoutin = true;            
            var Params = {
                InstituteID: vm.institute.selected.InstituteID,                
                SyllabusID: model.SyllabusID

            };
            return syllabusSevice.getAcademicClassDayByID(Params)
                .then(function (data) {
                        vm.classDays = data;
                });

        };

        vm.getUrlMasterByID = function (id) {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            $scope.showItem = true;
            var Params = {
                SyllabusID: id
            
            };
            return syllabusSevice.getUrlMasterByID(Params)
                .then(function (data) {
                    $scope.syllabusUrlList = data;
                    //$scope.syllabusUrlList.push({ SyllabusUrlID: 0, SyllabusID: 0, SyllabusUrl: '', FileName: '' });
                });

        };

        vm.getClassTopicDetailUrlByID = function (id) {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            $scope.showItem = true;
            var Params = {
                SyllabusID: id

            };
            return syllabusSevice.getClassTopicDetailUrlByID(Params)
                .then(function (data) {
                    $scope.syllabusTopicUrlList = data;
                    //$scope.syllabusTopicUrlList.push({ SyllabusTopicUrlDetailID: 0, SyllabusDetailID: 0, ContentUrl: '', FileName: '' });
                });

        };


        vm.imgHost = apiConfig.imagehost;

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
                vm.getInsSyllabusMaster(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    vm.getInsSyllabusMaster(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    vm.getInsSyllabusMaster(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    vm.getInsSyllabusMaster(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    vm.getInsSyllabusMaster(1);
                }
            }
        };
        vm.getInsSyllabusMaster = function (isPaging) {

            $scope.gridOptions.enableFiltering = true;

            $scope.loaderMore = true;
            //$scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID;
            objcmnParam.SyllabusID = 0;
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
                rowTemplate: '<div ng-dblclick="grid.appScope.editSyllabus(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                columnDefs: [
                    { name: 'Medium', displayName: 'Medium', headerCellClass: $scope.highlightFilteredHeader },

                    { name: 'Class', displayName: 'Class', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Department', displayName: 'Department', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Section', displayName: 'Section', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Exam', displayName: 'Exam', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'SubjectName', displayName: 'SubjectName', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Institute', displayName: 'Institute', headerCellClass: $scope.highlightFilteredHeader },

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
                        '<a href="javascript:void(0);" data-toggle="modal"  style="background-color:#0aa699; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editSyllabus(row.entity, 0)">' +
                        '<i class="fa fa-edit" aria-hidden="true">&nbsp;Edit</i></a></button>' +

                        '<button class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                        '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteInsSyllabus(row.entity)">' +
                        '<i class="fa fa-trash" aria-hidden="true">&nbsp;Delete</i></a></button>' +

                        '<button class="label label-success label-mini" style="background-color:#0e710f">' +
                        '<a href="javascript:void(0);"  style="background-color:#0e710f; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.printSyllabus(row.entity, 1)">' +
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

            return syllabusSevice.getInsSyllabusMaster(objcmnParam)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.pagination.totalItems = data[0].RecordTotal;
                        $scope.gridOptions.data = data;
                        $scope.showItem1 = true;
                        $scope.createItem = false;
                        $scope.addRoutin = false;

                    }
                    else {
                        $scope.showItem1 = false;
                        $scope.createItem = true;
                        logger.error('Your desired data not found');
                    }

                });

        };

        $scope.RefreshList = function () {
            $scope.pagination.pageNumber = 1;
            vm.getInsSyllabusMaster(0);


        };

        //************************************************End Grid******************************************************

        vm.SyllabusID = 0;
        vm.setInsSyllabus = function () {
            if ($scope.syllabusUrlList.length===0) {
                logger.error('No Lesson Plan Found to Save!!!');
            }
            //var MainDetailArray = vm.classDays.filter(function (ob, i) { return (ob.Topic !== ''); });
            else {
                $scope.dis = true;
            if (vm.classDays.length > 0) {
                angular.forEach(vm.classDays, function (row) {
                    row.ClassDates = conversion.getStringToDate(row.ClassDate);
                });
            }

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line

            syllabusSevice.setInsSyllabus({
                SyllabusID: vm.SyllabusID,
                SyllabusUrlID: /*vm.PassMarkID*/0,
                SyllabusTopicUrlDetailID: /*vm.SyllabusTopicUrlDetailID*/0,
                SyllabusDetailID: /*vm.SyllabusDetailID*/0,
                ExamID: vm.ExamID,
                DepartmentID: vm.DepartmentID,
                MediumID: vm.MediumID,
                ClassID: vm.ClassID,
                SubjectID: vm.SubjectID,
                SectionID: vm.SectionID,
                IsActive: 1,
                InstituteID: vm.institute.selected.InstituteID,
                LoggedUserID: $localStorage.userInfo[0].UserID,
                MasterUrlArray: $scope.syllabusUrlList,
                DetailArray: vm.classDays,
                DetailUrlArray: $scope.syllabusTopicUrlListSave

            })
                .then(function (data) {
                        logger.info('Saved!');
                        $scope.dis = false;
                        $state.go($state.current.name, {}, { reload: true });
                })
                .catch(function (error) { });
        }
        };

        $scope.syllabusUrlList = [];
        $scope.errorImmage = '';
        $scope.uploadFilesSylUrl = function (file, errFiles) {
            $scope.fileList = file;

            if (errFiles.length > 0) {
                logger.error('Max size 1MB required!!!');
                return;
            }

            if ((file !== null && file.$ngfBlobUrl != null) && vm.ImageUrl === undefined) {
                //$scope.Simage = file.$ngfBlobUrl;
                console.log('ok');
            }
            $scope.errFile = errFiles && errFiles[0];

            if ($scope.fileList.length > 0) {
                var counts = 0;
                for (var i = 0; i < $scope.fileList.length; i++) {
                    var sfile = $scope.fileList[i];
                    if (sfile) {
                        sfile.upload = Upload.upload({
                            url: apiConfig.imagehost + 'api/onEms/uploads/' + $localStorage.userInfo[0].InstituteName + '/null/null',
                            method: 'POST',
                            data: { file: sfile }
                        });

                        sfile.upload.then(function (response) {
                            $timeout(function () {
                                var data = JSON.parse(response.data);
                                if ($scope.syllabusUrlList.length === 0 && counts === 0) {
                                    $scope.syllabusUrlList.push({ SyllabusUrlID: 0, SyllabusID: 0, SyllabusUrl: '', FileName: '' });
                                    $scope.syllabusUrlList[0].SyllabusUrl = data.path;
                                    $scope.errorImmage = $scope.syllabusUrlList[0].SyllabusUrl.split('.')[1] === 'pdf' ? 'images/imagePdf.png' : 'images/imageExcel.png';
                                    counts = 1;
                                }
                                else {
                                    $scope.syllabusUrlList.push({ SyllabusUrlID: 0, SyllabusID: 0, SyllabusUrl: '', FileName: '' });
                                    $scope.syllabusUrlList[$scope.syllabusUrlList.length - 1].SyllabusUrl = data.path;

                                }
                            });
                        }, function (response) {
                            if (response.status > 0) {
                                $scope.errorMsg = response.status + ': ' + response.data;
                            }
                        }, function (evt) {
                            sfile.progress = Math.min(100, parseInt(100.0 *
                                evt.loaded / evt.total));
                        });

                        $scope.imgShowSignature = true;
                    }
                }
            }

        };
        vm.DetailArray = [];
        $scope.TopicModel = ''; $scope.TopicIndex = null;
        //$scope.loadTopicPopUp = function (dataModel, index) {
        //    $scope.TopicModel = dataModel;
        //    $scope.TopicIndex = index;

        //    if ($scope.syllabusTopicUrlListSave.length > 0) {

        //        var modellist = $scope.syllabusTopicUrlListSave.filter(function (ob, i) { return (ob.SyllabusDetailID === $scope.TopicIndex); });
        //        if (modellist.length > 0) {
        //            $scope.syllabusTopicUrlList = modellist;
        //        }
        //        else {
        //            $scope.syllabusTopicUrlList = [];
        //        }
        //    }
        //};
        $scope.loadTopicPopUp = function (dataModel, index) {
            $scope.TopicModel = dataModel;
            $scope.TopicIndex = index;

            vm.Topic = dataModel.Topic;
            vm.TopicDetails = dataModel.TopicDetail;
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            $scope.showItem = true;
            var Params = {
                SyllabusID: dataModel.SyllabusID,
                SyllabusDetailID: dataModel.SyllabusDetailID

            };
            return syllabusSevice.getUrlTopicDetailByID(Params)
                .then(function (data) {
                    $scope.syllabusTopicUrlList = data;
                    //$scope.syllabusTopicUrlList.push({ SyllabusTopicUrlDetailID: 0, SyllabusDetailID: 0, ContentUrl: '', FileName: '' });
                });
        };
        $scope.syllabusTopicUrlList = [];
        $scope.syllabusTopicUrlListSave = [];
        //$scope.errorImmage = '';
        $scope.uploadFilesTopicUrl = function (file, errFiles) {
            $scope.fileTopicList = file;

            if (errFiles.length > 0) {
                logger.error('Max size 1MB required!!!');
                return;
            }

            if ((file !== null && file.$ngfBlobUrl != null) && vm.ImageUrl === undefined) {
                //$scope.Simage = file.$ngfBlobUrl;
                console.log('ok');
            }
            $scope.errFile = errFiles && errFiles[0];

            if ($scope.fileTopicList.length > 0) {
                var count = 0;
                for (var i = 0; i < $scope.fileTopicList.length; i++) {
                    var tfile = $scope.fileTopicList[i];
                    if (tfile) {
                        tfile.upload = Upload.upload({
                            url: apiConfig.imagehost + 'api/onEms/uploads/' + $localStorage.userInfo[0].InstituteName + '/null/null',
                            method: 'POST',
                            data: { file: tfile }
                        });

                        tfile.upload.then(function (response) {
                            $timeout(function () {
                                var data = JSON.parse(response.data);
                                if ($scope.syllabusTopicUrlList.length === 0 && count === 0) {
                                    $scope.syllabusTopicUrlList.push({ SyllabusTopicUrlDetailID: 0, SyllabusDetailID: 0, ContentUrl: '', FileName: '' });
                                    $scope.syllabusTopicUrlList[0].ContentUrl = data.path;
                                    $scope.syllabusTopicUrlList[0].SyllabusDetailID = $scope.TopicIndex;
                                    // $scope.errorImmage = $scope.syllabusTopicUrlList[0].SyllabusUrl.split('.')[1] === 'pdf' ? 'images/imagePdf.png' : 'images/imageExcel.png';
                                    count = 1;
                                }
                                else {
                                    $scope.syllabusTopicUrlList.push({ SyllabusTopicUrlDetailID: 0, SyllabusDetailID: 0, ContentUrl: '', FileName: '' });
                                    $scope.syllabusTopicUrlList[$scope.syllabusTopicUrlList.length - 1].ContentUrl = data.path;
                                    $scope.syllabusTopicUrlList[$scope.syllabusTopicUrlList.length - 1].SyllabusDetailID = $scope.TopicIndex;
                                }
                            });
                        }, function (response) {
                            if (response.status > 0) {
                                $scope.errorMsg = response.status + ': ' + response.data;
                            }
                        }, function (evt) {
                            tfile.progress = Math.min(100, parseInt(100.0 *
                                evt.loaded / evt.total));
                        });

                        //$scope.imgShowSignature = true;
                    }
                }
            }

        };

        $scope.saveTopicUrlDetail = function () {
            if ($scope.syllabusTopicUrlList.length > 0) {
                if ($scope.syllabusTopicUrlListSave.length > 0) {
                    var TUSList = $scope.syllabusTopicUrlListSave.filter(function (ob, i) { return (ob.SyllabusDetailID === $scope.TopicIndex); });
                    if (TUSList.length > 0) {
                        angular.forEach($scope.syllabusTopicUrlList, function (row) {
                            var getmodel = $scope.syllabusTopicUrlListSave.filter(function (ob, i) { return (ob.SyllabusDetailID === $scope.TopicIndex && ob.ContentUrl === row.ContentUrl && ob.FileName === row.FileName); })[0];
                            if (getmodel === undefined) {
                                $scope.syllabusTopicUrlListSave.push({ SyllabusTopicUrlDetailID: row.SyllabusTopicUrlDetailID, SyllabusDetailID: $scope.TopicIndex, ContentUrl: row.ContentUrl, FileName: row.FileName });
                            }
                        });
                    }
                    else {
                        angular.forEach($scope.syllabusTopicUrlList, function (row) {
                            $scope.syllabusTopicUrlListSave.push({ SyllabusTopicUrlDetailID: row.SyllabusTopicUrlDetailID, SyllabusDetailID: $scope.TopicIndex, ContentUrl: row.ContentUrl, FileName: row.FileName });
                        });
                    }

                }
                else {
                    $scope.syllabusTopicUrlListSave = $scope.syllabusTopicUrlList;
                }
            }
        };

        $scope.editSyllabus = function (model) {
            $scope.createItem = true;
            $scope.showItem1 = false;            
            $scope.addRoutin = true;
            vm.SyllabusID = model.SyllabusID;
            vm.instituteID = model.InstituteID;
            vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };
            vm.MediumID = model.MediumID;
            vm.medium = { selected: vm.mediums.filter(function (ob, i) { return (ob.MediumID === vm.MediumID); })[0] };
            vm.ClassID = model.ClassID;
            vm.DepartmentID = model.DepartmentID;
            vm.SectionID = model.SectionID;
            vm.SubjectID = model.SubjectID;
            vm.ExamID = model.ExamID;
            //vm.Exame = { selected: vm.Exames.filter(function (ob, i) { return (ob.ExamID === vm.ExamID); })[0] };
            vm.getExame(vm.ExamID, 'Edit');
            vm.MediumWiseClassDDL(vm.MediumID, 'Edit');
            vm.ClassWiseDepartmentDDL(vm.ClassID, 'Edit');
            vm.ClassSelected(vm.SectionID, 'Edit');
            vm.getAcademicClassDayByID(model);
            vm.getUrlMasterByID(vm.SyllabusID);
            //vm.getClassTopicDetailUrlByID(vm.SyllabusID);
        };

        $scope.deleteInsSyllabus = function (model) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)) //jshint ignore : line


            var params = {
                SyllabusID: model.SyllabusID,
                InstituteID: vm.institute.selected.InstituteID,
                LoggedUserID: parseInt($localStorage.userInfo[0].UserID)
            };
            syllabusSevice.deleteInsSyllabus(params)
                .then(function (data) {
                    if (data[0].returnvalue===1) {
                        logger.info('Delete Successfully');
                        $state.go($state.current.name, {}, { reload: true });
                    } else {
                        logger.error('Delete Faild');
                    }
                })
                .catch(function (error) { });
        };


        $scope.ReloadDll = function () {
            vm.MediumID = null;
            vm.medium = undefined;
            vm.mediums = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
            // $scope.addRoutin = false;
        };
        $scope.ReloadMedium = function () {
            //vm.MediumID = null;
            vm.medium = undefined;
            vm.mediums = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
        };

        $scope.ReloadClass = function () {
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            //vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
        };
        $scope.ReloadDept = function () {
            vm.department = undefined;
            vm.departments = [];
        };

        $scope.change = function () {
            vm.medium = null;
            vm.class = null;
            vm.department = null;
            vm.classes = [];
            vm.departments = [];
            vm.mediums = [];
            vm.Exames = [];
            vm.Exame = undefined;
            $scope.addRoutin = false;
            $scope.syllabusUrlList = [];
        };
        $scope.changeMed = function () {

            vm.class = null;
            vm.department = null;
            vm.classes = [];
            vm.departments = [];
            $scope.addRoutin = false;
            $scope.syllabusUrlList = [];
        };
        $scope.changeCls = function () {
            vm.department = null;
            vm.departments = [];
            $scope.addRoutin = false;
            $scope.syllabusUrlList = [];
        };
        $scope.changexm = function () {
            $scope.addRoutin = false;
            $scope.syllabusUrlList = [];
        };
        $scope.changeDep = function () {
            $scope.addRoutin = false;
            $scope.syllabusUrlList = [];
        };
        $scope.changeSub = function () {
            $scope.addRoutin = false;
            $scope.syllabusUrlList = [];
        };
        $scope.changeSec = function () {
            $scope.addRoutin = false;
            $scope.syllabusUrlList = [];
        };
        activate();
        function activate() {
            var promises = [getInstitute('')];
            return $q.all(promises).then(function () {
            });
        }

        vm.InsID = vm.institute === undefined ? $localStorage.userInfo[0].InstituteID : vm.institute.selected.InstituteID;
        function getInstitute(status) {
            if (status === '') {
                $scope.ReloadDll();
            }

            return classSettingsService.getInstitute()
                .then(function (data) {
                    vm.institutes = data;
                    vm.instituteID = status === 'Edit' ? vm.institute.selected.InstituteID : $localStorage.userInfo[0].InstituteID;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };
                    vm.getmediumNameDdl(vm.instituteID, status);
                    vm.getExame(vm.instituteID);
                });
        }

        vm.getmediumNameDdl = function (InstituteID, status) {
            if (status === '') {
                $scope.ReloadMedium();
            }

            var Params = {
                instituteId: InstituteID
            };
            return commonService.getInstituteMediumDdl(Params)
                .then(function (data) {
                    vm.mediums = data;

                    if (status === 'Edit') {
                        vm.medium = {
                            selected: vm.mediums.filter(function (ob, i) {
                                return (ob.MediumID === vm.MediumID);
                            })[0]
                        };
                    }
                });

        };

        vm.MediumWiseClassDDL = function (MediumID, status) {
            if (status === '') {
                $scope.ReloadClass();
            }

            if (vm.MediumID !== null) {
                var Params = {
                    InstituteID: vm.institute.selected.InstituteID,
                    MediumID: MediumID
                };
                return subjectSettingsSevice.getMediumWiseClassDDL(Params)
                    .then(function (data) {
                        vm.classes = data;

                        if (status === 'Edit') {
                            vm.class = {
                                selected: vm.classes.filter(function (ob, i) {
                                    return (ob.ClassID === vm.ClassID);
                                })[0]
                            };
                        }

                    });
            }
            else {
                logger.error('Select Medium first');
            }
        };

        vm.ClassWiseDepartmentDDL = function (ClassID, status) {
            if (status === '') {
                $scope.ReloadDept();
            }

            var Params = {
                InstituteID: vm.institute.selected.InstituteID,
                ClassID: ClassID,
                MediumID: vm.MediumID
            };
            return subjectSettingsSevice.getClassWiseDepartmentDDL(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        vm.departments = data;
                        $scope.IsRequired = true;
                        //vm.subjectDDL();
                        if (status === 'Edit') {
                            vm.department = {
                                selected: vm.departments.filter(function (ob, i) {
                                    return (ob.DepartmentID === vm.DepartmentID);
                                })[0]
                            };
                            vm.subjectDDL('Edit');
                        }
                    }
                    else {
                        $scope.IsRequired = false;
                        vm.subjectDDL(0);
                    }
                });

        };
        vm.ClassSelected = function (ID, Status) {
            vm.subjectDDL(0);
            if (status === '') {
                vm.SectionID = null;
                vm.section = undefined;
                vm.sections = [];
            }

            var params = {
                instituteId: $localStorage.userInfo[0].InstituteID,
                classId: vm.ClassID,
                DepartmentID: vm.DepartmentID === undefined ? null : vm.DepartmentID
            };

            commonService.getInstituteSection(params)
                .then(function (data) {
                    if (data.length > 0) {
                        vm.sections = data;
                        $scope.secRequired = true;
                        if (Status === 'Edit') {
                            vm.SectionID = ID;
                            if (vm.section === undefined) {
                                vm.section = {
                                    selected: vm.sections.filter(function (ob, i) {
                                        return ob.SectionID === ID;
                                    })[0]
                                };
                            }
                        }
                    }
                    else {
                        $scope.secRequired = false;
                    }
                });

        };
        vm.subjectDDL = function (status) {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            $scope.btnDis = false;
            var subjectParams = {
                InstituteID: vm.institute.selected.InstituteID,
                DepartmentID: vm.DepartmentID === undefined ? null : vm.DepartmentID,
                MediumID: vm.MediumID === undefined ? null : vm.MediumID,
                ClassID: vm.ClassID === undefined ? null : vm.ClassID

            };

            return subjectSettingsSevice.getSubjectByParms(subjectParams)
                .then(function (data) {
                    vm.subjects = [];
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].IsActive === 1 || data[i].IsActive === true) {
                            vm.subjects.push(data[i]);
                        }
                    }
                    if (status === 'Edit') {
                        vm.subject = {
                            selected: vm.subjects.filter(function (ob, i) {
                                return (ob.SubjectID === vm.SubjectID);
                            })[0]
                        };
                    }

                });

        };
        vm.getExame = function (ID, status) {


            //Generate Token API Pass Call
            // authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            var Params = {
                InstituteID: vm.instituteID,
                MediumID: vm.MediumID,
                ClassID: vm.ClassID
            };
            return insExameSetting.getAllExamesDDL(Params)
                .then(function (data) {
                    vm.Exames = [];
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].IsActive === 1 || data[i].IsActive === true) {
                                vm.Exames.push(data[i]);

                            }

                        }
                        if (status === 'Edit') {
                            vm.Exame = {
                                selected: vm.Exames.filter(function (ob, i) {
                                    return (ob.ExamID === ID);
                                })[0]
                            };
                        }

                    }
                });
        };

        $scope.printSyllabus = function (model) {
            $scope.createItem = false;
            //$scope.showItem1 = false;
            $scope.showItem1 = true;
            vm.SyllabusID = model.SyllabusID;
            vm.instituteID = model.InstituteID;
            vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };
            vm.MediumID = model.MediumID;
            vm.medium = { selected: vm.mediums.filter(function (ob, i) { return (ob.MediumID === vm.MediumID); })[0] };
            vm.ClassID = model.ClassID;
            vm.DepartmentID = model.DepartmentID;
            vm.SectionID = model.SectionID;
            vm.SubjectID = model.SubjectID;
            vm.ExamID = model.ExamID;
            //vm.Exame = { selected: vm.Exames.filter(function (ob, i) { return (ob.ExamID === vm.ExamID); })[0] };
            vm.getExame(vm.ExamID, 'Edit');
            vm.MediumWiseClassDDL(vm.MediumID, 'Edit');
            vm.ClassWiseDepartmentDDL(vm.ClassID, 'Edit');
            vm.ClassSelected(vm.SectionID, 'Edit');
            vm.getAcademicClassDayByID(model);
            vm.getUrlMasterByID(vm.SyllabusID);
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
            }, 150);
            $scope.showItem1 = true;
        };

    }
})();
