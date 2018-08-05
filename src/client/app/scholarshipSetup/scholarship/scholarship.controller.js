

//**********************************************Node Frameworks************************************************************************************* */
(function () {
    'use strict';

    angular
        .module('app.scholarshipSetup')
        .controller('scholarshipController', scholarshipController);

    //scholarshipController.$inject = ['subjectSettingsSevice', 'monthlyFeeService', 'ScholarService', 'FeeSetupService', 'studentAtdReportSettingsService', 'commonService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$localStorage', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants'];
    //function scholarshipController(subjectSettingsSevice, monthlyFeeService, ScholarService, FeeSetupService, studentAtdReportSettingsService, commonService, filterurl, $q, authservice, logger, $scope, $localStorage, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants) {



    scholarshipController.$inject = ['subjectSettingsSevice', 'classSettingsService', 'ScholarService', 'commonService', 'userService', 'instituteSettings', 'teacherAttendanceSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', 'pagerService', 'uploadService', '$window', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function scholarshipController(subjectSettingsSevice, classSettingsService, ScholarService, commonService, userService, instituteSettings, teacherAttendanceSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, pagerService, uploadService, $window, $localStorage, apiConfig) {




        activate();

        function activate() {
            var promises = [getCmnSessionDdl(), getAllBoard(), getAllStudent(), getAllGender(), getAllReligion(), loadMediumBrunchShift()];
            return $q.all(promises).then(function () {
            });
        }


        //************************************************************ Declaration + Initialization ************************************************************************************* */

        var vm = this;
        var updateUserID = 0;
        var updateScholarshipID = 0;
        vm.IsActive = false;
        $scope.value = null;
        $scope.valueIndex = null;
        $scope.percentTotal = null;
        $scope.percentTution = null;

        var isTution = false, isTotal = false, isPercent = false;
        var ShiftID = 0, DepartmentID = 0,
            MediumID = 0, SectionID = 0,
            ClassID = 0, FeesTypeID = 0;
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.studentProfile = false;
        vm.IsActive = true;




        vm.imgHost = apiConfig.imagehost;
        $scope.showItem = false;
        $scope.createItem = true;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        $scope.Form = true;


        var /*ClassID = 0, SectionID = 0, ShiftID = 0, DepartmentID = 0,MediumID = 0,*/
            SessionID = 0, BoardID = 0, BrunchID = 0;


        $scope.studentInfo = null; // store data 
        vm.studentData = null;
        var rowCount = null;
        $scope.EducationData = [];


        var InstituteName = null;
        var InstituteID = null;
        var Class = null;
        var Section = null;





        //**********************************************************Load Section************************************************************************************* */



        $scope.createEvent = function () {
            clear();
        };



        $scope.editModels = function (model) {
            //debugger;
            //for section
            //classLoad(model.ClassID);
            $scope.createItem = true;
            $scope.showItem = false;
            vm.onTution = null;
            vm.onTotal = null;

            vm.tutionChkBox = false;
            vm.tolalChkBox = false;

            vm.checkedTution = false;
            vm.checkedTotal = false;

            //for section            
            objcmnParam.pageNumber = 0;
            objcmnParam.pageSize = 0;
            objcmnParam.IsPaging = 0;
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID;
            objcmnParam.LoggedUserID = parseInt($localStorage.userInfo[0].UserID);
            objcmnParam.SearchProperty = '';
            objcmnParam.ShiftID = 0;
            objcmnParam.DepartmentID = 0;
            objcmnParam.MediumID = 0;
            objcmnParam.ClassID = 0;
            objcmnParam.StudentID = parseInt(model.StudentID);

            return ScholarService.getScholarship(objcmnParam)
                .then(function (data) {

                    updateUserID = data[0].StudentID;
                    vm.ID = data[0].StudentID;
                    updateScholarshipID = data[0].ScholarshipID;
                    vm.uID = data[0].ScholarshipID;
                    vm.studentName = data[0].UserFullName;
                    vm.IsActive = data[0].IsActive;
                    vm.MediumID = data[0].MediumID;
                    vm.ShiftID = data[0].ShiftID;
                    vm.ClassID = data[0].ClassID;
                    vm.SectionID = data[0].SectionID;
                    vm.DepartmentID = data[0].DepartmentID;
                    vm.getMediumWiseClass(vm.MediumID, 'Edit');
                    vm.DepartmentSelected(vm.DepartmentID, 'Edit');
                    vm.ClassSelected(vm.ClassID, 'Edit', 'Edit');
                    vm.sft = {
                        selected: vm.Shift.filter(function (ob, i) {
                            return (ob.ShiftID === data[0].ShiftID);
                        })[0]
                    };


                    //vm.cls = {
                    //    selected: vm.class.filter(function (ob, i) {
                    //        return (ob.ClassID === data[0].ClassID);
                    //    })[0]
                    //};
                    vm.med = {
                        selected: vm.medium.filter(function (ob, i) {
                            return (ob.MediumID === data[0].MediumID);
                        })[0]
                    };


                    //if (vm.sec !== undefined) {
                    //    vm.sec = {

                    //        selected: vm.section.filter(function (ob, i) {
                    //            return (ob.SectionID === data[0].SectionID);
                    //        })[0]
                    //    };

                    //}

                    if (data[0].IsOnTotal === false) {
                        vm.onTution = data[0].Amount;
                    }
                    if (data[0].IsOnTotal === false) {
                        vm.onTution = data[0].Amount;
                        vm.tutionChkBox = data[0].IsOnTution;
                        vm.checkedTution = data[0].IsParcent;
                        document.getElementById('txtOnTotal').readOnly = true;
                        document.getElementById('txtOnTution').readOnly = false;
                    } else {

                        vm.onTotal = data[0].Amount;
                        vm.tolalChkBox = data[0].IsOnTotal;
                        vm.checkedTotal = data[0].IsParcent;
                        document.getElementById('txtOnTotal').readOnly = false;
                        document.getElementById('txtOnTution').readOnly = true;
                    }
                });
        };

        //zahid_list_button click 
        vm.getHrmSubWiseAtdDetails = function () {
            //checkingDropdown();

            if (ClassID === null) {
                logger.error('Please select a Class');
                return;
            } else {
                $('#myModal').modal('show'); //jshint ignore : line

                var Params = {
                    instituteID: $localStorage.userInfo[0].InstituteID,
                    mediumID: vm.MediumID === undefined || vm.MediumID === null ? 0 : vm.MediumID,
                    shiftID: vm.ShiftID === undefined || vm.ShiftID === null ? 0 : vm.ShiftID,
                    classID: vm.ClassID === undefined || vm.ClassID === null ? 0 : vm.ClassID,
                    sectionID: vm.SectionID === undefined || vm.SectionID === null ? 0 : vm.SectionID,
                    depertmentID: vm.DepartmentID === undefined || vm.DepartmentID === null ? 0 : vm.DepartmentID
                };
                ScholarService.getAllStudentsForScholarship(Params)
                    .then(function (data) {
                        vm.monAtd = data;
                        //updateUserID = data[0].StudentID;
                    });
            }
        };
        //zahid_list button click


        vm.getMediumWiseClass = function (medId, status) {
            //debugger;
            if (status === '') {
                $scope.changeMed();
            }
            var params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                MediumID: medId
            };
            subjectSettingsSevice.getMediumWiseClassDDL(params)
                .then(function (data) {
                    vm.class = data;
                    if (status === 'Edit') {
                        vm.cls = {
                            selected: vm.class.filter(function (ob, i) {
                                return (ob.ClassID === vm.ClassID);
                            })[0]
                        };
                    }
                });
        };





        //**********************************************************HTML Show/Hide ************************************************************************************* */

        $scope.itemEvent = function () {
            $scope.createItem = false;
            //$scope.showItem=
            $scope.RefreshList();
            checkingDropdown();
            $scope.showItem = true;
            loadScholarship(0);
        };



        // for check box
        $scope.checkBoxIndex = function (index) {
            $scope.valueIndex = index;
            $scope.value[$scope.valueIndex].id = $scope.valueIndex;
        };

        vm.getMonthlyAtd = function (index) {

            vm.monthlyAtd = vm.monAtd[index];
            vm.studentName = vm.monthlyAtd.UserName;
            updateUserID = vm.monthlyAtd.UserID;
            $scope.studentProfile = false;
        };

        //check box click event      
        $scope.clickEventTotal = function (check, textBoxID, index) {
            if (check === true) {

                vm.onTution = null;
                vm.tutionChkBox = false;
                vm.checkedTution = false;
                document.getElementById('txtOnTotal').value = 0;
                document.getElementById('txtOnTotal').readOnly = false;

                document.getElementById('txtOnTution').value = 0;
                document.getElementById('txtOnTution').readOnly = true;
            }
            else {

                vm.onTotal = null;
                vm.tutionChkBox = true;
                vm.checkedTotal = false;
                document.getElementById('txtOnTotal').value = 0;
                document.getElementById('txtOnTotal').readOnly = true;

                document.getElementById('txtOnTution').value = 0;
                document.getElementById('txtOnTution').readOnly = false;
            }
        };

        $scope.clickEventTution = function (check, textBoxID, index) {
            if (check === true) {

                vm.onTotal = null;
                vm.tolalChkBox = false;
                vm.checkedTotal = false;
                document.getElementById('txtOnTotal').value = 0;
                document.getElementById('txtOnTotal').readOnly = true;

                document.getElementById('txtOnTution').value = 0;
                document.getElementById('txtOnTution').readOnly = false;
            }
            else {

                vm.onTution = null;
                vm.tolalChkBox = true;
                vm.checkedTution = false;
                document.getElementById('txtOnTotal').value = 0;
                document.getElementById('txtOnTotal').readOnly = false;

                document.getElementById('txtOnTution').value = 0;
                document.getElementById('txtOnTution').readOnly = true;
            }
        };


        $scope.updateClickEventTution = function (check, textBoxID, index) {
            if (check === true) {

                vm.onTotal = null;
                vm.EtolalChkBox = false;
                vm.EcheckedTotal = false;

                document.getElementById('EtxtOnTotal').value = 0;
                document.getElementById('EtxtOnTotal').readOnly = true;

                document.getElementById('EtxtOnTution').value = 0;
                document.getElementById('EtxtOnTution').readOnly = false;

                vm.EonTotal = null;
                vm.EonTution = null;
                isPercent = false;


            }
            else {

                vm.onTution = null;
                vm.EtolalChkBox = true;

                document.getElementById('EtxtOnTotal').value = 0;
                document.getElementById('EtxtOnTotal').readOnly = false;

                document.getElementById('EtxtOnTution').value = 0;
                document.getElementById('EtxtOnTution').readOnly = true;

                vm.EonTotal = null;
                vm.EonTution = null;
                isPercent = false;
            }
        };

        $scope.updateClickEventTotal = function (check, textBoxID, index) {
            if (check === true) {

                vm.onTution = null;
                vm.EtutionChkBox = false;
                vm.EcheckedTution = false;
                document.getElementById('EtxtOnTotal').value = 0;
                document.getElementById('EtxtOnTotal').readOnly = false;

                document.getElementById('EtxtOnTution').value = 0;
                document.getElementById('EtxtOnTution').readOnly = true;

                vm.EonTotal = null;
                vm.EonTution = null;
                isPercent = false;
            }
            else {

                vm.onTotal = 0;
                vm.EtutionChkBox = true;
                document.getElementById('EtxtOnTotal').value = 0;
                document.getElementById('EtxtOnTotal').readOnly = true;

                document.getElementById('EtxtOnTution').value = 0;
                document.getElementById('EtxtOnTution').readOnly = false;

                vm.EonTotal = null;
                vm.EonTution = null;
                isPercent = false;
            }
        };

        $scope.percentClickTotal = function (check) {
            if (check === true) {
                isPercent = true;
                $scope.percentTotal = true;
            }
            else {
                isPercent = false;
                $scope.percentTotal = false;
            }
        };

        $scope.percentClickTution = function (check) {
            isPercent = true;
            if (check === true) {
                $scope.percentTution = true;
            }
            else {
                isPercent = false;
                $scope.percentTution = false;
            }
        };

        $scope.isReadOnly = function (fee) {
            if (fee != null) {
                return false;
            }
            else {
                return true;
            }
        };

        function checkingDropdown() {
            if (vm.shift === undefined || vm.shift.selected === undefined) { ShiftID = null; } else { ShiftID = vm.shift.selected.ShiftID; }
            if (vm.dept === undefined || vm.dept.selected === undefined) { DepartmentID = null; } else { DepartmentID = vm.dept.selected.DepartmentID; }
            if (vm.sec === null || vm.sec === undefined || vm.sec.selected === undefined) { SectionID = null; } else { SectionID = vm.sec.selected.SectionID; }
            if (vm.med === undefined || vm.med.selected === undefined) { MediumID = null; } else { MediumID = vm.med.selected.MediumID; }
            if (vm.cls === undefined || vm.cls.selected === undefined) { ClassID = null; } else { ClassID = vm.cls.selected.ClassID; }
            if (vm.Fee === undefined || vm.Fee.selected === undefined) { FeesTypeID = null; } else { FeesTypeID = vm.Fee.selected.FeesTypeID; }
        }
        function checkingDropdownUpdate() {
            if (vm.sft.selected === undefined) { ShiftID = null; } else { ShiftID = vm.sft.selected.ShiftID; }
            if (vm.Edept.selected === undefined) { DepartmentID = null; } else { DepartmentID = vm.Edept.selected.DepartmentID; }
            if (vm.sec === undefined) { SectionID = null; } else { SectionID = vm.sec.selected.SectionID; }
            if (vm.Emed.selected === undefined) { MediumID = null; } else { MediumID = vm.Emed.selected.MediumID; }
            if (vm.Ecls.selected === undefined) { ClassID = null; } else { ClassID = vm.Ecls.selected.ClassID; }
            if (vm.Fee === undefined) { FeesTypeID = null; } else { FeesTypeID = vm.Fee.selected.FeesTypeID; }
        }

        //**********************************************************CRUD************************************************************************************* */

        // add+update+delete data  in grid 
        vm.addScholar = function () {

            if (vm.studentName === undefined || vm.studentName === null) {
                logger.error('Please Select a Student From List');
                return;
            } else {
                checkingDropdown();

                var amount;
                if (vm.onTution === null) {
                    amount = vm.onTotal;
                    isTution = false;
                    isTotal = true;
                }
                if (vm.onTotal === null) {
                    amount = vm.onTution;
                    isTotal = false;
                    isTution = true;
                }

                if (isPercent) {
                    if (amount > 100) {
                        logger.error('Percent Selected<br/> Amount cannot be greater than 100');
                    }
                    else {

                        if (amount <= 0 || amount === undefined || amount === null) {
                            logger.error('Enter a Valid Amount');
                            return;
                        }

                        addServiceCall(amount, isPercent, isTotal, isTution);
                    }
                }
                else {

                    if (amount <= 0 || amount === undefined || amount === null) {
                        logger.error('Enter a Valid Amount');
                        return;
                    }
                    addServiceCall(amount, isPercent, isTotal, isTution);

                }

            }
        };

        function addServiceCall(amount, isPercent, isTotal, isTution) {
            ScholarService.setScholarShip({
                ScholarshipID: vm.uID !== undefined ? vm.uID : 0,
                StudentID: parseInt(updateUserID),
                IsOnTution: isTution,
                IsOnTotal: isTotal,
                Amount: amount,
                IsParcent: isPercent,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                DepartmentID: (vm.DepartmentID === null || vm.DepartmentID === undefined) ? null : vm.DepartmentID,
                MediumID: MediumID,
                ShiftID: (vm.ShiftID === undefined) ? null : vm.ShiftID,
                ClassID: ClassID,
                IsActive: vm.IsActive,
                LoggedUserID: parseInt($localStorage.userInfo[0].UserID)
            })
                .then(function (data) {
                    if (data[0].ReturnValue === 'Duplicate') {
                        logger.error('This student already exists...');
                        //   loadGrid();
                        //clear();
                    }
                    else {
                        logger.info('Saved Successfully!');
                        $scope.studentProfile = false;
                        // loadGrid();
                        clear();
                    }
                })
                .catch(function (error) { });
        }





        vm.updateScholar = function () {
            checkingDropdownUpdate();
            var amount;
            if (vm.EonTution === null) {
                amount = vm.EonTotal;
                isTution = false;
                isTotal = true;
            }
            if (vm.EonTotal === null) {
                isTotal = false;
                isTution = true;
                amount = vm.EonTution;
            }

            if (isPercent) {
                if (amount > 100) {
                    logger.error('Percent Selected<br/> Amount cannot be greater than 100');
                }
                else {

                    if (amount <= 0 || amount === undefined || amount === null) {
                        logger.error('Enter a Valid Amount');
                        return;
                    }
                    updateServiceCall(amount, isPercent, isTotal, isTution);
                }
            }
            else {

                if (amount <= 0 || amount === undefined || amount === null) {
                    logger.error('Enter a Valid Amount');
                    return;
                }
                updateServiceCall(amount, isPercent, isTotal, isTution);
            }
        };


        function updateServiceCall(amount, isPercent, isTotal, isTution) {

            ScholarService.setScholarShip({

                ScholarshipID: vm.uID,
                StudentID: updateUserID,
                IsOnTution: isTution,
                IsOnTotal: isTotal,
                Amount: amount,
                IsParcent: isPercent,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                DepartmentID: DepartmentID,
                MediumID: MediumID,
                ShiftID: ShiftID,
                ClassID: ClassID,
                IsActive: vm.UIsActive,
                LoggedUserID: parseInt($localStorage.userInfo[0].UserID)
            })
                .then(function (data) {
                    if (data[0].ReturnValue === 'Duplicate') {
                        logger.error('This student already exists...');                        
                    }
                    else {
                        logger.info('Updated Successfully!');
                        clear();
                        //$scope.itemEvent();
                    }
                })
                .catch(function (error) { });
        }

        $scope.deleteModels = function (model) {
            var Params = {
                ScholarshipID: model.ScholarshipID
            };
            return ScholarService.deleteScholarship(Params)
                .then(function (data) {
                    // $scope.itemEvent();
                    loadScholarship(0);
                });
        };

        //**********************************************************Clear/Reset************************************************************************************* */

        vm.clearField = function () {
            clear();
            $scope.showItem = false;
        };
        // clearing data 
        function clear() {
            $state.go($state.current.name, {}, { reload: true });
        }


        //********************************************Start Server Side Search************************************
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
        //*********************************************End Server Side Search*************************************

        var objcmnParam = {}; //jshint ignore : line        
        $scope.gridOptionsShowList = [];
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
                loadScholarship(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    loadScholarship(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    loadScholarship(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    loadScholarship(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    loadScholarship(1);
                }
            }
        };
        function loadScholarship(isPaging) {
            $scope.gridOptionsShowList.enableFiltering = true;

            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();          
            objcmnParam.pageNumber = ($scope.pagination.pageNumber - 1) * $scope.pagination.pageSize;
            objcmnParam.pageSize = $scope.pagination.pageSize;
            objcmnParam.IsPaging = isPaging;
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID;
            objcmnParam.LoggedUserID = parseInt($localStorage.userInfo[0].UserID);
            objcmnParam.SearchProperty = $scope.IsCallFromSearch === true ? $scope.SearchProperty : '';
            objcmnParam.ShiftID = ShiftID;
            objcmnParam.DepartmentID = DepartmentID;
            objcmnParam.MediumID = MediumID;
            objcmnParam.ClassID = ClassID;
            objcmnParam.StudentID = 0;

            // checkingDropdown();
            var params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                ShiftID: ShiftID,
                DepartmentID: DepartmentID,
                MediumID: MediumID,
                ClassID: ClassID,
                StudentID: 0
            };


            $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
                if (col.filters[0].term) {
                    return 'header-filtered';
                } else {
                    return '';
                }
            };
            $scope.gridOptionsShowList = {
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
                    { name: 'StudentID', displayName: 'Student ID', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'RollNo', displayName: 'Roll No', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Board', displayName: 'Board', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Session', displayName: 'Session', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Brunch', displayName: 'Brunch', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Shift', displayName: 'Shift', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Medium', displayName: 'Medium', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Department', displayName: 'Department', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Class', displayName: 'Class', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Section', displayName: 'Section', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'IsOnTution', displayName: 'Scholarship On Tution', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'IsOnTotal', displayName: 'Scholarship On Total', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'IsParcent', displayName: 'Is Parcent', headerCellClass: $scope.highlightFilteredHeader },
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
                        '<a href="javascript:void(0);" data-toggle="modal" data-target="#EditScholarshipList" style="background-color:#0aa699;color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editModels(row.entity)">' +
                        '<i class="fa fa-edit" aria-hidden="true">&nbsp;Edit</i></a></button>' +

                        '<button class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                        '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteModels(row.entity)">' +
                        '<i class="fa fa-trash" aria-hidden="true">&nbsp;Delete</i></a></button>'
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
            //debugger;
            return ScholarService.getScholarship(objcmnParam)

                .then(function (data) {
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].IsOnTution === true) {
                                data[i].IsOnTution = data[i].Amount;
                                data[i].IsOnTotal = 0;
                            }
                            else {
                                data[i].IsOnTotal = data[i].Amount;
                                data[i].IsOnTution = 0;
                            }
                            if (data[i].IsParcent === true) {
                                data[i].IsParcent = 'Yes';
                            }
                            else {
                                data[i].IsParcent = 'No';
                            }
                        }

                        $scope.pagination.totalItems = data[0].RecordTotal;
                        $scope.gridOptionsShowList.data = data;
                    }
                    else {
                        logger.error('Your desired data not found');
                    }
                    $scope.loaderMore = false;
                });
        }
        $scope.RefreshList = function () {
            $scope.pagination.pageNumber = 1;
            loadScholarship(0);
        };
        //************************************************End Grid******************************************************













































        //function getAllInstitute() {
        //    return instituteSettings.getAllInsInstitute()
        //        .then(function (data) {
        //            vm.institutes = data;
        //            vm.instituteID = vm.InstituteID;
        //            vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.InstituteID); })[0] };
        //            vm.instituteSelected(vm.InstituteID);

        //        });
        //}
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

        function loadMediumBrunchShift() {
            var params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            commonService.getInstituteShift(params)
                .then(function (data) {
                    vm.Shift = data;
                });
            commonService.getInstituteMediumDdl(params)
                .then(function (data3) {
                    vm.medium = data3;
                });
            commonService.getInstituteBrunchDdl(params)
                .then(function (data4) {
                    vm.branches = data4;
                });

        }

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



        vm.ClassSelected = function (classId, status1, status2) {

            var params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                ClassID: classId,//vm.cls.selected.ClassID,
                MediumID: vm.MediumID
            };
            subjectSettingsSevice.getClassWiseDepartmentDDL(params)
                .then(function (data2) {
                    vm.departments = data2;

                    if (status1 === 'Edit') {
                        vm.department = {
                            selected: vm.departments.filter(function (ob, i) {
                                return (ob.DepartmentID === vm.DepartmentID);
                            })[0]
                        };
                    }


                    if (data2.length === 0) {
                        var params5 = {
                            instituteId: $localStorage.userInfo[0].InstituteID,
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

            var tempSection = [];

            if (depId !== undefined) {
                var params5 = {
                    insID: $localStorage.userInfo[0].InstituteID,
                    clID: vm.ClassID,
                    deptID: vm.DepartmentID === null || vm.DepartmentID === undefined ? 0 : vm.DepartmentID
                };

                classSettingsService.getSectionByID(params5)
                    .then(function (data) {

                        for (var i = 0; i < data.length; i++) {
                            if (data[i].IsActive === true) {
                                tempSection.push(data[i]);
                            }
                        }
                        vm.section = tempSection;


                        vm.sec = {
                            selected: vm.section.filter(function (ob, i) {
                                return (ob.SectionID === vm.SectionID);
                            })[0]
                        };



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
        var objcmnParam1 = {};
        $scope.gridOptions = [];
        $scope.pagination1 = {
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
                    this.pageSize = $scope.pagination1.totalItems;
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
            $scope.pagination1.pageNumber = $scope.pagination1.pageNumber === undefined ? 1 : $scope.pagination1.pageNumber;
            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();            
            objcmnParam1.pageNumber = ($scope.pagination1.pageNumber - 1) * $scope.pagination1.pageSize;
            objcmnParam1.pageSize = $scope.pagination1.pageSize;
            objcmnParam1.IsPaging = isPaging;
            objcmnParam1.InstituteID = $localStorage.userInfo[0].InstituteID;
            objcmnParam1.LoggedUserID = $localStorage.userInfo[0].UserID;
            objcmnParam1.UserID = 0;
            objcmnParam1.ClassID = (vm.ClassID === undefined) ? 0 : vm.ClassID;
            objcmnParam1.SectionID = (vm.SectionID === undefined) ? 0 : vm.SectionID;
            objcmnParam1.DepartmentID = (vm.DepartmentID === undefined) ? 0 : vm.DepartmentID;
            objcmnParam1.MediumID = vm.MediumID;
            objcmnParam1.ShiftID = (vm.ShiftID === undefined) ? 0 : vm.ShiftID;
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


            return commonService.getStudentBasicInfoList(objcmnParam1)
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
                        $scope.pagination1.totalItems = data[0].RecordTotal;
                        $scope.gridOptions.data = data;
                        $scope.loaderMore = false;
                        //SectionSelect(data[0].ClassID, 0, ''); //jshint ignore : line
                    }


                });
        };

        $scope.StudentList = function () {
            if (vm.MediumID === undefined || vm.MediumID === null) {
                logger.error('Please Select Medium');
                return;
            } else {

                $('#studentList').modal('show');//jshint ignore :line
                $scope.pagination1.pageNumber = 1;
                vm.getStudentDetailsInfo(0);
            }
        };




        //debugger;
        $scope.selectedEvent = function (model) {

            vm.studentName = model.UserName;
            updateUserID = model.UserID;


        };



        //************************************************End Grid******************************************************













    }
})();
