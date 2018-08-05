
(function () {
    'use strict';

    angular
        .module('app.shiftSettings')
        .controller('UserRegistrationController', UserRegistrationController);

    UserRegistrationController.$inject = ['branchSettingsSevice', 'commonService', 'subjectSettingsSevice', 'userRegistrationService', 'classSettingsService', 'shiftSettings', 'classSettings', 'teacherAttendanceSevice', 'mediumsetting', 'branchSettings', 'sectionSettingsSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function UserRegistrationController(branchSettingsSevice, commonService, subjectSettingsSevice, userRegistrationService, classSettingsService, shiftSettings, classSettings, teacherAttendanceSevice, mediumsetting, branchSettings, sectionSettingsSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, apiConfig) {

        var vm = this;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.instituteID = $localStorage.userInfo[0].InstituteID;
        // Create and Show list Container Hide or Show Logic
        vm.UserClassID = 0;
        $scope.showItem = true;
        $scope.createItem = true;
        vm.imgHost = apiConfig.imagehost;
        vm.CompulsorySubjectID = null;
        vm.OptionalSubjectID = null;
        $scope.itemEvent = function () {
            //$scope.IsVisible = $scope.IsVisible ? false : true;
            $scope.showItem = true;
            $scope.createItem = false;

        };

        $scope.listEvent = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.showItem = false;
            $scope.createItem = true;
        };

        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        function check(a) {
            if (a === null || a === undefined) {
                vm.b = '';
            }
            else {
                vm.b = a;
            }
        }
        vm.regedusersShow = '';
        $scope.editModels = function (model) {

            $scope.UserID = model.UserID;
            // $scope.UserFullName = FullName

            return userRegistrationService.getCmnUserResistrationByUserID($scope.UserID)
                .then(function (data) {
                    vm.regedusersShow = '';
                    if (data.length > 0) {
                        vm.regedusers = data;
                        vm.regedusersShow = vm.regedusers.filter(function (ob, i) { return (ob.IsActive === true); })[0];
                        vm.indexLenth = data.length;
                        vm.UserClassID = data[0].UserClassID;
                        vm.StudentName = model.UserFullName;
                        vm.instituteID = data[0].InstituteID;
                        vm.BrunchID = data[0].BrunchID;
                        vm.MediumID = data[0].MediumID;
                        vm.ShiftID = data[0].ShiftID;
                        vm.ClassID = data[0].ClassID;
                        vm.SectionID = data[0].SectionID;
                        vm.DepartmentID = data[0].DepartmentID;
                        getInstitute('Edit');
                        vm.MediumWiseClassDDL(vm.MediumID, 'Edit');
                        vm.ClassWiseDepartmentDDL(vm.ClassID, 'Edit');
                        vm.ClassSelected(vm.SectionID, 'Edit');

                        vm.Remarks = data[0].Remarks;

                        check(data[0].RFID);
                        vm.RFID = vm.b;
                        check(data[0].RollNo);
                        vm.RollNo = vm.b;
                        check(data[0].BoardID);
                        vm.ImageUrl = data[0].ImageUrl === 'undefined' || data[0].ImageUrl === undefined || data[0].ImageUrl === null || data[0].ImageUrl === 'null' ? null : data[0].ImageUrl;

                        vm.board = {
                            selected: vm.boards.filter(function (ob, i) {
                                return (ob.BoardID === vm.b);
                            })[0]
                        };

                        check(data[0].SessionID);
                        vm.session = {
                            selected: vm.sessions.filter(function (ob, i) {
                                return (ob.SessionID === vm.b);
                            })[0]
                        };

                        vm.CompulsorySubjectID = data[0].CompulsorySubjectID;
                        if (vm.CompulsorySubjectID !== null) {
                            vm.comp = { selected: vm.OpCompulsoryList.filter(function (ob, i) { return (ob.SubjectID === vm.CompulsorySubjectID); })[0] };
                        }

                        vm.OptionalSubjectID = data[0].OptionalSubjectID;
                        if (vm.OptionalSubjectID !== null) {
                            vm.opt = { selected: vm.OpCompulsoryList.filter(function (ob, i) { return (ob.SubjectID === vm.OptionalSubjectID); })[0] };
                        }

                        vm.StudentNo = data[0].StudentNo;

                        $scope.showItem = true;
                    }
                    else {
                        logger.error('No data found');
                        vm.ImageUrl = null;
                        vm.regedusers = [];
                        vm.RFID = vm.RFID === undefined ? '' : '';
                        //vm.StudentName=vm.StudentName===undefined? '' :'';
                        vm.RollNo = vm.RollNo === undefined ? '' : '';
                        vm.Remarks = vm.Remarks === undefined ? '' : '';
                        vm.board = undefined;
                        vm.session = undefined;
                        vm.branch = undefined;
                        vm.medium = undefined;
                        vm.department = undefined;
                        vm.shift = undefined;
                        vm.class = undefined;
                        vm.section = undefined;
                        vm.CompulsorySubjectID = null;
                        vm.OptionalSubjectID = null;
                        vm.StudentNo = '';
                        vm.comp = undefined;
                        vm.opt = undefined;
                        $scope.showItem = false;
                        vm.StudentName = model.UserFullName;
                        vm.Remarks = '';
                    }
                });

        };

        vm.AddStudent = function () {
            // if($scope.UserID===undefined || vm.RFID===undefined || vm.RollNo===undefined || vm.board===undefined || vm.session===undefined || vm.branch===undefined || vm.medium===undefined || vm.department===undefined || vm.shift===undefined || vm.class===undefined || vm.section===undefined || vm.remarkSetup===undefined){
            //     logger.error('Please fill All Fields');
            // }
            // else{
            userRegistrationService.postCmnUserResistration({
                UserClassID: vm.UserClassID,
                UserID: $scope.UserID === undefined ? logger.error('Select Student first') : $scope.UserID,
                RFID: vm.RFID === undefined ? null : vm.RFID,
                RollNo: vm.RollNo === undefined ? null : vm.RollNo,
                BoardID: vm.board === undefined || vm.board.selected === undefined ? null : vm.board.selected.BoardID,
                SessionID: vm.session === undefined || vm.session.selected === undefined ? null : vm.session.selected.SessionID,
                BrunchID: vm.branch === undefined || vm.branch.selected === undefined ? null : vm.branch.selected.BrunchID,
                MediumID: vm.medium === undefined || vm.medium.selected === undefined ? null : vm.medium.selected.MediumID,
                DepartmentID: vm.department === undefined || vm.department.selected === undefined ? null : vm.department.selected.DepartmentID,
                ShiftID: vm.shift === undefined || vm.shift.selected === undefined ? null : vm.shift.selected.ShiftID,
                ClassID: vm.class === undefined || vm.class.selected === undefined ? null : vm.class.selected.ClassID,
                SectionID: vm.section === undefined || vm.section.selected === undefined ? null : vm.section.selected.SectionID,
                Remarks: vm.Remarks === undefined || vm.Remarks === '' ? '' : vm.Remarks,
                CompulsorySubjectID: vm.CompulsorySubjectID === undefined ? null : vm.CompulsorySubjectID,
                OptionalSubjectID: vm.OptionalSubjectID === undefined ? null: vm.OptionalSubjectID,
                InstituteID: vm.instituteID,
                StudentNo: vm.StudentNo === undefined ? '' : vm.StudentNo,
                LoggedUserID: vm.LoggedUserID
            })
                .then(function (data) {

                    if (data[0].ReturnValue === 'Duplicate') {
                        logger.error('StudentID Already exists....');
                    }
                    else {
                        vm.regedusers = data;
                        vm.indexLenth = data.length;
                        $scope.showItem = true;
                        logger.info('Saved Successfully');
                        //window.onload = setTimeout('location.reload(true);', 1500);
                    }

                })
                .catch(function (error) { });

        };

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
            if (vm.instituteID === undefined || vm.instituteID === null) {
                logger.error('Please Select Institute First !!!');
                $scope.gridOptions.data = [];
            } else {
                $scope.gridOptions.enableFiltering = true;

                $scope.loaderMore = true;
                $scope.lblMessage = 'loading please wait....!';
                $scope.result = 'color-red';
                //$scope.cmnParam();            
                objcmnParam.pageNumber = ($scope.pagination.pageNumber - 1) * $scope.pagination.pageSize;
                objcmnParam.pageSize = $scope.pagination.pageSize;
                objcmnParam.IsPaging = isPaging;
                objcmnParam.InstituteID = vm.institute.selected.InstituteID;
                objcmnParam.LoggedUserID = $localStorage.userInfo[0].UserID;
                objcmnParam.typeID = 4;
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
                        { name: 'UserFullName', displayName: 'User', headerCellClass: $scope.highlightFilteredHeader },
                        { name: 'Gender', displayName: 'Gender', headerCellClass: $scope.highlightFilteredHeader },
                        { name: 'DOB', displayName: 'Date of Birth', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                        { name: 'BirthCertificate', displayName: 'Birth Certificate', headerCellClass: $scope.highlightFilteredHeader },
                        { name: 'Guardian', displayName: 'Guardian', headerCellClass: $scope.highlightFilteredHeader },
                        { name: 'PhoneNo', displayName: 'Phone No', headerCellClass: $scope.highlightFilteredHeader },
                        {
                            name: 'Option',
                            displayName: 'Option',
                            width: '13%',
                            pinnedRight: true,
                            enableColumnResizing: false,
                            enableFiltering: false,
                            enableSorting: false,
                            headerCellClass: $scope.highlightFilteredHeader,
                            visible: true,
                            cellTemplate: '<button class="label label-success label-mini" style="background-color:#0aa699">' +
                            '<a href="javascript:void(0);" data-toggle="modal" data-dismiss="modal" style="background-color:#0aa699;color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editModels(row.entity)">' +
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

                var funcName = '/getAllStudent';
                var data = [];
                return userRegistrationService.getAllStudent(objcmnParam)
                    .then(function (data) {
                        if (data.length > 0) {
                            $scope.pagination.totalItems = data[0].RecordTotal;
                            $scope.gridOptions.data = data;
                        }
                        else {
                            logger.error('Your desired data not found');
                        }
                        $scope.loaderMore = false;
                    });
            }
        };
        $scope.RefreshList = function () {
            $scope.pagination.pageNumber = 1;
            $scope.getAllStudent(0);
        };
        //************************************************End Grid******************************************************

        $scope.ReloadDll = function () {
            //vm.instituteID = null;
            //vm.institute = undefined;
            //vm.institutes = [];
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
            vm.BrunchID = null;
            vm.branch = undefined;
            vm.branchDdls = [];

            $scope.showItem = false;
        };

        $scope.ReloadMedium = function (status) {
            if (status === 0) {
                vm.MediumID = null;
                //vm.medium = [];
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
        };

        $scope.ReloadClass = function (status) {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            if (status === 0) {
                vm.ClassID = null;
            }
            vm.class = undefined;
        };

        $scope.ReloadDept = function (status) {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            if (status === 0) {
                vm.DepartmentID = null;
            }
            vm.department = undefined;
            //vm.departments = [];
        };


        activate();

        function activate() {
            var promises = [getInstitute(''), getCmnBoardDdl(), getCmnSessionDdl(), loadAllOptionalAndCompulsory()];
            return $q.all(promises).then(function () {
            });
        }



        vm.ClassSelected = function (ID, status) {
            if (status === '') {
                vm.SectionID = null;
                vm.section = undefined;
                vm.sections = [];
            }

            var params = {
                instituteId: vm.instituteID,
                classId: vm.ClassID,
                DepartmentID: vm.DepartmentID === null || vm.DepartmentID === undefined ? 0 : vm.DepartmentID
            };

            commonService.getInstituteSection(params)
                .then(function (data) {
                    vm.sections = data;
                    if (status === 'Edit') {
                        vm.SectionID = ID;
                        vm.section = {
                            selected: vm.sections.filter(function (ob, i) {
                                return (ob.SectionID === ID);
                            })[0]
                        };
                    }
                });

        };

        vm.instituteID = $localStorage.userInfo[0].InstituteID;

        function getInstitute(status) {
            if (status === '') {
                $scope.ReloadDll();
            }

            return classSettingsService.getInstitute()
                .then(function (data) {
                    vm.institutes = data;

                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };
                    vm.getAllShift(vm.instituteID, status);
                    vm.getmediumNameDdl(vm.instituteID, status);
                    vm.getCmnBranchDdl(vm.instituteID, status);
                });
        }


        vm.getAllShift = function (InstituteID, status) {
            var Params = {
                instituteId: InstituteID
            };
            return commonService.getInstituteShift(Params)
                .then(function (data) {
                    vm.shifts = data;

                    if (status === 'Edit') {
                        vm.shift = {
                            selected: vm.shifts.filter(function (ob, i) {
                                return (ob.ShiftID === vm.ShiftID);
                            })[0]
                        };
                    }
                });
        };

        vm.getmediumNameDdl = function (InstituteID, status) {
            if (status === '') {
                $scope.ReloadMedium(1);
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

        vm.ClassWiseDepartmentDDL = function (ClassID, status) {
            if (status === '') {
                $scope.ReloadDept(1);
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

        vm.getCmnBranchDdl = function (InstituteID, status) {
            var Params = {
                instituteId: InstituteID
            };
            return branchSettingsSevice.getBranchByInstituteId(Params)
                .then(function (data) {
                    vm.branchDdls = data;

                    if (status === 'Edit') {
                        vm.branch = {
                            selected: vm.branchDdls.filter(function (ob, i) {
                                return (ob.BrunchID === vm.BrunchID);
                            })[0]
                        };
                    }
                });
        };

        function loadAllOptionalAndCompulsory() {
            //debugger;
            var Params = {
                InstituteID: vm.instituteID
            };
            return commonService.GetOptionalAndCompulsorySubject(Params)
                .then(function (data) {
                    vm.OpCompulsoryList = data;
                });
        }

        function getCmnBoardDdl() {
            return commonService.getBoard()
                .then(function (data) {
                    vm.boards = data;
                });
        }

        function getCmnSessionDdl() {
            return commonService.getSession()
                .then(function (data) {
                    vm.sessions = data;
                });
        }

    }
})();

