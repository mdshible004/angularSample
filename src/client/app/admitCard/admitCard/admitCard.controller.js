
(function () {
    'use strict';

    angular
        .module('app.admitCard')
        .controller('admitCardController', admitCardController);

    admitCardController.$inject = ['admitCardSetup', 'insExameSetting', 'periodSetup', 'classSettingsService', 'subjectSettingsSevice', 'commonService', 'conversion', 'teacherAttendanceSevice', 'apiConfig', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function admitCardController(admitCardSetup, insExameSetting, periodSetup, classSettingsService, subjectSettingsSevice, commonService, conversion, teacherAttendanceSevice, apiConfig, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

        var vm = this;
        $scope.disButton = false;
        $scope.resultBtn = true;
        //$scope.disStudent = true;
        $scope.addPassMark = false;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        $scope.InstituteLogo = $localStorage.userInfo[0].InstituteLogo;
        vm.imgHost = apiConfig.imagehost;
        $scope.InstituteLogoUrl = vm.imgHost + $scope.InstituteLogo;
        $scope.InstituteName = $localStorage.userInfo[0].InstituteName;
        $scope.InsEmail = $localStorage.userInfo[0].InsEmail;
        $scope.InsAddress = $localStorage.userInfo[0].InsAddress;
        $scope.InsWeb = $localStorage.userInfo[0].InsWeb;
        $scope.InsPhoneNo = $localStorage.userInfo[0].InsPhoneNo;
        $scope.Branch = $localStorage.userInfo[0].BrunchName;
        $scope.IsBranch = $scope.Branch === null ? false : true;
        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.listEvent = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.showItem = true;
            $scope.createItem = false;
            $scope.RefreshList();
        };

        $scope.itemEvent = function () {
            $scope.showItem = false;
            $scope.createItem = true;
        };
        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };


        //************************************************Start Grid Modal******************************************************
        //***************Start ServerSide Search********************************************
        $scope.SearchProperty = '';
        $scope.IsCallFromSearch = false;
        $scope.SearchModalCancel = function () {
            $scope.SearchProperty = '';
            $scope.SearchModalNow($scope.SearchProperty);
        };

        $scope.SearchModalNow = function (searchstring) {
            //debugger;
            $scope.IsCallFromSearch = searchstring === '' ? false : true;
            $scope.SearchProperty = searchstring.toString();
            $scope.paginationModal.pageNumber = 2;
            $scope.paginationModal.firstPage();
        };
        //***************End ServerSide Search********************************************
        var objcmnParam = {};
        $scope.gridOptionsModal = [];
        $scope.paginationModal = {
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

                    this.pageSize = $scope.paginationModal.totalItems;
                }
                else {
                    this.pageSize = this.ddlpageSize;
                }

                this.pageNumber = 1;
                $scope.getAllStudent(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    $scope.getAllStudent(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    $scope.getAllStudent(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    $scope.getAllStudent(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    $scope.getAllStudent(1);
                }
            }
        };
        $scope.getAllStudent = function (isPaging) {
            $scope.gridOptionsModal.enableFiltering = true;

            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();  

            objcmnParam.pageNumber = ($scope.paginationModal.pageNumber - 1) * $scope.paginationModal.pageSize;
            objcmnParam.pageSize = $scope.paginationModal.pageSize;
            objcmnParam.IsPaging = isPaging;
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID;
            objcmnParam.LoggedUserID = $localStorage.userInfo[0].UserID;
            objcmnParam.UserID = 0;
            objcmnParam.ClassID = (vm.ClassID === undefined || vm.ClassID === null) ? 0 : vm.ClassID;
            objcmnParam.SectionID = (vm.SectionID === undefined || vm.SectionID === null) ? 0 : vm.SectionID;
            objcmnParam.DepartmentID = (vm.DepartmentID === undefined || vm.DepartmentID === null) ? 0 : vm.DepartmentID;
            objcmnParam.MediumID = (vm.MediumID === undefined || vm.MediumID === null) ? 0 : vm.MediumID;
            objcmnParam.ShiftID = (vm.ShiftID === undefined || vm.ShiftID === null) ? 0 : vm.ShiftID;

            //objcmnParam.SearchProperty = $scope.IsCallFromSearch === true ? $scope.SearchProperty : '';

            $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
                if (col.filters[0].term) {
                    return 'header-filtered';
                } else {
                    return '';
                }
            };
            $scope.gridOptionsModal = {
                useExternalPagination: true,
                useExternalSorting: true,
                enableFiltering: true,
                enableRowSelection: true,
                enableSelectAll: true,
                showFooter: true,
                enableGridMenu: true,
                rowTemplate: '<div ng-dblclick="grid.appScope.editModels(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                columnDefs: [
                    { name: 'UserName', displayName: 'Student', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'RollNo', displayName: 'RollNo', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ClassName', displayName: 'Class', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'DepartmentName', displayName: 'Department', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'SectionName', displayName: 'Section', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'UserID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
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
                        '<a href="javascript:void(0);" data-toggle="modal" data-dismiss="modal" style="background-color:#0aa699; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.selectModels(row.entity)">' +
                        '<i class="fa fa-edit" aria-hidden="true">&nbsp;Select</i></a></button>' //+

                        //'<span class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                        //'<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteModels(row.entity)">' +
                        //'<i class="fa fa-trash" aria-hidden="true">&nbsp;Delete</i></a></span>'
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

            return commonService.getStudentBasicInfoList(objcmnParam)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.paginationModal.totalItems = data[0].RecordTotal;
                        $scope.gridOptionsModal.data = data;
                        //vm.registrationSetup = data;

                    }
                    else {
                        logger.error('Your desired data not found');
                    }
                    $scope.loaderMore = false;
                });
        };
        $scope.RefreshModalList = function () {
            $scope.paginationModal.pageNumber = 1;
            $scope.getAllStudent(0);
        };
        //************************************************End Grid Modal******************************************************



        //************************************************Start Grid Master******************************************************
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
                $scope.getAllAdmitCard(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    $scope.getAllAdmitCard(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    $scope.getAllAdmitCard(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    $scope.getAllAdmitCard(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    $scope.getAllAdmitCard(1);
                }
            }
        };
        $scope.getAllAdmitCard = function (isPaging) {
            $scope.gridOptions.enableFiltering = true;

            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();  

            objcmnParam.pageNumber = ($scope.pagination.pageNumber - 1) * $scope.pagination.pageSize;
            objcmnParam.pageSize = $scope.pagination.pageSize;
            objcmnParam.IsPaging = isPaging;
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID;
            objcmnParam.LoggedUserID = $localStorage.userInfo[0].UserID;
            objcmnParam.UserID = 0;
            objcmnParam.ClassID = (vm.ClassID === undefined || vm.ClassID === null) ? 0 : vm.ClassID;
            objcmnParam.SectionID = (vm.SectionID === undefined || vm.SectionID === null) ? 0 : vm.SectionID;
            objcmnParam.DepartmentID = (vm.DepartmentID === undefined || vm.DepartmentID === null) ? 0 : vm.DepartmentID;
            objcmnParam.MediumID = (vm.MediumID === undefined || vm.MediumID === null) ? 0 : vm.MediumID;
            objcmnParam.ShiftID = (vm.ShiftID === undefined || vm.ShiftID === null) ? 0 : vm.ShiftID;
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
                    { name: 'UserName', displayName: 'Student', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'RFID', displayName: 'Student ID', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'RollNo', displayName: 'Roll No', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'MediumName', displayName: 'Medium', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ClassName', displayName: 'Class', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'DepartmentName', displayName: 'Department', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'SectionName', displayName: 'Section', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ShiftName', displayName: 'ShiftName', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ExamName', displayName: 'Exam', headerCellClass: $scope.highlightFilteredHeader },
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
                        '<a href="javascript:void(0);" data-toggle="modal" data-dismiss="modal" style="background-color:#0aa699; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editModels(row.entity)">' +
                        '<i class="fa fa-edit" aria-hidden="true">&nbsp;Edit</i></a></button>' +

                        '<span class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                        '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteModels(row.entity)">' +
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

            return admitCardSetup.getStudentAdmitCard(objcmnParam)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.pagination.totalItems = data[0].RecordTotal;
                        $scope.gridOptions.data = data;
                        //vm.registrationSetup = data;

                    }
                    else {
                        logger.error('Your desired data not found');
                    }
                    $scope.loaderMore = false;
                });
        };
        $scope.RefreshList = function () {
            $scope.pagination.pageNumber = 1;
            $scope.getAllAdmitCard(0);
        };
        //************************************************End Grid Master******************************************************

        $scope.editModels = function (model) {
            $scope.SelectedModel = model;
            $scope.createItem = true;
            $scope.showItem = false;
            $scope.AdmitCardID = model.AdmitCardID;
            vm.ClassID = model.ClassID;
            vm.SectionID = model.SectionID;
            vm.DepartmentID = model.DepartmentID;
            vm.MediumID = model.MediumID;
            vm.ShiftID = model.ShiftID;
            vm.ExamID = model.ExamID;
            vm.UserID = model.UserID;
            vm.UserName = model.UserName;
            $scope.genQRCode = model.QRCode;
            $scope.ExamName = model.ExamName;
            $scope.getExamDetail();
            $scope.MakeQRCode($scope.genQRCode);
            vm.medium = { selected: vm.mediums.filter(function (ob, i) { return (ob.MediumID === vm.MediumID); })[0] };
            vm.shift = { selected: vm.shifts.filter(function (ob, i) { return (ob.ShiftID === vm.ShiftID); })[0] };
            vm.exam = { selected: vm.exames.filter(function (ob, i) { return (ob.ExamID === vm.ExamID); })[0] };
            vm.MediumWiseClassDDL(vm.MediumID, 'Edit');
            vm.ClassWiseDepartmentDDL(vm.ClassID, 'Edit');

            if (vm.SectionID !== null) {
                vm.ClassSelected(vm.SectionID, 'Edit');
            }


            vm.UserImage = vm.imgHost + model.ImageUrl;
            $scope.IsAdmitShow = true;
            $scope.printBtn = false;
        };

        $scope.SelectedModel = '';
        $scope.IsAdmitShow = false; $scope.printBtn = true;
        $scope.selectModels = function (model) {
            //debugger;
            $scope.SelectedModel = model;
            vm.UserName = model.UserName;
            vm.UserID = model.UserID;
            $scope.resultBtn = false;
        };

        $scope.genQRCode = '';
        $scope.generateQRCode = function (model) {
            //debugger;
            $scope.IsAdmitShow = true;
            $scope.printBtn = false;
            $scope.genQRCode = '';
            //if (model.UserName !== '') {
            //    $scope.genQRCode += ', Name: ' + model.UserName;
            //}

            //if (model.UserName !== '') {
            //    $scope.genQRCode += ', Roll: ' + model.RollNo;
            //}

            //if (model.MameName !== '') {
            //    $scope.genQRCode += ', Medium: ' + model.MameName;
            //}

            //if (model.ClassName !== '') {
            //    $scope.genQRCode += ', Class: ' + model.ClassName;
            //}

            //if (model.DepartmentName !== '') {
            //    $scope.genQRCode += ', Department: ' + model.DepartmentName;
            //}

            //if (model.SectionName !== '') {
            //    $scope.genQRCode += ', Section: ' + model.SectionName;
            //}

            //if (model.ShiftName !== '') {
            //    $scope.genQRCode += ', Shift: ' + model.ShiftName;
            //}

            //if (vm.ExamID !== null && vm.ExamID !== undefined) {
            //    $scope.genQRCode += ', Exam: ' + vm.exames.filter(function (ob, i) { return (ob.ExamID === vm.ExamID); })[0].ExamName;
            //}

            //$scope.genQRCode += ', InstituteID: ' + model.InstituteID.toString() + ', StudentID: ' + model.UserID + ', MediumID: ' + model.MediumID.toString() + ', ClassID: ' + model.ClassID.toString();

            //if (model.DepartmentID !== null) {
            //    $scope.genQRCode += ', DepartmentID: ' + model.DepartmentID;
            //}

            //if (model.SectionID !== null) {
            //    $scope.genQRCode += ', SectionID: ' + model.SectionID;
            //}

            //$scope.genQRCode += ', ShiftID: ' + model.ShiftID.toString() + ', ExamID: ' + vm.ExamID.toString();

            $scope.genQRCode += ', U: ' + model.UserClassID.toString() + ', E: ' + vm.ExamID.toString();


            $scope.genQRCode = $scope.genQRCode.replace(/^,/, '').trim();

            vm.UserImage = vm.imgHost + model.ImageUrl;

            $scope.MakeQRCode($scope.genQRCode);
        };

        $scope.MakeQRCode = function (QRModel) {
            //****************************QR Code*******************************
            $('#qrcode').empty(); //jshint ignore : line
            var qrcode = new QRCode('qrcode', { //jshint ignore : line
                width: 100,
                height: 80,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H //jshint ignore : line
            });

            qrcode.clear(); // clear the code.
            qrcode.makeCode(QRModel, 'Admit Card'); //1=code generate value and 2=set title make another code.
            //*****************************QR Code*******************************
        };

        $scope.ExamName = ''; $scope.ExamStartDate = null;
        $scope.getExamDetail = function () {
            //debugger;
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID;
            objcmnParam.ClassID = (vm.ClassID === undefined || vm.ClassID === null) ? 0 : vm.ClassID;
            objcmnParam.SectionID = (vm.SectionID === undefined || vm.SectionID === null) ? 0 : vm.SectionID;
            objcmnParam.DepartmentID = (vm.DepartmentID === undefined || vm.DepartmentID === null) ? 0 : vm.DepartmentID;
            objcmnParam.MediumID = (vm.MediumID === undefined || vm.MediumID === null) ? 0 : vm.MediumID;
            objcmnParam.ShiftID = (vm.ShiftID === undefined || vm.ShiftID === null) ? 0 : vm.ShiftID;
            objcmnParam.ExamID = (vm.ExamID === undefined || vm.ExamID === null) ? 0 : vm.ExamID;

            return insExameSetting.spGetExameStartEndDate(objcmnParam)
                .then(function (data) {
                    //debugger
                    if (data.length > 0) {
                        $scope.ExamName = data[0].ExamName;
                        $scope.ExamStartDate = data[0].ExamDate;
                    }
                });
        };

        $scope.printDiv = function (print) {
            //debugger;
            //$scope.isprint = false;
            var content = document.getElementById(print).innerHTML;
            var mywindow = window.open('', 'Print', 'height=1000,width=2000');
            var is_chrome = Boolean(mywindow.chrome);
            mywindow.document.write('<html><head><title></title>');
            mywindow.document.write('</head><body >');
            mywindow.document.write(content);
            mywindow.document.write('</body> <br/><br/>');
            mywindow.document.write('<footer style="position: fixed;bottom: 0;"> <font color="green">Powered By:</font><font color="blue"> onAir International Ltd. </font></footer>');
            mywindow.document.write('</html>');

            if (is_chrome) {
                setTimeout(function () { // wait until all resources loaded 
                    mywindow.document.close(); // necessary for IE >= 10
                    mywindow.focus(); // necessary for IE >= 10
                    mywindow.print(); // change window to winPrint
                    mywindow.close(); // change window to winPrint
                }, 100);
            } else {
                mywindow.document.close(); // necessary for IE >= 10
                mywindow.focus(); // necessary for IE >= 10

                mywindow.print();
                mywindow.close();
            }
            return true;
        };

        $scope.AdmitCardID = 0;
        vm.postAdmitCard = function () {

            admitCardSetup.SetInsAdmitCard({

                AdmitCardID: $scope.AdmitCardID,   //examMarks[0].ExamMarkID === null ? 0 : examMarks[0].ExamMarkID,             
                ExamID: vm.ExamID,
                SectionID: vm.SectionID === undefined ? null : vm.SectionID,
                ShiftID: vm.ShiftID === undefined ? null : vm.ShiftID,
                StudentID: vm.UserID,
                DepartmentID: vm.DepartmentID === undefined ? null : vm.DepartmentID,
                MeduimID: vm.MediumID,
                ClassID: vm.ClassID,
                //SubjectID: vm.SubjectID === undefined ? examMarks[0].SubjectID : vm.SubjectID,
                QRCode: $scope.genQRCode,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                LoggedUserID: $localStorage.userInfo[0].UserID,
                IsDeleted: 0,

            })
                .then(function (data) {
                    logger.info('Saved!');
                    $state.go($state.current.name, {}, { reload: true });
                })
                .catch(function (error) { });
        };



        //-------------- Load Option --------------------//

        $scope.ReloadDll = function () {

            vm.ShiftID = null;
            vm.shift = undefined;
            vm.shifts = [];
            vm.MediumID = null;
            vm.medium = undefined;
            vm.mediums = [];
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
            vm.subject = undefined;
            vm.values = [];
            vm.ExamID = null;
            vm.exam = undefined;
            vm.exames = [];
            vm.registrationSetup = null;
            vm.registrationSetup = [];
            $scope.resultBtn = true;
            $scope.gridOptions.data = [];
            $scope.showItem = false;
        };

        $scope.ReloadMedium = function (status) {
            if (status === 0) {
                vm.MediumID = null;

            }
            vm.medium = undefined;
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
            $scope.gridOptions.data = [];
        };


        $scope.ReloadClassByMedium = function () {
            vm.ClassID = null;

            vm.class = undefined;
            vm.classes = [];
        };

        $scope.ReloadClass = function (status) {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            $scope.gridOptions.data = [];

        };



        $scope.ReloadDept = function (status) {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            $scope.gridOptions.data = [];
            if (status === 0) {
                vm.DepartmentID = null;
            }
            vm.department = undefined;

        };

        activate();

        function activate() {
            var promises = [showexams(vm.InstituteID), getAllShift(vm.InstituteID), getmediumNameDdl(vm.InstituteID)  /*vm.showexams()*/

            ];
            return $q.all(promises).then(function () {
            });
        }



        $scope.ReloadSec = function () {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            $scope.gridOptions.data = [];


        };

        vm.ClassSelected = function (ID, Status) {
            if (Status === '') {
                vm.SectionID = null;
                vm.section = undefined;
                vm.sections = [];
                $scope.ReloadSec();
            }

            var params = {
                instituteId: $localStorage.userInfo[0].InstituteID,
                classId: vm.ClassID,
                DepartmentID: vm.DepartmentID === null || vm.DepartmentID === undefined ? 0 : vm.DepartmentID
            };

            commonService.getInstituteSection(params)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.IsRequiredSec = true;
                        vm.sections = data;
                        if (Status === 'Edit') {
                            vm.section = { selected: vm.sections.filter(function (ob, i) { return (ob.SectionID === vm.SectionID); })[0] };
                        }
                    }
                    else {
                        $scope.IsRequiredSec = false;
                    }

                });

        };

        $scope.hideList = function () {
            $scope.addPassMark = false;
            $scope.disButton = false;
            $scope.resultBtn = true;
            $scope.IsAdmitShow = false;
            $scope.printBtn = true;
            $scope.gridOptions.data = [];
            vm.registrationSetup = [];
        };
        function getAllShift(InstituteID) {
            var Params = {
                instituteId: InstituteID
            };
            return commonService.getInstituteShift(Params)
                .then(function (data) {
                    vm.shifts = data;

                    //if (status === 'Edit') {
                    //    vm.shift = {
                    //        selected: vm.shifts.filter(function (ob, i) {
                    //            return (ob.ShiftID === vm.ShiftID);
                    //        })[0]
                    //    };
                    //}
                });
        }

        vm.instituteID = $localStorage.userInfo[0].InstituteID;

        //function getInstitute(status) {
        //    if (status === '') {
        //        $scope.ReloadDll();


        //    }

        //    return classSettingsService.getInstitute()
        //        .then(function (data) {
        //            vm.institutes = data;

        //            vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };
        //            vm.getAllShift(vm.instituteID, status);
        //            vm.getmediumNameDdl(vm.instituteID, status);
        //            vm.showexams(vm.instituteID);


        //        });
        //}



        function getmediumNameDdl(InstituteID) {
            //if (status === '') {
            //    $scope.ReloadMedium(1);
            //    $scope.ReloadDll(InstituteID);


            //}

            var Params = {
                instituteId: InstituteID
            };
            return commonService.getInstituteMediumDdl(Params)
                .then(function (data) {
                    vm.mediums = data;

                    //if (status === 'Edit') {
                    //    vm.medium = {
                    //        selected: vm.mediums.filter(function (ob, i) {
                    //            return (ob.MediumID === vm.MediumID);
                    //        })[0]
                    //    };
                    //}
                });

        }




        vm.ClassWiseDepartmentDDL = function (ClassID, status) {
            if (status === '') {
                $scope.ReloadDept(1);
                $scope.ReloadClass(1);
            }

            var Params = {
                InstituteID: vm.instituteID,
                ClassID: ClassID,
                MediumID: vm.MediumID
            };
            return subjectSettingsSevice.getClassWiseDepartmentDDL(Params)
                .then(function (data) {
                    if (data.length > 0) {

                        vm.departments = data;
                        $scope.IsRequired = true;

                        if (status === 'Edit') {
                            vm.department = {
                                selected: vm.departments.filter(function (ob, i) {
                                    return (ob.DepartmentID === vm.DepartmentID);
                                })[0]
                            };
                        }
                    }
                    else {
                        $scope.IsRequired = false;
                        vm.showSubject(vm.instituteID, 0, vm.MediumID, vm.ClassID);
                        if (status === '') {
                            vm.DepartmentID = null;
                            vm.ClassSelected(0, '');
                        }
                        else if (status === 'Edit') {
                            vm.ClassSelected(vm.SectionID, status);
                        }
                    }
                });

        };


        vm.MediumWiseClassDDL = function (MediumID, status) {
            if (status === '') {
                $scope.ReloadClass(1);
                $scope.ReloadClassByMedium();
            }

            if (vm.MediumID !== null) {
                var Params = {
                    InstituteID: $localStorage.userInfo[0].InstituteID,
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



        function showexams(a) {
            $scope.ReloadDll(a);
            var Params = {
                insID: a
            };
            return insExameSetting.getAllExamesDDL(Params)

                .then(function (data) {
                    vm.exames = data;

                });
        }


        //vm.showSubject = function (a,b,c,d) {
        //    $scope.showItem = true;
        //    var subjectParams = {
        //        InstituteID: a,
        //        DepartmentID: b === undefined ? null : b,
        //        MediumID: c === undefined ? null : c,
        //        ClassID: d

        //    };
        //    return commonService.GetClassWiseSubject(subjectParams)
        //        .then(function (data) {
        //            vm.subjects = data;
        //            $scope.subjects = data;

        //            vm.values = [];
        //            if ($scope.subjects !== undefined) {
        //                for (var i = 0; i < $scope.subjects.length; i++) {

        //                    if ($scope.subjects[i].IsActive === 1) {
        //                        vm.values.push($scope.subjects[i]);

        //                    }

        //                }
        //            }
        //        });
        //};


    }
})();

