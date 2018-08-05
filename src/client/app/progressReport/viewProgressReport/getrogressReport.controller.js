
(function () {
    'use strict';

    angular
        .module('app.progressReport')
        .controller('progressReportEntryControllerForReport', progressReportEntryControllerForReport);

    progressReportEntryControllerForReport.$inject = ['progressReportForGrads', 'StudentWiseMarksEntry', 'insExameSetting', 'periodSetup', 'classSettingsService', 'subjectSettingsSevice', 'commonService', 'conversion', 'teacherAttendanceSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function progressReportEntryControllerForReport(progressReportForGrads, StudentWiseMarksEntry, insExameSetting, periodSetup, classSettingsService, subjectSettingsSevice, commonService, conversion, teacherAttendanceSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, apiConfig) {

        var vm = this;
        $scope.disButton = true;
        $scope.printthis = false;
        $scope.addPassMark = false;
        $scope.resultBtn = true;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        $scope.ResultGrid = false;
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.CurrentYear = new Date().getFullYear();
        $scope.listEvent = function () {

            $scope.showItem = false;
            $scope.createItem = true;
        };

        $scope.changeGrid = function () {

            $scope.clsPeriod = [];
            $scope.showItem = false;
        };
        // Reset Button Logic
        $scope.clearField = function () {

            $state.go($state.current.name, {}, { reload: true });

        };


        //==============for report header information ===
        vm.imgHost = apiConfig.imagehost;
        $scope.InstituteLogo = $localStorage.userInfo[0].InstituteLogo;
        $scope.InsEmail = $localStorage.userInfo[0].InsEmail;
        $scope.InsAddress = $localStorage.userInfo[0].InsAddress;
        $scope.InsWeb = $localStorage.userInfo[0].InsWeb;
        $scope.InsPhoneNo = $localStorage.userInfo[0].InsPhoneNo;
        $scope.InstituteName = $localStorage.userInfo[0].InstituteName;

        // ============end report Heasder information===


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
            $scope.gridOptions.enableFiltering = true;

            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();  

            objcmnParam.pageNumber = ($scope.pagination.pageNumber - 1) * $scope.pagination.pageSize;
            objcmnParam.pageSize = $scope.pagination.pageSize;
            objcmnParam.IsPaging = isPaging;
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID; //$localStorage.userInfo[0].InstituteID;
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
                    { name: 'RollNo', displayName: 'RollNo', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ClassName', displayName: 'Class', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'DepartmentName', displayName: 'Department', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'SectionName', displayName: 'Section', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'UserID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
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
                        '<a href="javascript:void(0);" data-toggle="modal" data-dismiss="modal" style="background-color:#0aa699; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editModels(row.entity)">' +
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
            return commonService.getStudentBasicInfoList(objcmnParam)
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
            $scope.getAllStudent(0);
        };
        //************************************************End Grid******************************************************

        $scope.editModels = function (model) {
            objcmnParam.pageNumber = 0;
            objcmnParam.pageSize = 0;
            objcmnParam.IsPaging = 0;
            objcmnParam.InstituteID = (vm.institute === undefined) ? 0 : vm.institute.selected.InstituteID;  //$localStorage.userInfo[0].InstituteID;
            objcmnParam.LoggedUserID = $localStorage.userInfo[0].UserID;
            objcmnParam.UserID = model.UserID;
            objcmnParam.ClassID = (vm.ClassID === undefined || vm.ClassID === null) ? 0 : vm.ClassID;
            objcmnParam.SectionID = (vm.SectionID === undefined || vm.SectionID === null) ? 0 : vm.SectionID;
            objcmnParam.DepartmentID = (vm.DepartmentID === undefined || vm.DepartmentID === null) ? 0 : vm.DepartmentID;
            objcmnParam.MediumID = (vm.MediumID === undefined || vm.MediumID === null) ? 0 : vm.MediumID;
            objcmnParam.ShiftID = (vm.ShiftID === undefined || vm.ShiftID === null) ? 0 : vm.ShiftID;

            return commonService.getStudentBasicInfoList(objcmnParam)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.pagination.totalItems = data[0].RecordTotal;
                        $scope.gridOptions.data = data;

                        //scope.StuDetails = data;
                        vm.registrationSetup = data[0].UserName;
                        $scope.FatherName = data[0].Guardian;
                        $scope.RollNo = data[0].RollNo;
                        $scope.Medium = data[0].MameName;
                        $scope.Department = data[0].DepartmentName;
                        $scope.Class = data[0].ClassName;
                        $scope.Section = data[0].SectionName;
                        $scope.DOB = data[0].DOB;
                        vm.UserID = data[0].UserID;
                        $scope.resultBtn = false;
                        //if (vm.UserID !== null || vm.UserID !== undefined))
                    }
                    else {
                        logger.error('Your desired data not found');
                    }
                    $scope.loaderMore = false;
                });
        };




        $scope.openShiftIndex = function (index) {
            $scope.shiftindex = index;
            $scope.marks[$scope.shiftindex].id = $scope.shiftindex;
        };

        $scope.switch = function (e) {
            if (e === 1) {
                $scope.marks[$scope.shiftindex].IsAbsent = 0;
            } else {
                $scope.marks[$scope.shiftindex].IsAbsent = 1;
            }


        };


        $scope.ttlGradePoint = 0; $scope.FinalGPA = 0; $scope.ttlGradePointWithoutOptional = 0; $scope.IsOptionalCheck = false;
        $scope.IsClassTestCalculate = false; //$scope.IsFinal = false; $scope.FinalProcessingTypeID = 0;
        $scope.getAllResultsByStudent = function () {
            //debugger
            var params = {
                UserID: vm.UserID,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                ClassID: vm.ClassID === undefined ? 0 : vm.ClassID,
                SectionID: vm.SectionID === undefined ? 0 : vm.SectionID,
                DepartmentID: vm.DepartmentID === undefined ? 0 : vm.DepartmentID,
                MediumID: vm.MediumID === undefined ? 0 : vm.MediumID,
                ShiftID: vm.ShiftID === undefined ? 0 : vm.ShiftID,
                //SubjectID: vm.SubjectID === undefined ? 0 : vm.SubjectID,
                YearID: vm.SessionID === undefined ? 0 : vm.SessionID,
                ExamID: vm.ExamID === undefined ? 0 : vm.ExamID
            };
            return progressReportForGrads.getSubjectWiseMarksByStudent(params)
                .then(function (data) {
                    vm.marks = data;
                    $scope.marks = data;
                    $scope.IsClassTestCalculate = data[0].IsClassTestCalculate;
                    //$scope.IsFinal = data[0].IsFinal;
                    //$scope.FinalProcessingTypeID = data[0].FinalProcessingTypeID;
                    $scope.GPAWithoutOptional = data[0].GPAWithoutOptional;
                    $scope.GradePoint = data[0].Grade;
                    $scope.InstituteName = data[0].InstituteName;
                    $scope.CGPA = data[0].CGPA;
                    $scope.addPassMark = true;
                    $scope.disButton = false;
                    $scope.ResultGrid = true;
                    //Working
                    var TTLGP = 0;
                    var TTLGPW = 0;
                    angular.forEach(vm.marks, function (gp) {
                        if (gp.IsOptional === false) {
                            TTLGP += gp.GradePoint;
                            TTLGPW += gp.GradePoint;
                        }
                        else if (gp.IsOptional === true && gp.GradePoint > 2) {
                            TTLGP += (gp.GradePoint - 2);
                        }
                    });

                    var optionalmodel = vm.marks.filter(function (ob, i) { return (ob.IsOptional === true); })[0];

                    if (optionalmodel !== undefined) {
                        $scope.IsOptionalCheck = true;
                        $scope.ttlGradePointWithoutOptional = TTLGPW / (vm.marks.length - 1);
                        $scope.ttlGradePoint = TTLGP / (vm.marks.length - 1);
                    }
                    else {
                        $scope.IsOptionalCheck = false;
                        $scope.ttlGradePointWithoutOptional = 0;
                        $scope.ttlGradePoint = TTLGP / vm.marks.length;
                    }

                    $scope.ttlGradePointWithoutOptional = conversion.roundNumber($scope.ttlGradePointWithoutOptional, 2);
                    $scope.ttlGradePoint = conversion.roundNumber($scope.ttlGradePoint, 2);

                    $scope.FinalGPA = $scope.grades.filter(function (ob, i) { return (ob.GPA <= $scope.ttlGradePoint); })[0].GradeName;

                    if (data[0].IsFinal === true && data[0].FinalProcessingTypeID > 0 && data[0].FinalProcessingTypeID !== 3) {
                        $scope.loadFinalExam(data[0]);
                    }

                });
        };

        $scope.ExamHeader = []; $scope.SubjectHeader = [];
        $scope.loadFinalExam = function (model) {
            var params = {
                UserID: vm.UserID,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                ClassID: vm.ClassID === undefined ? 0 : vm.ClassID,
                SectionID: vm.SectionID === undefined ? 0 : vm.SectionID,
                DepartmentID: vm.DepartmentID === undefined ? 0 : vm.DepartmentID,
                MediumID: vm.MediumID === undefined ? 0 : vm.MediumID,
                ShiftID: vm.ShiftID === undefined ? 0 : vm.ShiftID,
                SessionID: vm.SessionID === undefined ? 0 : vm.SessionID,
                //ExamID: vm.ExamID === undefined ? 0 : vm.ExamID,
                FinalProcessingTypeID: model.FinalProcessingTypeID,
                ExeSequence: model.Sequence,
                IsClassTestCalculate: model.IsClassTestCalculate,
                ClassTestProcessingTypeID: model.ClassTestProcessingTypeID
            };
            return progressReportForGrads.getAllExamProgressReport(params)
                .then(function (data) {
                    if (data.length > 0) {
                        //debugger;
                        var FullFinalProgress = data;
                        $scope.ExamHeader = [];
                        $scope.SubjectHeader = [];
                        angular.forEach(FullFinalProgress, function (row) {
                            if ($scope.ExamHeader.length > 0) {
                                var exmModel = $scope.ExamHeader.filter(function (js, j) { return (js.ExamID === row.ExamID); })[0];
                                if (exmModel === undefined) {
                                    $scope.ExamHeader.push({ ExamID: row.ExamID, ExamName: row.ExamName });
                                }
                            }
                            else {
                                $scope.ExamHeader.push({ ExamID: row.ExamID, ExamName: row.ExamName });
                            }

                            if ($scope.SubjectHeader.length > 0) {
                                var subModel = $scope.SubjectHeader.filter(function (js, j) { return (js.SubjectID === row.SubjectID); })[0];
                                if (subModel === undefined) {
                                    $scope.SubjectHeader.push({ SubjectID: row.SubjectID, SubjectName: row.SubjectName, Total: 0, GradePoint: 0, Grade: 'F', DetailArray: [] });
                                }
                            }
                            else {
                                $scope.SubjectHeader.push({ SubjectID: row.SubjectID, SubjectName: row.SubjectName, Total: 0, GradePoint: 0, Grade: 'F', DetailArray: [] });
                            }
                        });

                        angular.forEach($scope.SubjectHeader, function (row) {
                            angular.forEach(FullFinalProgress, function (frow) {
                                if (row.SubjectID === frow.SubjectID) {
                                    row.DetailArray.push({
                                        ExamID: frow.ExamID,
                                        ExamName: frow.ExamName,
                                        ExamTotal: frow.Total,
                                        GradePoint: frow.GradePoint,
                                        Grade: frow.Grade,
                                        GrandTotal: 0
                                    });
                                }
                            });
                        });

                        $scope.SubjectHeader.sort(function (a, b) {
                            return a.SubjectID - b.SubjectID;
                        });
                    }
                });
        };

        vm.CalculateColumns = function (model) {
            var MCQ = model.MCQ === null || model.MCQ === undefined ? 0 : model.MCQ;
            var Written = model.Written === null || model.Written === undefined ? 0 : model.Written;
            var Practicle = model.Precticle === null || model.Precticle === undefined ? 0 : model.Precticle;
            var Attendance = model.Attendance === null || model.Attendance === undefined ? 0 : model.Attendance;
            //model.Total = MCQ + Written + Practicle + Attendance;
            var total = MCQ + Written + Practicle + Attendance;
            if (total > 100) {
                logger.info('Total Marks cannot be more than 100');
                $scope.disButton = true;
            }
            else {
                model.Total = total;
                $scope.disButton = false;
            }
        };





        vm.ExamMarkID = 0;


        vm.postExameExampassMark = function () {

            var examMarks = [].concat.apply([], $scope.marks);

            insExameSetting.postExamMarks({

                ExamMarkID: examMarks[0].ExamMarkID === null ? 0 : examMarks[0].ExamMarkID,
                ExamID: vm.ExamID,
                SectionID: vm.SectionID,
                ShiftID: vm.ShiftID,
                UserID: examMarks[0].UserID,
                DepartmentID: vm.DepartmentID,
                MeduimID: vm.MediumID,
                ClassID: vm.ClassID,
                SubjectID: vm.SubjectID,
                MCQ: examMarks[0].MCQ,
                Written: examMarks[0].Written,
                Precticle: examMarks[0].Precticle,
                Attendance: examMarks[0].Attendance,
                Total: examMarks[0].Total,
                InstituteID: vm.institute.selected.InstituteID,
                IsAbsent: examMarks[0].IsAbsent,
                LoggedUserID: $localStorage.userInfo[0].UserID,
                IsDeleted: 0,

                examMarks: examMarks

            })
                .then(function (data) {
                    logger.info('Saved!');
                    $state.go($state.current.name, {}, { reload: true });
                })
                .catch(function (error) { });
        };







        //-------------- Load Option --------------------//

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
            vm.subject = undefined;
            vm.values = [];
            vm.ExamID = null;
            vm.exam = undefined;
            vm.exames = [];
            vm.registrationSetup = null;
            vm.registrationSetup = [];
            $scope.gridOptions.data = [];
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
            $scope.gridOptions.data = [];
        };




        $scope.ReloadClass = function (status) {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            $scope.gridOptions.data = [];
            //if (status === 0) {
            //    vm.ClassID = null;
            //}
            //vm.class = undefined;
        };

        //$scope.examDdl = function () {

        //};


        $scope.ReloadDept = function (status) {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            if (status === 0) {
                vm.DepartmentID = null;
            }
            vm.department = undefined;
            $scope.gridOptions.data = [];
            //vm.departments = [];
        };

        activate();

        function activate() {
            var promises = [getInstitute(''), getAllSession()];


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
            if (status === '') {
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
            vm.showSubject(vm.instituteID, params.DepartmentID, vm.MediumID, vm.ClassID);
            commonService.getInstituteSection(params)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.IsRequiredSec = true;
                        vm.sections = data;
                    }
                    else {
                        $scope.IsRequiredSec = false;
                    }
                });

        };

        $scope.hideList = function () {
            $scope.addPassMark = false;
            $scope.disButton = true;
            $scope.ResultGrid = false;
            $scope.gridOptions.data = [];
            vm.registrationSetup = [];
            $scope.resultBtn = true;
        };

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
                    vm.showexams(vm.instituteID);


                });
        }



        vm.getmediumNameDdl = function (InstituteID, status) {
            if (status === '') {
                $scope.ReloadMedium(1);
                $scope.ReloadDll(InstituteID);
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

                    //debugger;
                    getAllGreadsForReport();
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



        vm.showexams = function (a) {
            $scope.ReloadDll(a);
            var Params = {
                insID: a
            };


            return insExameSetting.getAllExames(Params)

                .then(function (data) {
                    vm.exames = data;

                });

        };
        vm.showSubject = function (a, b, c, d) {




            $scope.showItem = true;
            var subjectParams = {
                InstituteID: a,
                DepartmentID: b === undefined ? null : b,
                MediumID: c === undefined ? null : c,
                ClassID: d

            };
            return subjectSettingsSevice.getSubjectByParms(subjectParams)
                .then(function (data) {
                    vm.subjects = data;
                    $scope.subjects = data;

                    vm.values = [];
                    if ($scope.subjects !== undefined) {
                        for (var i = 0; i < $scope.subjects.length; i++) {

                            if ($scope.subjects[i].IsActive === 1) {
                                vm.values.push($scope.subjects[i]);

                            }

                        }
                    }
                });
        };


        //function getAllGreadsForReport() {
        //    var params = {
        //        InstituteID = $localStorage.userInfo[0].InstituteID
        //    };

        //   return StudentWiseMarksEntry.getAllGradesForReport(params)
        //        .then(function (data) {
        //            $scope.grades = data;
        //        })
        //};
        //var Ins = 

        function getAllGreadsForReport() {
            //debugger;
            var params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                MediumID: vm.MediumID,
                ClassID: vm.ClassID
            };


            return StudentWiseMarksEntry.getAllGradesForReport(params)
                .then(function (data) {
                    $scope.grades = data;
                });
        }

        function getAllSession() {


            return commonService.getSession()
                .then(function (data) {
                    //debugger;
                    $scope.sessions = data;
                    vm.session = { selected: $scope.sessions.filter(function (js, j) { return (parseInt(js.SessionName) === $scope.CurrentYear); })[0] };
                    vm.SessionID = vm.session.selected.SessionID;
                });
        }



        //========================


        $scope.generatePDF = function printElem(print) {
            var content = document.getElementById(print).innerHTML;
            var mywindow = window.open('', 'Print', 'height=1000,width=2000');
            var is_chrome = Boolean(mywindow.chrome);
            mywindow.document.write('<html><head><title></title>');
            mywindow.document.write('</head><body >');
            mywindow.document.write(content);
            mywindow.document.write('</body> <br/><br/>');
            mywindow.document.write('<footer style="position: fixed;bottom: 15px;"> <font color="green">Powered By:</font><font color="blue"> onAir International Ltd. </font></footer>');
            mywindow.document.write('<footer style="position: fixed;bottom: 0;"> <font color="green">Web URL:</font><font color="blue">   www.onems.live </font></footer>');
            //mywindow.document.write('<footer> <font color="green">www.onEMS.Live</font></footer>');
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
        };



        // $scope.generatePDF = function (print) {
        //     $scope.printthis=true;
        //     kendo.drawing.drawDOM($('#print'), {
        //         allPages: true,
        //         avoidLinks: true,
        //         paperSize: 'letter',
        //         margin: { top: '0.5cm', left: '0.1cm', right: '0.0cm', bottom: '0.5cm' },
        //         portrait: true,
        //         repeatHeaders: true,
        //         multiPage: true,
        //         scale: 0.5
        //     }).then(function (group) {
        //         kendo.drawing.pdf.saveAs(group, 'DailyFeesCollection' + '.pdf');
        //         $timeout(function () {
        //             $scope.printthis = false;
        //         }, 100);

        //     });

        // };






        //  $scope.generatePDF = function(){
        //     html2canvas(document.getElementById('print'), {
        //         onrendered: function (canvas) {
        //             var data = canvas.toDataURL();
        //             var docDefinition = {
        //                 content: [{
        //                     image: data,
        //                     width: 500,
        //                 }]
        //             };
        //             pdfMake.createPdf(docDefinition).download("test.pdf");
        //         }
        //     });
        //  }




        //     $scope.generatePDF  = function (print) {
        //     var pdf = new jsPDF('p', 'pt', 'letter');
        //     var text = "                      Attendence Details";
        //     pdf.text(100, 225, text);
        //     var source = $('#print')[0];
        //     var specialElementHandlers = {
        //         '#bypassme': function (element, renderer) {
        //             return true
        //         }
        //     };
        //     var margins = {
        //         top: 100,
        //         bottom: 100,
        //         left: 160,
        //         width: 27
        //     };
        //     pdf.fromHTML(source, margins.left, margins.top, { 'width': margins.width, 'elementHandlers': specialElementHandlers },
        //         function (dispose) { pdf.save('DailyFeesCollection.pdf'); }, margins);
        //}



        vm.printDiv = function printElem(print) {
            var content = document.getElementById(print).innerHTML;
            var mywindow = window.open('', 'Print', 'height=1000,width=2000');
            var is_chrome = Boolean(mywindow.chrome);
            mywindow.document.write('<html><head><title></title>');
            mywindow.document.write('</head><body>');
            mywindow.document.write(content);
            mywindow.document.write('</body> <br/><br/>');
            mywindow.document.write('<footer style="position: fixed;bottom: 15px;"> <font color="green">Powered By:</font><font color="blue"> onAir International Ltd. </font></footer>');
            mywindow.document.write('<footer style="position: fixed;bottom: 0;"> <font color="green">Web URL:</font><font color="blue">   www.onems.live </font></footer>');
            //mywindow.document.write('<footer> <font color="green">www.onEMS.Live</font></footer>');
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
        };


        //====================================





    }
})();

