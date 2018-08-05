//**********************************************Node Frameworks************************************************************************************* */
(function () {
    'use strict';

    angular
        .module('app.studentInput')
        .controller('studentDataController', studentDataController);

    studentDataController.$inject = ['subjectSettingsSevice', 'classSettingsService', 'commonService', 'userService', 'instituteSettings', 'teacherAttendanceSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', 'pagerService', 'uploadService', '$window', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function studentDataController(subjectSettingsSevice, classSettingsService, commonService, userService, instituteSettings, teacherAttendanceSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, pagerService, uploadService, $window, $localStorage, apiConfig) {

        activate();

        function activate() {
            var promises = [getCmnSessionDdl(), getAllBoard(),
            getAllStudent(), getAllGender(), getAllReligion(), getAllInstitute()
            ];
            return $q.all(promises).then(function () { });
        }

        //************************************************************ Declaration + Initialization ************************************************************************************* */

        var vm = this;
        vm.imgHost = apiConfig.imagehost;
        $scope.showItem = false;
        $scope.createItem = true;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        $scope.Form = true;
        $scope.educationInfoContainer = false;

        var ClassID = 0,
            SectionID = 0,
            ShiftID = 0,
            DepartmentID = 0,
            SessionID = 0,
            BoardID = 0,
            BrunchID = 0,
            MediumID = 0;


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
                    vm.institute = {
                        selected: vm.institutes.filter(function (ob, i) {
                            return (ob.InstituteID === vm.InstituteID);
                        })[0]
                    };
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
                ClassID: classId, //vm.cls.selected.ClassID,
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
                            });
                    }



                });

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
                                vm.section=data;                           
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
                } else {
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
            objcmnParam.InstituteID = (vm.institute.selected.InstituteID === undefined) ? 0 : vm.institute.selected.InstituteID; //$localStorage.userInfo[0].InstituteID;
            objcmnParam.LoggedUserID = $localStorage.userInfo[0].UserID;
            objcmnParam.UserID = 0;
            objcmnParam.ClassID = (vm.ClassID === undefined) ? 0 : vm.ClassID;
            objcmnParam.SectionID = (vm.SectionID === undefined) ? 0 : vm.SectionID;
            objcmnParam.DepartmentID = (vm.DepartmentID === undefined) ? 0 : vm.DepartmentID;
            objcmnParam.MediumID = (vm.MediumID === undefined) ? 0 : vm.MediumID;
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
                columnDefs: [{
                    name: 'UserID',
                    visible: false,
                    headerCellClass: $scope.highlightFilteredHeader
                },
                {
                    name: 'UserName',
                    displayName: 'Student',
                    headerCellClass: $scope.highlightFilteredHeader
                },
                {
                    name: 'RFID',
                    displayName: 'RFID',
                    headerCellClass: $scope.highlightFilteredHeader
                },
                {
                    name: 'RollNo',
                    displayName: 'RollNo',
                    headerCellClass: $scope.highlightFilteredHeader
                },
                {
                    name: 'Guardian',
                    displayName: 'Guardian',
                    headerCellClass: $scope.highlightFilteredHeader
                },
                {
                    name: 'GuardianPhone',
                    displayName: 'Guardian Phone',
                    headerCellClass: $scope.highlightFilteredHeader
                },
                {
                    name: 'ShiftName',
                    displayName: 'Shift',
                    headerCellClass: $scope.highlightFilteredHeader
                },
                {
                    name: 'MameName',
                    displayName: 'Medium',
                    headerCellClass: $scope.highlightFilteredHeader
                },
                {
                    name: 'DepartmentName',
                    displayName: 'Department',
                    headerCellClass: $scope.highlightFilteredHeader
                },
                {
                    name: 'ClassName',
                    displayName: 'Class',
                    headerCellClass: $scope.highlightFilteredHeader
                },
                {
                    name: 'SectionName',
                    displayName: 'Section',
                    headerCellClass: $scope.highlightFilteredHeader
                },
                {
                    name: 'ImageUrl',
                    displayName: 'Image',
                    headerCellClass: $scope.highlightFilteredHeader,
                    cellTemplate: '<img ng-src="{{COL_FIELD}}" style="height:35px; width:35px" />'
                } //,

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
                    }


                });
        };

        $scope.RefreshList = function () {
            if (vm.institute === undefined) {
                logger.error('Please Select an Institute');
                return;
            } else {

                $('#myModal').modal('show'); //jshint ignore :line
                $scope.pagination.pageNumber = 1;
                vm.getStudentDetailsInfo(0);
            }
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
            $state.go($state.current.name, {}, {
                reload: true
            });
            $scope.clearField();
            $scope.showItem = false;
            $scope.createItem = true;
            $scope.educationInfoContainer = true;
        };

        function checkingDropdown() {


            if (vm.SectionID === undefined) {
                SectionID = null;
            } else {
                SectionID = vm.sec.selected.SectionID;
            }
            if (vm.DepartmentID === undefined) {
                DepartmentID = null;
            } else {
                DepartmentID = vm.DepartmentID;
            }
            if (vm.SessionID === undefined) {
                SessionID = null;
            } else {
                SessionID = vm.session.selected.SessionID;
            }

            if (vm.BoardID === undefined) {
                BoardID = null;
            } else {
                BoardID = vm.board.selected.BoardID;
            }
            if (vm.BrunchID === undefined) {
                BrunchID = null;
            } else {
                BrunchID = vm.BrunchID;
            }
            if (vm.ShiftID === undefined) {
                ShiftID = null;
            } else {
                ShiftID = vm.sft.selected.ShiftID;
            }
            if (vm.MediumID === undefined) {
                MediumID = null;
            } else {
                MediumID = vm.MediumID;
            }
        }

        //**********************************************************CRUD************************************************************************************* */




        $scope.svButton = false;
        vm.addNewRowForEducation = function (params) {
            rowCount = params;
            $scope.svButton = true;
            $scope.Form = false;
            $scope.educationInfoContainer = true;

            if (vm.cls === undefined) {
                logger.error('Please Select Class !!');
                $scope.Form = true;
                $scope.educationInfoContainer = false;
                return;
            } else {
                ClassID = vm.cls.selected.ClassID;
            }
            checkingDropdown();

            if (rowCount === undefined || rowCount > 150) {

                if (rowCount === undefined) {
                    logger.error('Please Enter Row !!');
                    $scope.Form = true;
                    $scope.educationInfoContainer = false;
                }
                if (rowCount > 50) {
                    logger.error('Row Must be Less Then 200 !!');
                    $scope.Form = true;
                    $scope.educationInfoContainer = false;
                }
                return;
            }

            studentInfo();

            if (params === null || params === undefined) {
                return;
            } else {

                var newrowEducation1 = [];
                if ($scope.EducationData.length === 0) {
                    newrowEducation1 = [{
                        'ID': 0,
                        'studentName': '',
                        'parentName': '',
                        'phone': '',
                        'email': null,
                        'roll': '',
                        'studentID': null,
                        'DOB': '',
                        'gender': '',
                        'genderID': '',
                        'religion': '',
                        'ReligionID': '',
                        'address': null,
                        'image': null,
                        'imageURL': null,
                        'imgShowSignature': null
                    }];
                    $scope.EducationData.push(newrowEducation1);
                }
                for (var i = 0; i < rowCount - 1; i++) {
                    var newrowEducation = [];
                    $scope.EducationData[0].forEach(function (row) {

                        newrowEducation.push({
                            'ID': 0,
                            'studentName': '',
                            'parentName': '',
                            'phone': '',
                            'email': null,
                            'roll': '',
                            'studentID': null,
                            'DOB': '',
                            'gender': '',
                            'genderID': '',
                            'religion': '',
                            'ReligionID': '',
                            'address': null,
                            'image': null,
                            'imageURL': null,
                            'imgShowSignature': null
                        });
                    });
                    $scope.EducationData.push(newrowEducation);
                }
            }
        };




        $scope.uploadExcel = function (file, errFiles, imgIndex) {


            rowCount = 0;

            if (vm.cls === undefined) {
                logger.error('Please Select Class !!');
                $scope.Form = true;
                $scope.educationInfoContainer = false;
                return;
            }

            $scope.f = file;


            InstituteName = null;
            Class = null;
            Section = null;

            InstituteName = $localStorage.userInfo[0].InstituteName;

            $scope.errFile = errFiles && errFiles[0];

            if (file) {
                file.upload = Upload.upload({
                    url: apiConfig.imagehost + 'api/onEms/upload/excel/' + InstituteName + '/' + Class + '/' + Section,
                    method: 'POST',
                    data: {
                        file: file
                    }
                });
                file.upload.then(function (response) {
                    $timeout(function () {

                        if (response.data.data !== null) {


                            studentInfo();


                            $scope.EducationData = null;
                            $scope.EducationData = [];
                            var excelObject = response.data.data;


                            var genderID = null;
                            if (excelObject[0].gender === 'Male') {
                                genderID = 1;
                            }
                            if (excelObject[0].gender === 'Female') {
                                genderID = 2;
                            }

                            var religionID = null;
                            if (excelObject[0].religion === 'Islam') {
                                religionID = 1;
                            }
                            if (excelObject[0].religion === 'Hindu') {
                                religionID = 2;
                            }
                            if (excelObject[0].religion === 'Christian') {
                                religionID = 3;
                            }
                            if (excelObject[0].religion === 'Buddhist') {
                                religionID = 4;
                            }
                            if (excelObject[0].religion === 'Tribe') {
                                religionID = 5;
                            }


                            var newrowEducation1 = [];
                            if ($scope.EducationData.length === 0) {
                                newrowEducation1 = [{
                                    'studentName': excelObject[0].student,
                                    'parentName': excelObject[0].parent,
                                    'phone': excelObject[0].phone,
                                    'email': excelObject[0].email,
                                    'roll': parseInt(excelObject[0].roll),
                                    'studentID': parseInt(excelObject[0].rfid),
                                    'DOB': excelObject[0].dob,
                                    'GenderName': '',
                                    'GenderID': '',
                                    'ReligionName': '',
                                    'ReligionID': '',
                                    'address': excelObject[0].address,
                                    'image': null,
                                    'imageURL': null,
                                    'imgShowSignature': null,
                                    'genderSelected': {
                                        GenderName: excelObject[0].gender,
                                        GenderID: genderID
                                    },
                                    'religionSelected': {
                                        ReligionName: excelObject[0].religion,
                                        religionID: religionID
                                    }
                                }];
                                $scope.EducationData.push(newrowEducation1);
                            }


                            for (var i = 1; i <= response.data.data.length - 1; i++) {

                                var newrowEducation = [];
                                $scope.EducationData[0].forEach(function (row) {

                                    if (excelObject[i].gender === 'Male') {
                                        genderID = 1;
                                    }
                                    if (excelObject[i].gender === 'Female') {
                                        genderID = 2;
                                    }

                                    if (excelObject[i].religion === 'Islam') {
                                        religionID = 1;
                                    }
                                    if (excelObject[i].religion === 'Hindu') {
                                        religionID = 2;
                                    }
                                    if (excelObject[i].religion === 'Christian') {
                                        religionID = 3;
                                    }
                                    if (excelObject[i].religion === 'Buddhist') {
                                        religionID = 4;
                                    }
                                    if (excelObject[i].religion === 'Tribe') {
                                        religionID = 5;
                                    }

                                    newrowEducation.push({
                                        'studentName': excelObject[i].student,
                                        'parentName': excelObject[i].parent,
                                        'phone': excelObject[i].phone,
                                        'email': excelObject[i].email,
                                        'roll': parseInt(excelObject[i].roll),
                                        'studentID': parseInt(excelObject[i].rfid),
                                        'DOB': excelObject[i].dob,
                                        'GenderName': '',
                                        'GenderID': '',
                                        'ReligionName': '',
                                        'ReligionID': '',
                                        'address': excelObject[0].address,
                                        'image': null,
                                        'imageURL': null,
                                        'imgShowSignature': null,
                                        'genderSelected': {
                                            GenderName: excelObject[i].gender,
                                            GenderID: genderID
                                        },
                                        'religionSelected': {
                                            ReligionName: excelObject[i].religion,
                                            religionID: religionID
                                        }
                                    });
                                });
                                $scope.EducationData.push(newrowEducation);
                            }
                        }
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




            $scope.Form = false;
            $scope.educationInfoContainer = true;
            // wait(5000);

        };




        function studentInfo() {

            vm.GridClassName = vm.cls.selected.ClassName;

            vm.GridSection = ''; vm.GridDept = ''; vm.GridSession = ''; vm.GridBoard = ''; vm.GridBrunch = ''; vm.GridShift = ''; vm.GridMed = '';

            if (vm.SectionID !== undefined) {
                vm.GridSection = vm.sec.selected.SectionName;
            }
            if (vm.DepartmentID !== undefined) {
                vm.GridDept = vm.department.selected.DepartmentName;
            }

            if (vm.SessionID != null) {
                vm.GridSession = vm.session.selected.SessionName;
            }
            if (vm.BoardID != null) {
                vm.GridBoard = vm.board.selected.BoardName;
            }
            if (vm.BrunchID != null) {
                vm.GridBrunch = vm.brunch.selected.BrunchName;
            }
            if (vm.ShiftID != null) {
                vm.GridShift = vm.sft.selected.ShiftName;
            }
            if (vm.med !== undefined || vm.med != null) {
                vm.GridMed = vm.med.selected.MameName;
            }

        }




        $scope.uploadFilesSignature = function (file, errFiles, imgIndex) {

            $scope.f = file;
            if (file.$ngfBlobUrl != null) {
                $scope.EducationData[imgIndex][0].image = file.$ngfBlobUrl;
            }

            InstituteName = null;
            Class = null;
            Section = null;

            InstituteName = $localStorage.userInfo[0].InstituteName;
            Class = vm.cls.selected.ClassName;

            if (vm.SectionID !== undefined) {
                Section = vm.sec.selected.SectionName;
            }
          

            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: apiConfig.imagehost + 'api/onEms/uploads/' + InstituteName + '/' + Class + '/' + Section,
                    method: 'POST',
                    data: {
                        file: file
                    }
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        var data = JSON.parse(response.data);
                        $scope.EducationData[imgIndex][0].imageURL = data.path;
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
            $scope.EducationData[imgIndex][0].imgShowSignature = true;
        };




        function wait(ms) {
            var start = new Date().getTime();
            var end = start;
            while (end < start + ms) {
                end = new Date().getTime();
            }
        }



        //debugger;

        vm.postUserSetupStudent = function (params) {

            var allStudentData = [].concat.apply([], $scope.EducationData);
            if (allStudentData !== undefined) {

                for (var i = 0; i < allStudentData.length; i++) {

                    // excelData.push(allStudentData[i]);
                    if (commonService.require(allStudentData[i].studentName, 'Student Name') === 0 ||
                        commonService.require(allStudentData[i].parentName, 'Parent Name') === 0 ||
                        commonService.require(allStudentData[i].roll, 'Roll Number') === 0 ||
                        commonService.require(allStudentData[i].DOB, 'Date Of Birth') === 0 ||
                        commonService.require(allStudentData[i].genderSelected.GenderID, 'Gender') === null ||
                        commonService.require(allStudentData[i].religionSelected.ReligionID, 'Religion') === 0) {
                        console.log('done');
                        return;

                    }

                }
                checkingDropdown();

                userService.SetExcelData({

                    UserClassID: 0, //0 for insert 
                    UserID: 0, // 0 for insert 
                    RFID: 0, // update in future 
                    StudentNo: 0, // no instruction 
                    SectionID: SectionID,
                    ClassID: vm.cls.selected.ClassID,
                    BrunchID: BrunchID,
                    ShiftID: ShiftID,
                    Remarks: 'Predator',
                    InstituteID: vm.institute.selected.InstituteID,
                    UserTypeID: 3,
                    DepartmentID: DepartmentID,
                    MediumID: MediumID,
                    userTypeID: 0, // value is in Procedure 
                    excelData: allStudentData,
                    CreateBy: 0,
                    CreateOn: '2017-01-01',
                    CreatePc: null,
                    UpdateBy: null,
                    UpdateOn: '2017-01-01',
                    UpdatePc: null,
                    IsDeleted: 0,
                    DeleteBy: null,
                    DeleteOn: '2017-01-01',
                    DeletePc: null
                }).
                    then(function (data) {
                        logger.info('Saved!');
                        $scope.clearField();
                    })
                    .catch(function (error) { });
            } else {
                logger.info('Please Select Your Institute and Medium');
            }

        };



        $scope.EducationRemoveRow = function (index) {
            if ($scope.EducationData[index][0].UserEducationRecordID > 0) {
                $scope.EducationData[index][0].IsDeleted = true;
                $scope.removeEducationTrIndex = index;
            } else {
                $scope.EducationData.splice(index, 1);
                if ($scope.EducationData.length === 0) {
                    $scope.EducationData = [];
                }
            }
        };




        $scope.toggleFlat = function () {
            $scope.gridOptions.flatEntityAccess = !$scope.gridOptions.flatEntityAccess;
        };

        vm.deleteUserStudent = function (userID) {
            var params = {
                userID: parseInt(userID)
            };
            userService.deleteUserByID(params)
                .then(function (data) {
                    if (data[0].returnvalue) {
                        logger.info('Delete Successfully');
                        $state.go($state.current.name, {}, {
                            reload: true
                        });
                    } else {
                        logger.error('Delete Faild');
                    }
                })
                .catch(function (error) { });
        };



        //**********************************************************Clear/Reset************************************************************************************* */
        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, {
                reload: true
            });
        };


    }
})();
