
(function () {
    'use strict';

    angular
        .module('app.manualStudentAttendance')
        .controller('ManualStudentAttendanceController', ManualStudentAttendanceController);

    ManualStudentAttendanceController.$inject = ['commonService', 'subjectSettingsSevice', 'studentAttendanceSevice', 'conversion', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', '$filter'];
    /* @ngInject */
    function ManualStudentAttendanceController(commonService, subjectSettingsSevice, studentAttendanceSevice, conversion, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, $filter) {



        var vm = this;

        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration



        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;
        vm.dateSetup = {};
        vm.dateSetup.dateName = conversion.NowDateCustom();
        $scope.BtnShow = false;


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

        //vm.ClassSelected = function (classId) {
        //    vm.section = undefined;
        //    vm.sections = [];
        //    var params = {
        //        instituteId: $localStorage.userInfo[0].InstituteID,
        //        classId: classId
        //    };

        //    commonService.getInstituteSection(params)
        //        .then(function (data) {
        //            vm.sections = data;
        //        });

        //};
        $scope.intime = [];
        $scope.openPresentIndex = function (index) {
            $scope.presentIndex = index;

        };
        $scope.changeGrid = function () {
            $scope.gridOptions.data = [];
            $scope.btnHide = true;
            $scope.showItem = false;
        };


        $scope.switch = function (e) {
            if (e === 1) {
                vm.attendances[$scope.presentIndex].Present = 0;
            } else {
                vm.attendances[$scope.presentIndex].Present = 1;
            }
        };

        $scope.openTextIndex = function (index) {
            $scope.val = index;
        };

        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        $scope.allSelectCheckBox = function (IsCheck) {
            //debugger;
            if (IsCheck === true) {
                for (var i = 0; i < $scope.gridOptions.data.length; i++) {
                    $scope.gridOptions.data[i].Present = true;
                }
            }
            else {
                for (var j = 0; j < $scope.gridOptions.data.length; j++) {
                    $scope.gridOptions.data[j].Present = 0;
                }
            }
        };

        $scope.btnDis = false;
        $scope.btnHide = true;
        vm.postManualStudentAttendance = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            if (vm.dateSetup === undefined || vm.ClassID === undefined) {
                logger.error('Please Select date and class.');
            } else {

                // $scope.btnDis = true;
                //$scope.btnHide = true;
                studentAttendanceSevice.setManualStudentAttendance({
                    AttendanceID: null,
                    UserID: 111,
                    BadgeNumber: null,
                    Name: null,
                    Date: vm.dateSetup.dateName === '' || vm.dateSetup.dateName === undefined ? null : conversion.getStringToDate(vm.dateSetup.dateName),
                    Times: null,
                    Present: null,
                    InstituteID: $localStorage.userInfo[0].InstituteID,
                    CreateBy: 0,
                    CreateOn: '10-10-2017',
                    CreatePc: 'Bond',
                    UpdateBy: 0,
                    UpdateOn: '10-10-2017',
                    UpdatePc: 'Bond',
                    IsDeleted: 0,
                    DeleteBy: 0,
                    DeleteOn: '10-10-2017',
                    DeletePc: 'Bond',
                    AttendanceArr: $scope.gridOptions.data,
                    MatchPresentArr: vm.matchPresent,
                    MatchTimeArr: vm.matchTime

                })
                    .then(function (data) {
                        logger.info('Saved Successfully');
                        //$scope.btnSaveDisable=true;
                        $state.go($state.current.name, {}, { reload: true });


                    })
                    .catch(function (error) {
                        logger.error('No changed found!!');
                    });
            }

        };
        $scope.created_time = [];
        //vm.itemEvent = function () {
        //    debugger

        //    if (vm.dateSetup === undefined || vm.ClassID === undefined) {
        //        logger.error('Please Select Class and Date');
        //    }
        //    else {
        //        $scope.showItem = true;
        //        $scope.btnHide = false;
        //        var hrmDeviceParams = {
        //            ShiftID: (vm.ShiftID !== undefined || vm.ShiftID !== null) ? vm.ShiftID : 0,
        //            MediumID: (vm.MediumID !== undefined || vm.MediumID !== null) ? vm.MediumID : 0,
        //            ClassID: (vm.ClassID !== undefined || vm.ClassID !== null) ? vm.ClassID : 0,
        //            SectionID: (vm.SectionID !== undefined || vm.SectionID !== null) ? vm.SectionID : 0,
        //            DepartmentID: (vm.DepartmentID === undefined || vm.DepartmentID === null) ? 0:vm.DepartmentID ,
        //            IsPresent: 0,
        //            IsAbsent: 0,
        //            Date: vm.dateSetup.dateName === '' || vm.dateSetup.dateName === undefined ? null : conversion.getStringToDate(vm.dateSetup.dateName),
        //            InstituteID: $localStorage.userInfo[0].InstituteID,
        //            UserTypeID: 3

        //        };
        //        return studentAttendanceSevice.getHrmDeviceByParmsforManualStudentAtd(hrmDeviceParams)
        //            .then(function (data) {
        //                vm.attendances = data;
        //                vm.matchPresent = [];
        //                vm.matchTime = [];

        //                for (var i = 0; i < data.length; i++) {
        //                    vm.matchPresent[i] = data[i].Present;

        //                    var ab = data[i].Intime;
        //                    if (ab === null) {
        //                        ab = '2018-02-01T09:00:00.000Z';
        //                    }
        //                    else {
        //                        ab = ab;
        //                    }
        //                    vm.matchTime[i] = ab;
        //                    vm.attendances[i].Intime = getTimeToTimeSpan(ab);
        //                }

        //            });
        //    }
        //};


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
            //$scope.pagination.pageNumber = 2;
            //$scope.pagination.firstPage();
        };
        //***************End ServerSide Search********************************************

        //var objcmnParam = {};
        $scope.gridOptions = [];
        $scope.getAllStudentMAList = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line




            $scope.gridOptions.enableFiltering = true;
            //$scope.gridOptions.showColumnFooter = true;
            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();            
            //objcmnParam.pageNumber = ($scope.pagination.pageNumber - 1) * $scope.pagination.pageSize;
            //objcmnParam.pageSize = $scope.pagination.pageSize;
            //objcmnParam.IsPaging = isPaging;
            //objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID;
            //objcmnParam.LoggedUserID = $localStorage.userInfo[0].UserID;
            //objcmnParam.typeID = 4;
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
                //showGridFooter: true,
                //showColumnFooter: true,
                enableGridMenu: true,
                enableCellEditOnFocus: true,
                columnDefs: [
                    {
                        name: 'SL', displayName: 'SL', headerCellClass: 'text-center', cellTemplate: '<span>{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</span>', width: '5%', enableCellEdit: false, enableFiltering: false
                        //cellClass: function (grid, row) { $scope.gridApi = grid.renderContainers.body.visibleRowCache; return 'text-center'; }, width: '4%', enableCellEdit: false, enableFiltering: false,
                        //aggregationType: uiGridConstants.aggregationTypes.count,
                        //footerCellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">{{col.getAggregationValue()}}</div>',
                        //aggregationHideLabel: true,
                        //filters: [{ condition: function (term, value, row, column) { if ('undefined' === typeof (term) || null === term) return true; try { if (term.charAt(0) === '>') { var val = term.slice(1); return parseFloat(value) > parseFloat(val); } else if (term.charAt(0) === '<') { var val = term.slice(1); return parseFloat(value) < parseFloat(val); } else { return parseFloat(value) === parseFloat(term); } } catch (ex) { console.warn(ex); } } }]
                    },
                    { name: 'Date', displayName: 'Date', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader, width: '10%' },
                    { name: 'ShiftName', displayName: 'Shift', headerCellClass: $scope.highlightFilteredHeader, width: '6%' },
                    { name: 'Medium', displayName: 'Medium', headerCellClass: $scope.highlightFilteredHeader, width: '6%' },
                    { name: 'Class', displayName: 'Class', headerCellClass: $scope.highlightFilteredHeader, width: '10%' },
                    { name: 'Section', displayName: 'Section', headerCellClass: $scope.highlightFilteredHeader, width: '6%' },
                    { name: 'Name', displayName: 'Name', headerCellClass: $scope.highlightFilteredHeader, width: '20%' },
                    { name: 'RFID', displayName: 'Student ID', headerCellClass: $scope.highlightFilteredHeader, width: '7%' },
                    { name: 'RollNo', displayName: 'Roll', headerCellClass: $scope.highlightFilteredHeader, width: '6%' },
                    {
                        name: 'Present', displayName: 'Is Present', cellClass: 'text-center', type: 'boolean', headerCellClass: $scope.highlightFilteredHeader,
                        cellTemplate: '<input type="checkbox" style="height:20px; width:20px" ng-model="row.entity.Present"/>', width: '9%', enableCellEdit: false//, enableFiltering: false //ng-click="grid.appScope.switch(row.entity)"
                    },
                    //{
                    //    name: 'Present', displayName: 'Is Present', cellClass: 'text-center', type: 'boolean', headerCellClass: $scope.highlightFilteredHeader,
                    //    cellTemplate: '<input type="checkbox" ng-model="row.entity.Present"/>', width: '9%', enableCellEdit: false//, enableFiltering: false //ng-click="grid.appScope.switch(row.entity)"
                    //},
                    {
                        name: 'Intime', displayName: 'In Time', cellClass: 'text-center', headerCellClass: $scope.highlightFilteredHeader, width: '15%',
                        cellTemplate: '<input type="time" ng-model="row.entity.Intime"/>'
                    }//,
                    //{
                    //    name: 'Option',
                    //    displayName: 'Option',
                    //    width: '13%',
                    //    pinnedRight: true,
                    //    enableColumnResizing: false,
                    //    enableFiltering: false,
                    //    enableSorting: false,
                    //    headerCellClass: $scope.highlightFilteredHeader,
                    //    visible: true,
                    //    cellTemplate: '<button class="label label-success label-mini" style="background-color:#0aa699">' +
                    //    '<a href="javascript:void(0);" data-toggle="modal" style="background-color:#0aa699" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editModels(row.entity)">' +
                    //    '<i class="fa fa-edit" aria-hidden="true">&nbsp;Edit</i></a></button>' +

                    //    '<button class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                    //    '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteModels(row.entity)">' +
                    //    '<i class="fa fa-trash" aria-hidden="true">&nbsp;Delete</i></a></button>'
                    //}
                ],
                //enableGridMenu: true,
                //enableSelectAll: true,
                exporterCsvFilename: 'StMA.csv',
                exporterPdfDefaultStyle: { fontSize: 9 },
                exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
                exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
                exporterPdfHeader: { text: 'Student M. Att. List', style: 'headerStyle' },
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
                exporterExcelFilename: 'StMA.xlsx',
                exporterExcelSheetName: 'Sheet1'
            };
            $scope.gridOptions.data = [];
            if (vm.dateSetup === undefined || vm.ClassID === null || vm.ClassID === undefined || vm.MediumID === undefined) {
                logger.error('Please Select Medium, Class and Date');
            }
            else {
                var hrmDeviceParams = {
                    ShiftID: (vm.ShiftID === undefined || vm.ShiftID === null) ? 0 : vm.ShiftID,
                    MediumID: (vm.MediumID !== undefined || vm.MediumID !== null) ? vm.MediumID : 0,
                    ClassID: vm.ClassID,
                    SectionID: vm.SectionID === undefined || vm.SectionID === null ? null : vm.SectionID,
                    DepartmentID: (vm.DepartmentID === undefined || vm.DepartmentID === null) ? 0 : vm.DepartmentID,
                    IsPresent: 0,
                    IsAbsent: 0,
                    Date: vm.dateSetup.dateName === '' || vm.dateSetup.dateName === undefined ? null : conversion.getStringToDate(vm.dateSetup.dateName),
                    InstituteID: $localStorage.userInfo[0].InstituteID,
                    UserTypeID: 3

                };
                return studentAttendanceSevice.getHrmDeviceByParmsforManualStudentAtd(hrmDeviceParams)
                    .then(function (data) {
                        if (data.length > 0) {
                            $scope.showItem = true;
                            $scope.btnHide = false;
                            $scope.gridOptions.data = data;

                            vm.matchPresent = [];
                            vm.matchTime = [];

                            for (var i = 0; i < $scope.gridOptions.data.length; i++) {
                                vm.matchPresent[i] = $scope.gridOptions.data[i].Present;
                                //vm.matchTime[i] = $scope.gridOptions.data[i].Intime;
                                var ab = $scope.gridOptions.data[i].Intime;
                                if (ab === null) {
                                    ab = '1900-01-01T09:00:00.000Z';
                                }
                                else {
                                    ab = ab;
                                }
                                vm.matchTime[i] = ab;
                                $scope.gridOptions.data[i].Intime = getTimeToTimeSpan(ab);
                                $scope.gridOptions.data[i].Present = $scope.gridOptions.data[i].Present === 1 ? true : 0;
                                vm.matchPresent[i] = vm.matchPresent[i] === 1 ? true : 0;
                                $scope.gridOptions.data[i].Date = vm.dateSetup.dateName;
                            }
                            //debugger;
                            var presentmodel = $scope.gridOptions.data.filter(function (ob, i) { return (ob.Present === false || ob.Present === 0); })[0];
                            $scope.IsCheck = presentmodel === undefined ? true : false;
                        }
                        else {
                            logger.error('Your desired data not found');
                        }
                        $scope.loaderMore = false;
                    });
            }
        };
        //************************************************End Grid******************************************************





        //--------------------------------load for dropdown as medium first------------------------------
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
        $scope.ReloadSec = function () {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];

            //vm.department = undefined;
            //vm.departments = [];
        };


        activate();

        function activate() {
            var promises = [getmediumNameDdl(''), getAllShift('')];
            return $q.all(promises).then(function () {
            });
        }


        function getmediumNameDdl(status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            if (status === '') {
                $scope.ReloadMedium();
            }
            //debugger;
            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteMediumDdl(Params)
                .then(function (data) {
                    //debugger;
                    vm.mediums = data;
                    var defaultModel = vm.mediums.filter(function (ob, i) { return (ob.IsDefault === true); })[0];
                    if (defaultModel !== undefined) {
                        vm.MediumID = defaultModel.MediumID;
                        vm.medium = { selected: defaultModel };

                        vm.MediumWiseClassDDL(vm.MediumID, '');
                    }

                });

        }
        vm.ClassSelected = function (ID, Status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



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

        vm.ClassWiseDepartmentDDL = function (ClassID, status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            if (status === '') {
                $scope.ReloadDept();
                vm.SectionID = null;
            }

            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                ClassID: ClassID,
                MediumID: vm.MediumID
            };
            return subjectSettingsSevice.getClassWiseDepartmentDDL(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        vm.departments = data;
                        $scope.IsRequired = true;
                        //vm.ClassSelected();
                    }
                    else {
                        $scope.IsRequired = false;
                        vm.ClassSelected();
                    }
                });

        };
        vm.MediumWiseClassDDL = function (MediumID, status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            if (status === '') {
                $scope.ReloadClass();
            }

            if (vm.MediumID !== null) {
                var Params = {
                    InstituteID: $localStorage.userInfo[0].InstituteID,
                    MediumID: MediumID
                };
                return subjectSettingsSevice.getMediumWiseClassDDL(Params)
                    .then(function (data) {
                        vm.classes = data;



                    });
            }
            else {
                logger.error('Select Medium first');
            }
        };

        function getAllShift(status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteShift(Params)
                .then(function (data) {
                    vm.shifts = data;

                    vm.shift = { selected: vm.shifts[0] };
                    vm.ShiftID = vm.shift.selected.ShiftID;
                });
        }
        //--------------------------------load for dropdown as medium first------------------------------


        //function getAllShift() {
        //    var Params = {
        //        instituteId: $localStorage.userInfo[0].InstituteID
        //    };
        //    return commonService.getInstituteShift(Params)
        //        .then(function (data) {
        //            vm.shifts = data;
        //        });
        //}

        //function getAllMedium() {
        //    var Params = {
        //        instituteId: $localStorage.userInfo[0].InstituteID
        //    };
        //    return commonService.getInstituteMediumDdl(Params)
        //        .then(function (data) {
        //            vm.mediums = data;
        //        });
        //}

        //function getAllClass() {
        //    var Params = {
        //        instituteId: $localStorage.userInfo[0].InstituteID
        //    };
        //    return commonService.getInstituteClass(Params)

        //        .then(function (data) {
        //            vm.classes = data;
        //        });
        //}

        //==============================For Date Formating Start===================//

        function getTimeSpanToTime(InputDatetime) {

            var DateToString = InputDatetime.toString();
            var SplitedTime = DateToString.split(' ');

            var OutputTime = '1900-01-01 ' + SplitedTime[4];

            return OutputTime;
        }

        function getTimeToTimeSpan(InputTime) {

            var Year = '1900';
            var Month = '00';
            var Day = '01';
            var Times = InputTime.split('T');
            var Hour = Times[0];
            var Minute = Times[1];
            var t = Times[1].split('.');
            var tm = t[0].split(':');
            var tDay = tm[0];
            var tHour = tm[0];
            var tMinute = tm[1];

            var OutputTime = new Date(Year, Month, Day, tHour, tMinute, 0);

            return OutputTime;
        }
        //==============================For Date Formating END===================//

    }
})();

