
(function () {
    'use strict';

    angular
        .module('app.netReceiveReport')
        .controller('netReceiveReportController', netReceiveReportController);


    netReceiveReportController.$inject = ['subjectSettingsSevice','paymentInfoSevice', 'classSettingsService', 'commonService', 'userService', 'instituteSettings', 'teacherAttendanceSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', 'pagerService', 'uploadService', '$window', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function netReceiveReportController(subjectSettingsSevice, paymentInfoSevice, classSettingsService, commonService, userService, instituteSettings, teacherAttendanceSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, pagerService, uploadService, $window, $localStorage, apiConfig) {


        //netReceiveReportController.$inject = ['filterurl','instituteSettings','branchSettingsSevice', 'subjectSettingsSevice', 'classSettingsService', 'teacherAttendanceSevice', 'commonService', 'trailBalanceReport', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
        ///* @ngInject */
        //function netReceiveReportController(filterurl, instituteSettings, branchSettingsSevice, subjectSettingsSevice, classSettingsService, teacherAttendanceSevice, commonService, trailBalanceReport, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {


        $scope.printBTn = false;
        $scope.pdfBTn = false;
        $scope.mainDIV = false;
        $scope.headerShow = false;
        $scope.lastDiv = false;



        //==============for report header information ===
        $scope.InsEmail = $localStorage.userInfo[0].InsEmail;
        $scope.InsAddress = $localStorage.userInfo[0].InsAddress;
        $scope.InsWeb = $localStorage.userInfo[0].InsWeb;
        $scope.InsPhoneNo = $localStorage.userInfo[0].InsPhoneNo;
        $scope.InstituteName = $localStorage.userInfo[0].InstituteName;

        // ============end report Heasder information===
        //Token Generate Decleration
        // vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        // vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        //vm.getMethod = 'GET';
        //vm.postMethod = 'POST';
        //vm.putMethod = 'PUT';
        //vm.deleteMethod = 'DELETE';
        //  vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration



        $scope.gridHide = function () {
            $scope.tblShow = false;
            $scope.mainDIV = false;
            $scope.headerShow = false;
            $scope.lastDiv = false;
            vm.balance = [];
        };





        // Create and Show list Container Hide or Show Logic
        $scope.createItem = true;

        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };


        $scope.AmountAss = 0;
        $scope.AmountLI = 0;
        $scope.AmountEx = 0;
        $scope.AmountIn = 0;










        activate();



        function activate() {
            var promises = [getCmnSessionDdl(), getAllBoard(), getAllStudent(), getAllGender(), getAllReligion(), getAllInstitute()];
            return $q.all(promises).then(function () {
            });
        }




        var vm = this;//jshint ignore : line
        vm.imgHost = apiConfig.imagehost;
        $scope.showItem = false;
        $scope.createItem = true;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        $scope.Form = true;


        var ClassID = 0, SectionID = 0, ShiftID = 0, DepartmentID = 0,
            SessionID = 0, BoardID = 0, BrunchID = 0, MediumID = 0;


        $scope.studentInfo = null; // store data 
        vm.studentData = null;
        var rowCount = null;
        $scope.EducationData = [];


        var InstituteName = null;
        var InstituteID = null;
        var Class = null;
        var Section = null;



        //**********************************************************Load Section************************************************************************************* */

        function getAllInstitute() {
            return instituteSettings.getAllInsInstitute()
                .then(function (data) {
                    vm.institutes = data;
                    vm.instituteID = vm.InstituteID;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.InstituteID); })[0] };
                    vm.instituteSelected(vm.InstituteID);

                });
        }
        $scope.change = function () {
            vm.med = null;
            vm.cls = null;
            vm.department = null;
            vm.sec = null;
            vm.brunch = null;
            vm.sft = null;
            vm.session = null;
            vm.board = null;
            vm.medium = [];
            vm.class = [];
            vm.section = [];
            vm.branches = [];
            vm.Shift = [];
            vm.sessions = [];
            vm.boards = [];
            vm.departments = [];
        };
        $scope.changeMed = function () {

            vm.cls = null;
            vm.department = null;
            vm.sec = null;
            vm.class = [];
            vm.departments = [];
            vm.section = [];

        };
        $scope.changeCls = function () {
            vm.department = null;
            vm.sec = null;
            vm.departments = [];
            vm.section = [];

        };
        $scope.changeDep = function () {
            vm.sec = null;
            vm.section = [];
        };
        vm.instituteSelected = function (InstituteID, InstituteName) {

            InstituteID = vm.institute.selected.InstituteID;
            vm.Shift = [];

            var params = {
                instituteId: InstituteID
            };
            var params1 = {
                InstituteID: InstituteID,
                MediumID: vm.MediumID
            };
            var params2 = {
                InstituteID: vm.instituteID,
                ClassID: vm.ClassID,
                MediumID: vm.MediumID
            };
            commonService.getInstituteShift(params)
                .then(function (data) {
                    vm.Shift = data;
                });
            subjectSettingsSevice.getMediumWiseClassDDL(params1)
                .then(function (data1) {
                    vm.class = data1;
                });
            //subjectSettingsSevice.getClassWiseDepartmentDDL(params2)
            //    .then(function (data2) {
            //        vm.departments = data2;
            //    });
            commonService.getInstituteMediumDdl(params)
                .then(function (data3) {
                    vm.medium = data3;
                });
            commonService.getInstituteBrunchDdl(params)
                .then(function (data4) {
                    vm.branches = data4;
                });

        };

        //***************************************
        function getAllStudent() {
            var params = {
                typeID: 3,
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return userService.getUserByTypeID(params)
                .then(function (data) {
                    vm.students = data;
                });
        }



        vm.ClassSelected = function (classId) {

            var params = {
                InstituteID: vm.institute.selected.InstituteID,
                ClassID: classId,//vm.cls.selected.ClassID,
                MediumID: vm.MediumID
            };
            subjectSettingsSevice.getClassWiseDepartmentDDL(params)
                .then(function (data2) {
                    vm.departments = data2;

                    if (data2.length === 0) {
                        var params5 = {
                            instituteId: vm.institute.selected.InstituteID,
                            classId: classId,
                            DepartmentID: vm.DepartmentID === null || vm.DepartmentID === undefined ? null : vm.DepartmentID
                        };

                        commonService.getInstituteSection(params5)
                            .then(function (data) {
                                vm.section = data;
                                //if (Status === 'Edit') {
                                //    vm.SectionID = ID;
                                //    vm.section = {
                                //        selected: vm.sections.filter(function (ob, i) {
                                //            return (ob.SectionID === ID);
                                //        })[0]
                                //    };
                                //}
                            });
                    }



                });

            //commonService.getInstituteSection(params)
            //    .then(function (data) {
            //        vm.section = data;
            //    });
        };
        vm.DepartmentSelected = function (depId) {

            if (depId !== undefined) {
                var params5 = {
                    instituteId: vm.instituteID,
                    classId: vm.ClassID,
                    DepartmentID: vm.DepartmentID === null || vm.DepartmentID === undefined ? 0 : vm.DepartmentID
                };

                commonService.getInstituteSection(params5)
                    .then(function (data) {                     
                        vm.section = data;
                        
                    });
            }

        };




        function getCmnSessionDdl() {
            return commonService.getSession()
                .then(function (data) {
                    vm.sessions = data;
                });
        }

        function getAllBoard() {
            return instituteSettings.getBoards()
                .then(function (data) {
                    vm.boards = data;
                });
        }



        function getAllGender() {
            return commonService.getGender()
                .then(function (data) {
                    vm.genders = data;
                });
        }

        function getAllReligion() {
            return commonService.getReligion()
                .then(function (data) {
                    vm.religions = data;
                });
        }










        //************************************************Start Grid******************************************************
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
                vm.getStudentDetailsInfo(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    vm.getStudentDetailsInfo(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    vm.getStudentDetailsInfo(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    vm.getStudentDetailsInfo(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    vm.getStudentDetailsInfo(1);
                }
            }
        };
        vm.getStudentDetailsInfo = function (isPaging) {
            $scope.gridOptions.enableFiltering = true;
            $scope.pagination.pageNumber = $scope.pagination.pageNumber === undefined ? 1 : $scope.pagination.pageNumber;
            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();            
            objcmnParam.pageNumber = ($scope.pagination.pageNumber - 1) * $scope.pagination.pageSize;
            objcmnParam.pageSize = $scope.pagination.pageSize;
            objcmnParam.IsPaging = isPaging;
            objcmnParam.InstituteID = /*(vm.institute.selected.InstituteID === undefined) ? 0 : vm.institute.selected.InstituteID;*/  $localStorage.userInfo[0].InstituteID;
            objcmnParam.LoggedUserID = $localStorage.userInfo[0].UserID;
            objcmnParam.UserID = 0;
            objcmnParam.ClassID = (vm.ClassID === undefined) ? 0 : vm.ClassID;
            objcmnParam.SectionID = (vm.SectionID === undefined) ? 0 : vm.SectionID;
            objcmnParam.DepartmentID = (vm.DepartmentID === undefined) ? 0 : vm.DepartmentID;
            objcmnParam.MediumID = vm.MediumID;
            objcmnParam.ShiftID = (vm.ShiftID === undefined) ? 0 : vm.ShiftID;
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
                rowTemplate: '<div ng-dblclick=grid.appScope.selectedEvent(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                columnDefs: [
                    { name: 'UserID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'UserName', displayName: 'Student', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'RFID', displayName: 'RFID', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'RollNo', displayName: 'RollNo', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Guardian', displayName: 'Guardian', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'GuardianPhone', displayName: 'Guardian Phone', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ShiftName', displayName: 'Shift', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'MameName', displayName: 'Medium', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'DepartmentName', displayName: 'Department', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ClassName', displayName: 'Class', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'SectionName', displayName: 'Section', headerCellClass: $scope.highlightFilteredHeader },
                    {
                        name: 'ImageUrl', displayName: 'Image', headerCellClass: $scope.highlightFilteredHeader,
                        cellTemplate: '<img ng-src="{{COL_FIELD}}" style="height:35px; width:35px" />'
                    },

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
                        '<a href="javascript:void(0);" data-toggle="modal" data-dismiss="modal"  style="background-color:#0aa699; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.selectedEvent(row.entity)">' +
                        '<i class="fa fa-edit" aria-hidden="true">&nbsp;Select</i></a></button>' +

                        '<span class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white; display:none; !important">' +
                        '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteModels(row.entity)">' +
                        '<i class="fa fa-trash" aria-hidden="true">&nbsp;Delete</i></a></span>'
                    }
                ],
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


            return commonService.getStudentBasicInfoList(objcmnParam)
                // .then(function (data) {
                //     $scope.pagination.totalItems = data[0].RecordTotal;
                //     $scope.gridOptions.data = data;
                //     $scope.loaderMore = false;
                // });

                .then(function (data) {
                    angular.forEach(data, function (d) {
                        d.ImageUrl = d.ImageUrl === null || d.ImageUrl === '' ? 'images/profiles/no-user-image.png' : vm.imgHost + d.ImageUrl;
                    });
                    $scope.studentInfo = data;
                    if (data.length === 0) {
                        $scope.gridOptions.data = [];
                        logger.error('No data found.............');


                    } else {
                        $scope.pagination.totalItems = data[0].RecordTotal;
                        $scope.gridOptions.data = data;
                        $scope.loaderMore = false;
                        //SectionSelect(data[0].ClassID, 0, ''); //jshint ignore : line
                    }


                });
        };

        $scope.RefreshList = function () {
            if (vm.institute === undefined || vm.MediumID === undefined) {
                logger.error('Please Select Medium');
                return;
            } else {

                $('#myModal').modal('show');//jshint ignore :line
                $scope.pagination.pageNumber = 1;
                vm.getStudentDetailsInfo(0);
            }
        };




        //debugger;
        $scope.selectedEvent = function (model) {

            vm.studentName = model.UserName;
            vm.UserID = model.UserID;


        };



        //************************************************End Grid******************************************************












        //**********************************************************HTML Show/Hide ************************************************************************************* */


        $scope.showListBtn = function () {
            $scope.showItem = true;
            $scope.createItem = true;
            $scope.educationInfoContainer = false;
            $scope.EducationData = [];
        };

        $scope.listEvent = function () {
            $state.go($state.current.name, {}, { reload: true });
            $scope.clearField();
            $scope.showItem = false;
            $scope.createItem = true;
            $scope.educationInfoContainer = true;
        };


        // $scope.gridOptions = {
        //     enableFiltering: true,
        //     flatEntityAccess: true,
        //     showGridFooter: true,
        //     fastWatch: true
        // };

        // $scope.gridOptions.columnDefs = [
        //     { name: 'id' },
        //     { name: 'name' },
        //     { name: 'gender' },
        //     { field: 'age' }
        // ];


        function checkingDropdown() {


            if (vm.SectionID === undefined) { SectionID = null; } else { SectionID = vm.sec.selected.SectionID; }
            if (vm.DepartmentID === undefined) { DepartmentID = null; } else { DepartmentID = vm.DepartmentID; }
            if (vm.SessionID === undefined) { SessionID = null; } else { SessionID = vm.session.selected.SessionID; }

            if (vm.BoardID === undefined) { BoardID = null; } else { BoardID = vm.board.selected.BoardID; }
            if (vm.BrunchID === undefined) { BrunchID = null; } else { BrunchID = vm.brunch.selected.BrunchID; }
            if (vm.ShiftID === undefined) { ShiftID = null; } else { ShiftID = vm.sft.selected.ShiftID; }
            if (vm.MediumID === undefined) { MediumID = null; } else { MediumID = vm.med.selected.MediumID; }
        }






        //**********************************************************Print/PDF/Excel************************************************************************************* */

        vm.NetReceiveData = function () {

            if (vm.MediumID === null || vm.MediumID === undefined) {
                logger.warning('Please Enter Medium !!');
                return;
            }


            $scope.mainDIV = true;
            $scope.headerShow = false;
            $scope.showItem = true;

            $scope.printBTn = false;
            $scope.pdfBTn = false;
            var params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                MediumID: (vm.MediumID === undefined || vm.MediumID === null) ? null : vm.MediumID,
                ClassID: (vm.ClassID === undefined || vm.ClassID === null) ? null : vm.ClassID,
                DepartmentID: (vm.DepartmentID === undefined || vm.DepartmentID === null) ? null : vm.DepartmentID,
                SectionID: (vm.SectionID === undefined || vm.SectionID === null) ? null : vm.SectionID,
                ShiftID: (vm.ShiftID === undefined || vm.ShiftID === null) ? null : vm.ShiftID,
                UserID: (vm.UserID === undefined || vm.UserID === null) ? null : vm.UserID
            };
            return paymentInfoSevice.getNetReceive(params)
                .then(function (data) {
                  
                    $scope.AmountAss = null;
                    $scope.AmountLI = null;
                    $scope.AmountEx = null;
                    $scope.AmountIn = null;


                    vm.netRec = data;
                    //if (vm.balance.length > 0 || vm.balance.length !== undefined || vm.balance.length !== null) {

                    //    for (var i = 0; i < vm.balance.length; i++) {

                    //    }
                    //}

                });
        };





        //**********************************************************Print/PDF/Excel************************************************************************************* */



        vm.printDiv = function printElem(print) {
            var content = document.getElementById(print).innerHTML;
            var mywindow = window.open('', 'Print', 'height=1000,width=2000');

            mywindow.document.write('<html><head><title></title>');
            mywindow.document.write('</head><body >');
            mywindow.document.write(content);
            mywindow.document.write('</body> <br/><br/>');
            mywindow.document.write('<footer> <font color="green">Powered By:</font><font color="blue"> onAir International Ltd. </font></footer>');
            mywindow.document.write('<footer> <font color="green">Web URL:</font><font color="blue">   www.onems.live </font></footer>');
            mywindow.document.write('</html>');


            mywindow.document.close();
            mywindow.focus();
            mywindow.print();
            mywindow.close();
            return true;
        };





        $scope.exportToPDF = function (print) {
            $scope.printthis = true;
            $scope.tblShow = true;
            $scope.headerShow = true;
            $scope.lastDiv = true;
            kendo.drawing.drawDOM($('#print'), { //jshint ignore : line
                allPages: true,
                avoidLinks: true,
                paperSize: 'letter',
                margin: { top: '0.5cm', left: '0.1cm', right: '0.0cm', bottom: '0.5cm' },
                portrait: true,
                repeatHeaders: true,
                multiPage: true,
                scale: 0.5
            }).then(function (group) {
                kendo.drawing.pdf.saveAs(group, 'Net Receivable' + '.pdf'); //jshint ignore : line
                $timeout(function () {
                    $scope.printthis = false;

                    $scope.tblShow = false;
                    $scope.headerShow = false;
                    $scope.lastDiv = false;
                }, 3);

            });
        };





        vm.exportToExcel = function () {
            var blob = new Blob([document.getElementById('ExcelGenerate').innerHTML], {
                type: 'application/vnd.ms-excel;charset=charset=utf-8'
            });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.download = 'Net Receivable.xls';
            a.href = url;
            a.textContent = 'Net Receivable.xls';
            a.click();

        };





    }
})();
