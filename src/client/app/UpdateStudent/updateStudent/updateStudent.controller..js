(function () {
    'use strict';

    angular
        .module('app.UpdateStudent')
        .controller('UpdateStudentController', UpdateStudentController);

    UpdateStudentController.$inject = ['classSettingsService', 'mailSettings', 'commonService', 'subjectSettingsSevice', 'instituteSettings', 'userService', 'updateStudentService', 'studentAtdReportSettingsService', 'dailySubWiseAtdSettingsService', 'shiftSettings', 'mediumsetting', 'classSettings', 'sectionSettingsSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function UpdateStudentController(classSettingsService, mailSettings, commonService, subjectSettingsSevice, instituteSettings, userService, updateStudentService, studentAtdReportSettingsService, dailySubWiseAtdSettingsService, shiftSettings, mediumsetting, classSettings, sectionSettingsSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, apiConfig) {

        var vm = this;
        vm.imgHost = apiConfig.imagehost;
        $scope.InstituteID = $localStorage.userInfo[0].InstituteID;


        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;

        $scope.UpdateItem = false;

        $scope.itemEvent = function () {


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


        $scope.openStudentIndex = function (index) {
            $scope.studentIndex = index;
            $scope.studentInfo[$scope.studentIndex].id = $scope.studentIndex;
        };


        //$scope.index;
        //  ---------------Image Upload -------------------

        $scope.imgShow = false;
        $scope.imgShowSignature = false;

        $scope.uploadFiles = function (file, errFiles) {
            $scope.f = file;
            if (errFiles.length > 0) {
                logger.error('Max size 1MB required!!!');
                return;
            }

            if (file !== null && file.$ngfBlobUrl != null) {
                $scope.Uimage = file.$ngfBlobUrl;
            }
            $scope.errFile = errFiles && errFiles[0];


            var InstituteName = null;
            var Class = null;
            var Section = null;

            InstituteName = vm.institute.selected.InstituteName;
            Class = vm.class.selected.ClassName;

            if (vm.SectionID !== null) {
                Section = vm.section.selected.SectionName;
            }




            if (file) {
                file.upload = Upload.upload({
                    url: apiConfig.imagehost + 'api/onEms/uploads/' + InstituteName + '/' + Class + '/' + Section,
                    method: 'POST',
                    data: { file: file }
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        var data = JSON.parse(response.data);
                        //var xx = "E/:"
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
            //debugger;
            $scope.gridOptions.enableFiltering = true;
            $scope.pagination.pageNumber = $scope.pagination.pageNumber === undefined ? 1 : $scope.pagination.pageNumber;
            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();            
            objcmnParam.pageNumber = ($scope.pagination.pageNumber - 1) * $scope.pagination.pageSize;
            objcmnParam.pageSize = $scope.pagination.pageSize;
            objcmnParam.IsPaging = isPaging;
            objcmnParam.InstituteID = (vm.institute === undefined) ? 0 : vm.institute.selected.InstituteID;  //$localStorage.userInfo[0].InstituteID;
            objcmnParam.LoggedUserID = $localStorage.userInfo[0].UserID;
            objcmnParam.UserID = 0;
            objcmnParam.ClassID = (vm.ClassID === undefined || vm.ClassID === null) ? 0 : vm.ClassID;
            objcmnParam.SectionID = (vm.SectionID === undefined || vm.SectionID === null) ? 0 : vm.SectionID;
            objcmnParam.DepartmentID = (vm.DepartmentID === undefined || vm.DepartmentID === null) ? 0 : vm.DepartmentID;
            objcmnParam.MediumID = (vm.MediumID === undefined || vm.MediumID === null) ? 0 : vm.MediumID;
            objcmnParam.ShiftID = (vm.ShiftID === undefined || vm.ShiftID === null) ? 0 : vm.ShiftID;
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


            return updateStudentService.getStudentBasicInfoList(objcmnParam)
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
                        //vm.ClassSelected(data[0].ClassID); 
                    }


                });
        };

        $scope.RefreshList = function () {
            //debugger;
            if (vm.institute === undefined) {
                logger.error('Please Select an Institute');
                return;
            } else {

                $scope.UpdateItem = false;
                $('#myModal').modal('show');//jshint ignore :line
                $scope.pagination.pageNumber = 1;
                vm.getStudentDetailsInfo(0);
            }
        };
        //************************************************End Grid******************************************************


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
            $scope.showItem = false;
        };

        $scope.ReloadMedium = function () {
            //vm.MediumID = null;
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
        };

        $scope.ReloadClass = function () {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            //vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
        };

        $scope.ReloadDept = function () {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            //vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
        };

        vm.ClassSelected = function (ID, Status) {

            if (status === '') {
                vm.SectionID = null;
                vm.section = undefined;
                vm.sections = [];
            }

            var params = {
                instituteId: vm.institute.selected.InstituteID,
                classId: vm.ClassID,
                DepartmentID: vm.DepartmentID === null || vm.DepartmentID === undefined ? null : vm.DepartmentID
            };


            commonService.getInstituteSection(params)
                .then(function (data) {

                    vm.sections = data;

                    if (Status === 'Edit') {
                        vm.SectionID = ID;
                        if (vm.section === undefined) {
                            vm.section = {
                                selected: vm.sections.filter(function (ob, i) {
                                    return (ob.SectionID === ID);
                                })[0]
                            };
                        }
                    }
                });






        };
        $scope.change = function () {
            vm.medium = null;
            vm.class = null;
            vm.department = null;
            vm.section = null;
            vm.shift = null;
            vm.classes = [];
            vm.departments = [];
            vm.sections = [];
            vm.mediums = [];
            vm.shifts = [];
        };
        $scope.changeMed = function () {

            vm.class = null;
            vm.department = null;
            vm.section = null;
            vm.classes = [];
            vm.departments = [];
            vm.sections = [];
        };
        $scope.changeCls = function () {
            vm.department = null;
            vm.section = null;
            vm.departments = [];
            vm.sections = [];
        };
        $scope.changeDep = function () {
            vm.section = null;
            vm.sections = [];

        };
        activate();

        function activate() {
            var promises = [getInstitute(''), getAllGender()

            ];
            return $q.all(promises).then(function () {

            });
        }
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        function getInstitute(status) {
            if (status === '') {
                $scope.ReloadDll();
            }

            return classSettingsService.getInstitute()
                .then(function (data) {
                    vm.institutes = data;
                    vm.instituteID = status === 'Edit' ? vm.institute.selected.InstituteID : $localStorage.userInfo[0].InstituteID;

                    //vm.instituteID = $localStorage.userInfo[0].InstituteID;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };
                    vm.getAllShift(vm.instituteID, status);
                    vm.getmediumNameDdl(vm.instituteID, status);
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

        vm.ClassWiseDepartmentDDL = function (ClassID, status) {
            if (status === '') {
                $scope.ReloadDept();
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


        function getAllGender() {

            return commonService.getGender()

                .then(function (data) {
                    vm.genders = data;
                });
        }
        $scope.func = function () {
            $scope.UpdateItem = vm.ClassID > 0 ? true : false;
        };

        $scope.selectedEvent = function (model) {
            $scope.UpdateItem = true;
            $scope.createItem = false;
            objcmnParam.pageNumber = 1;
            objcmnParam.pageSize = 0;
            objcmnParam.IsPaging = 0;
            objcmnParam.InstituteID = vm.institute.selected.InstituteID;
            objcmnParam.LoggedUserID = $localStorage.userInfo[0].UserID;
            objcmnParam.UserID = model.UserID;
            return commonService.getStudentBasicInfoList(objcmnParam)
                .then(function (data) {
                    vm.UpdateStudents = data;
                    $('#myModal').modal('hide'); //jshint ignore :line

                    vm.studentSetup.Name = data[0].UserName;
                    vm.studentSetup.Guardian = data[0].Guardian;
                    vm.studentSetup.GuardianPhone = data[0].GuardianPhone;
                    vm.studentSetup.GuardianEmail = data[0].GuardianEmailID;
                    
                    if (data[0].GenderID !== null) {
                        vm.GenderID = data[0].GenderID;
                        vm.gender = { selected: vm.genders.filter(function (ob, i) { return (ob.GenderID === data[0].GenderID); })[0] };
                    }
                    vm.MediumID = data[0].MediumID;
                    vm.ShiftID = data[0].ShiftID;
                    vm.ClassID = data[0].ClassID;
                    vm.SectionID = data[0].SectionID;
                    vm.DepartmentID = data[0].DepartmentID;
                    vm.insID = data[0].InstituteID;
                    getInstitute('Edit');
                    vm.MediumWiseClassDDL(vm.MediumID, 'Edit');
                    vm.ClassWiseDepartmentDDL(vm.ClassID, 'Edit');
                    vm.ClassSelected(vm.SectionID, 'Edit');
                    vm.studentSetup.RFID = data[0].RFID;
                    vm.studentSetup.RollNo = data[0].RollNo;
                    vm.studentSetup.DOB = data[0].DOB;
                    vm.studentSetup.Address = data[0].PreAddress;
                    vm.studentSetup.Remarks = data[0].Remarks;
                    vm.studentSetup.UserClassID = data[0].UserClassID;
                    vm.studentSetup.UserID = data[0].UserID;
                    vm.studentSetup.StudentNo = data[0].StudentNo;
                    vm.studentSetup.BrunchID = data[0].BrunchID;
                    vm.studentSetup.UserTypeID = data[0].UserTypeID;
                    vm.studentSetup.PhoneNo = data[0].PhoneNo;
                    vm.studentSetup.EmailID = data[0].EmailID;
                    vm.ImageUrl = data[0].ImageUrl === '' ? '../images/profiles/no-user-image.png' : data[0].ImageUrl;
                    vm.studentSetup.FingerUrl = data[0].FingerUrl;
                    vm.ImageURL = data[0].SignatureUrl;
                    vm.studentSetup.ReligionID = data[0].ReligionID;
                    vm.studentSetup.IsImageCaptured = data[0].IsImageCaptured;
                    vm.studentSetup.GuardianID = data[0].GuardianID;

                    vm.studentSetup.UserNo = data[0].UserNo;
                    vm.studentSetup.UserTitleID = data[0].UserTitleID;
                    vm.studentSetup.UserFirstName = data[0].UserFirstName;
                    vm.studentSetup.UserMiddleName = data[0].UserMiddleName;
                    vm.studentSetup.UserLastName = data[0].UserLastName;
                    vm.studentSetup.NickName = data[0].NickName;
                    vm.studentSetup.SkypeID = data[0].SkypeID;
                    vm.studentSetup.FacebookID = data[0].FacebookID;
                    vm.studentSetup.WhatsApp = data[0].WhatsApp;
                    vm.studentSetup.Viber = data[0].Viber;
                    vm.studentSetup.LinkedIN = data[0].LinkedIN;
                    vm.studentSetup.ParAddress = data[0].ParAddress;
                    vm.studentSetup.ParThana = data[0].ParThana;
                    vm.studentSetup.ParPostCode = data[0].ParPostCode;
                    vm.studentSetup.ParCountryID = data[0].ParCountryID;
                    vm.studentSetup.ParStateID = data[0].ParStateID;
                    vm.studentSetup.ParCityID = data[0].ParCityID;
                    vm.studentSetup.PreThana = data[0].PreThana;
                    vm.studentSetup.PrePostCode = data[0].PrePostCode;
                    vm.studentSetup.PreCountryID = data[0].PreCountryID;
                    vm.studentSetup.PreStateID = data[0].PreStateID;
                    vm.studentSetup.PreCityID = data[0].PreCityID;
                    vm.studentSetup.MobileNo = data[0].MobileNo;
                    vm.studentSetup.UniqueIdentity = data[0].UniqueIdentity;
                    vm.studentSetup.BloodGroupID = data[0].BloodGroupID;
                    vm.studentSetup.Weigth = data[0].Weigth;
                    vm.studentSetup.Height = data[0].Height;
                    vm.studentSetup.BirthCertificate = data[0].BirthCertificate;
                    vm.studentSetup.PassportNO = data[0].PassportNO;
                    vm.studentSetup.NID = data[0].NID;
                    vm.studentSetup.IsActive = data[0].IsActive;
                    vm.studentSetup.StatusID = data[0].StatusID;
                    vm.studentSetup.GuardianMobileNo = data[0].GuardianMobileNo;
                    vm.studentSetup.GuardianUserFirstName = data[0].GuardianUserFirstName;
                    vm.studentSetup.GuardianUserMiddleName = data[0].GuardianUserMiddleName;
                    vm.studentSetup.GuardianUserLastName = data[0].GuardianUserLastName;
                    vm.studentSetup.GuardianNickName = data[0].GuardianNickName;
                    vm.studentSetup.GuardianUniqueIdentity = data[0].GuardianUniqueIdentity;
                    vm.studentSetup.GuardianBloodGroupID = data[0].GuardianBloodGroupID;
                    vm.studentSetup.GuardianPassportNO = data[0].GuardianPassportNO;
                    vm.studentSetup.GuardianNID = data[0].GuardianNID;
                    vm.studentSetup.RelationID = data[0].RelationID;
                    vm.studentSetup.IsLocalGuardian = data[0].IsLocalGuardian;
                    vm.studentSetup.IsActiveFamily = data[0].IsActiveFamily;
                    vm.studentSetup.SessionID = data[0].SessionID;
                    vm.studentSetup.BoardID = data[0].BoardID;
                    vm.studentSetup.IsActiveStudent = data[0].IsActiveStudent;


                });

        };





        $scope.StringToDate = function (dt) {
            var dtList = dt.split('-');
            var getDate = dtList[1] + '-' + dtList[0] + '-' + dtList[2];
            return getDate;
        };


        vm.UpdateStudent = function () {


            if (vm.studentSetup.RollNo === 0 || vm.studentSetup.RollNo === undefined || vm.studentSetup.RollNo === null) {
                logger.warning('Please Enter Roll !!');
                return;
            }



            vm.ImageUrl = vm.ImageUrl === undefined || vm.ImageUrl === '' ? null : vm.ImageUrl;
            updateStudentService.postStudentBasicInfo({
                UserClassID: vm.studentSetup.UserClassID,
                UserID: vm.studentSetup.UserID,
                RFID: vm.studentSetup.RFID,
                RollNo: vm.studentSetup.RollNo,
                StudentNo: vm.studentSetup.StudentNo,
                SectionID: (vm.section === undefined || vm.section === null || vm.section.selected === undefined) ? null : vm.section.selected.SectionID,   //(vm.sectionID===undefined)? null: vm.sectionID, 
                ClassID: (vm.class === undefined || vm.class === null || vm.class.selected === undefined) ? null : vm.class.selected.ClassID,
                BrunchID: (vm.studentSetup.BrunchID === undefined) ? null : vm.studentSetup.BrunchID,
                ShiftID: (vm.shift === undefined || vm.shift === null || vm.shift.selected === undefined) ? null : vm.shift.selected.ShiftID,
                Remarks: vm.studentSetup.Remarks,
                InstituteID: vm.insID,
                UserTypeID: vm.studentSetup.UserTypeID,
                GenderID: (vm.GenderID === undefined || vm.GenderID === null) ? null : vm.GenderID,  //(vm.gender === undefined)? null : vm.gender.selected.GenderID, //(vm.GenderID === undefined)? null: vm.gender.selected.GenderID,
                UserName: vm.studentSetup.Name,
                PhoneNo: vm.studentSetup.PhoneNo,
                EmailID: vm.studentSetup.EmailID,
                ImageUrl: vm.ImageUrl === '../images/profiles/no-user-image.png' ? null : vm.ImageUrl,
                FingerUrl: vm.studentSetup.FingerUrl,
                SignatureUrl: (vm.studentSetup.SignatureUrl === undefined) ? null : vm.studentSetup.SignatureUrl,
                Guardian: vm.studentSetup.Guardian,
                GuardianPhone: vm.studentSetup.GuardianPhone,
                GuardianEmailID: vm.studentSetup.GuardianEmail,
                DOB: vm.studentSetup.DOB === undefined || vm.studentSetup.DOB === '' ? '' : $scope.StringToDate(vm.studentSetup.DOB),
                PreAddress: vm.studentSetup.Address,
                ReligionID: (vm.studentSetup.ReligionID === undefined) ? null : vm.studentSetup.ReligionID,
                DepartmentID: (vm.DepartmentID === undefined || vm.DepartmentID === null) ? null : vm.DepartmentID,
                MediumID: (vm.medium === undefined || vm.medium === null || vm.medium.selected === undefined) ? null : vm.medium.selected.MediumID, //(vm.EmediumID===undefined)? null: vm.EmediumID,
                IsImageCaptured: (vm.ImageUrl !== undefined) ? 1 : 0,


                UserNo: vm.studentSetup.UserNo,
                UserTitleID: vm.studentSetup.UserTitleID,
                UserFirstName: vm.studentSetup.UserFirstName,
                UserMiddleName: vm.studentSetup.UserMiddleName,
                UserLastName: vm.studentSetup.UserLastName,
                NickName: vm.studentSetup.NickName,
                SkypeID: vm.studentSetup.SkypeID,
                FacebookID: vm.studentSetup.FacebookID,
                WhatsApp: vm.studentSetup.WhatsApp,
                Viber: vm.studentSetup.Viber,
                LinkedIN: vm.studentSetup.LinkedIN,
                ParAddress: vm.studentSetup.ParAddress,
                ParThana: vm.studentSetup.ParThana,
                ParPostCode: vm.studentSetup.ParPostCode,
                ParCountryID: vm.studentSetup.ParCountryID,
                ParStateID: vm.studentSetup.ParStateID,
                ParCityID: vm.studentSetup.ParCityID,
                PreThana: vm.studentSetup.PreThana,
                PrePostCode: vm.studentSetup.PrePostCode,
                PreCountryID: vm.studentSetup.PreCountryID,
                PreStateID: vm.studentSetup.PreStateID,
                PreCityID: vm.studentSetup.PreCityID,
                MobileNo: vm.studentSetup.MobileNo,
                UniqueIdentity: vm.studentSetup.UniqueIdentity,
                BloodGroupID: vm.studentSetup.BloodGroupID,
                Weigth: vm.studentSetup.Weigth,
                Height: vm.studentSetup.Height,
                BirthCertificate: vm.studentSetup.BirthCertificate,
                PassportNO: vm.studentSetup.PassportNO,
                NID: vm.studentSetup.NID,
                IsActive: vm.studentSetup.IsActive,
                StatusID: vm.studentSetup.StatusID,
                GuardianMobileNo: vm.studentSetup.GuardianMobileNo,
                GuardianUserFirstName: vm.studentSetup.GuardianUserFirstName,
                GuardianUserMiddleName: vm.studentSetup.GuardianUserMiddleName,
                GuardianUserLastName: vm.studentSetup.GuardianUserLastName,
                GuardianNickName: vm.studentSetup.GuardianNickName,
                GuardianUniqueIdentity: vm.studentSetup.GuardianUniqueIdentity,
                GuardianBloodGroupID: vm.studentSetup.GuardianBloodGroupID,
                GuardianPassportNO: vm.studentSetup.GuardianPassportNO,
                GuardianNID: vm.studentSetup.GuardianNID,
                RelationID: vm.studentSetup.RelationID,
                IsLocalGuardian: vm.studentSetup.IsLocalGuardian,
                IsActiveFamily: vm.studentSetup.IsActiveFamily,
                SessionID: vm.studentSetup.SessionID,
                BoardID: vm.studentSetup.BoardID,
                IsActiveStudent: vm.studentSetup.IsActiveStudent,



                CreateBy: null,
                CreateOn: '10-10-2017',
                CreatePc: null,
                UpdateBy: null,
                UpdateOn: '10-10-2017',
                UpdatePc: null,
                IsDeleted: 0,
                DeleteBy: null,
                DeleteOn: '10-10-2017',
                DeletePc: null
            })
                .then(function (data) {
                    logger.info('Saved!');
                    $scope.FuncToBack();
                    //$state.go($state.current.name, {}, { reload: true });
                })
                .catch(function (error) { });

        };

        $scope.FuncToBack = function () {
            $scope.UpdateItem = false;
            $scope.createItem = true;
            vm.studentSetup = {};
            vm.gender = undefined;
            vm.GenderID = undefined;
            vm.ImageUrl = undefined;
        };
    }
})();
