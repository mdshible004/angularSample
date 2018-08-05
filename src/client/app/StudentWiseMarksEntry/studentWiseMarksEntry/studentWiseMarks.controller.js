
(function () {
    'use strict';

    angular
        .module('app.StudentWiseMarksEntry')
        .controller('StudentWiseMarksEntryController', StudentWiseMarksEntryController);

    StudentWiseMarksEntryController.$inject = ['StudentWiseMarksEntry','insExameSetting','periodSetup', 'classSettingsService','subjectSettingsSevice','commonService', 'conversion', 'teacherAttendanceSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function StudentWiseMarksEntryController(StudentWiseMarksEntry, insExameSetting, periodSetup, classSettingsService, subjectSettingsSevice, commonService, conversion, teacherAttendanceSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

        var vm = this;
        $scope.disButton = true;
        $scope.resultBtn = true;
        //$scope.disStudent = true;
        $scope.addPassMark = false;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.listEvent = function () {
            //If DIV is visible it will be hidden and vice versa.
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
            objcmnParam.InstituteID = (vm.institute.selected === undefined) ? 0 : vm.institute.selected.InstituteID;  //$localStorage.userInfo[0].InstituteID;
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
                        width: '10%',
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
                        vm.registrationSetup = data[0].UserName;
                        vm.UserID = data[0].UserID;
                        $scope.SessionID = data[0].SessionID;
                        $scope.resultBtn = false;
                        //if (vm.UserID !== null || vm.UserID !== undefined))
                    }
                    else {
                        logger.error('Your desired data not found');
                    }
                    $scope.loaderMore = false;
                });
        };
       
        //$scope.openPeriodIndex = function (index) {
        //    $scope.periodindex = index;
        //    $scope.clsPeriod[$scope.periodindex].Pid = $scope.periodindex;
        //};

        //$scope.switch = function (e) {
        //    if (e === 1) {
        //        $scope.clsPeriod[$scope.periodindex].IsActive = 0;
        //    } else {
        //        $scope.clsPeriod[$scope.periodindex].IsActive = 1;
        //    }

        //};



        $scope.getAllResults = function () {

            var params = {
                UserID: vm.UserID,
                InstituteID: vm.institute.selected.InstituteID,
                ClassID: vm.ClassID === undefined ? 0 : vm.ClassID,
                SectionID: vm.SectionID === undefined ? 0 : vm.SectionID,
                DepartmentID: vm.DepartmentID === undefined ? 0 : vm.DepartmentID,
                MediumID: vm.MediumID === undefined ? 0 : vm.MediumID,
                ShiftID: vm.ShiftID === undefined ? 0 : vm.ShiftID,
                SubjectID: vm.SubjectID === undefined ? 0 : vm.SubjectID,
                ExamID: vm.ExamID === undefined ? 0 : vm.ExamID
            };
            return StudentWiseMarksEntry.studenetWiseMarks(params)
                .then(function (data) {
                    vm.marks = data;
                    $scope.marks = data;
                    $scope.addPassMark = true;
                    $scope.disButton = false;
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

        //$scope.openShiftIndex = function (index) {
        //    $scope.shiftindex = index;
        //    $scope.marks[$scope.shiftindex].id = $scope.shiftindex;
        //};

        //$scope.switch = function (e) {
        //    if (e === 1) {
        //        $scope.marks[$scope.shiftindex].IsAbsent = 0;
        //    } else {
        //        $scope.marks[$scope.shiftindex].IsAbsent = 1;
        //    }


        //};


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


        vm.ExamMarkID = 0;
        

        vm.postExameExampassMark = function () {

            var examMarks = [].concat.apply([], $scope.marks);

            StudentWiseMarksEntry.postExamMarks({

                ExamMarkID: examMarks[0].ExamMarkID === null ? 0 : examMarks[0].ExamMarkID,             
                ExamID: vm.ExamID,
                SectionID: vm.SectionID=== undefined?null:vm.SectionID,
                ShiftID: vm.ShiftID === undefined?null:vm.ShiftID,
                UserID: vm.UserID,
                DepartmentID: vm.DepartmentID=== undefined?null:vm.DepartmentID,
                MeduimID: vm.MediumID,
                ClassID: vm.ClassID,
                SubjectID: vm.SubjectID === undefined ? examMarks[0].SubjectID : vm.SubjectID,
                MCQ: examMarks[0].MCQ,
                Written: examMarks[0].Written,
                Precticle: examMarks[0].Precticle,
                Attendance: examMarks[0].Attendance,
                Total: examMarks[0].Total,
                InstituteID: vm.institute.selected.InstituteID,
                IsAbsent: examMarks[0].IsAbsent,
                LoggedUserID: $localStorage.userInfo[0].UserID,
                IsDeleted: 0,
                SessionID: $scope.SessionID,
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
            $scope.resultBtn = true;
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
            $scope.gridOptions.data = [];
            if (status === 0) {
                vm.DepartmentID = null;
            }
            vm.department = undefined;
            //vm.departments = [];
        };

        activate();

        function activate() {
            var promises = [getInstitute(''), /*vm.showexams()*/
                
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
            if (status === '') {
                vm.SectionID = null;
                vm.section = undefined;
                vm.sections = [];
                $scope.ReloadSec();
            }
            
            var params = {
                instituteId: vm.institute.selected.InstituteID, //$localStorage.userInfo[0].InstituteID,
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
            $scope.resultBtn = true;
            $scope.gridOptions.data = [];
            vm.registrationSetup = [];
        };
        vm.getAllShift = function (InstituteID, status) {
            var Params = {
                instituteId: InstituteID
            };
            return commonService.getInstituteShift(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        vm.shifts = data;
                        $scope.IsRequiredShift = true;
                    }
                    else {
                        $scope.IsRequiredShift = false;
                    }

                    //if (status === 'Edit') {
                    //    vm.shift = {
                    //        selected: vm.shifts.filter(function (ob, i) {
                    //            return (ob.ShiftID === vm.ShiftID);
                    //        })[0]
                    //    };
                    //}
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
                    //vm.showexams(vm.instituteID);
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

                    vm.showexams();
                });

        };


        vm.MediumWiseClassDDL = function (MediumID, status) {
            if (status === '') {
                $scope.ReloadClass(1);
                $scope.ReloadClassByMedium();
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
            //$scope.ReloadDll(a);
            var Params = {
                InstituteID: vm.instituteID,
                MediumID: vm.MediumID,
                ClassID: vm.ClassID
            };
            

           return insExameSetting.getAllExamesDDL(Params)

                    .then(function (data) {
                        vm.exames = data;                       
                    });
           
        };
        vm.showSubject = function (a,b,c,d) {
            $scope.showItem = true;
            var subjectParams = {
                InstituteID: a,
                DepartmentID: b === undefined ? null : b,
                MediumID: c === undefined ? null : c,
                ClassID: d

            };
            return commonService.GetClassWiseSubject(subjectParams)
                .then(function (data) {
                    vm.subjects = data;
                    $scope.subjects = data;

                    vm.values = [];
                    if ($scope.subjects !== undefined) {
                        for (var i = 0; i < $scope.subjects.length; i++) {

                            if ($scope.subjects[i].IsActive === 1) {
                                vm.values.push($scope.subjects[i]);
                                //vm.subjectName = $scope.subjects[i].SubjectName;
                                //vm.subjectID = $scope.subjects[i].SubjectID;
                            }

                        }
                    }
                });
        };

        
    }
})();

