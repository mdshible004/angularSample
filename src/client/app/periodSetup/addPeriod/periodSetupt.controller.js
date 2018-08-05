
(function () {
    'use strict';

    angular
        .module('app.periodSetup')
        .controller('periodSetupController', periodSetupController);

    periodSetupController.$inject = ['periodSetup', 'classSettingsService', 'subjectSettingsSevice', 'commonService', 'conversion', 'teacherAttendanceSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function periodSetupController(periodSetup, classSettingsService, subjectSettingsSevice, commonService, conversion, teacherAttendanceSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

        var vm = this;
        $scope.disButton = true;
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
            //vm.shift.selected = null;
            //vm.medium.selected = null;
            //vm.department.selected = null;
            //vm.class.selected = null;
            //vm.section.selected = null;
            $state.go($state.current.name, {}, { reload: true });
            //$scope.showItem = false;
        };

        //CurrentDate Logic
        function timeConversion(a) {
            var h = a;
            var hour = a.getHours() + 6;
            var min = a.getMinutes();
            if (hour < 10) {
                hour = '0' + hour;
            }
            if (min < 10) {
                min = '0' + min;
            }
            var Year = '1990';
            var Month = '01';
            var Day = '01';
            var currentTime = new Date(Year, Month, Day, hour, min, 0);
            return currentTime;
        }

        //$scope.StartTimeValidate = function (start, end) {
        //    vm.clsPeriod = [];
        //    //$scope.showGrid = false;
        //    //var startTime = conversion.getStringToDate(start);
        //    //var endTime = conversion.getStringToDate(end);
        //    if (end < start) {
        //        logger.error('Start time can not be greater than End time!!!!');
        //        //model.EndTime = CurrentDate;
        //    }
        //};

        $scope.TimeValidate = function (start, end) {
            vm.clsPeriod = [];

            if (start > end) {
                logger.error('Start time can not be greater than End time!!!!');
                //end.EndTime = conversion.getDateTimeToTimeSpan('1900-01-01T0:0:00.000Z');
                //start.StartTime = conversion.getDateTimeToTimeSpan('1900-01-01T0:0:00.000Z');;
                $scope.disButton = true;
            }
            else {
                $scope.disButton = false;
            }

        };





        vm.savePeriod = function () {
            var periodsArr = [];
            if ($scope.clsPeriod !== undefined) {
                for (var i = 0; i < $scope.clsPeriod.length; i++) {
                    if ($scope.clsPeriod[i].IsActive === 0 && $scope.clsPeriod[i].ClsPeriodID === null) {
                        console.log('Shibli');
                    } else {
                        $scope.clsPeriod[i].StartTime = timeConversion($scope.clsPeriod[i].StartTime);
                        $scope.clsPeriod[i].EndTime = timeConversion($scope.clsPeriod[i].EndTime);
                        periodsArr.push($scope.clsPeriod[i]);
                    }
                }
                periodSetup.postClsPeriod({
                    ClsPeriodID: null,
                    MediumID: vm.MediumID,
                    ClassID: vm.ClassID,
                    DepartmentID: vm.DepartmentID === undefined ? null : vm.DepartmentID,
                    SectionID: vm.SectionID === undefined ? null : vm.SectionID,
                    ShiftID: vm.ShiftID === undefined ? null : vm.ShiftID,

                    InstituteID: vm.institute.selected.InstituteID,
                    LoggedUserID: $localStorage.userInfo[0].UserID,
                    periodsArr: periodsArr
                })
                    .then(function (data) {
                        logger.info('Saved!');
                        $state.go($state.current.name, {}, { reload: true });
                    })
                    .catch(function (error) { });
            } else {
                logger.info('Please Select Your Institute and period');
            }

        };

        vm.showPeriod = function () {
            if (vm.institute.selected === undefined || vm.medium === undefined || vm.class === undefined) {
                $scope.createItem = true;
                $scope.showItem = false;

                logger.error('Please Select an Institute, Medium and Class');

            } else {
                $scope.showItem = true;
                var params = {
                    MediumID: (vm.MediumID === undefined) ? null : vm.MediumID,
                    ClassID: (vm.ClassID === undefined) ? null : vm.ClassID,
                    DepartmentID: (vm.DepartmentID === undefined) ? null : vm.DepartmentID,
                    ShiftID: (vm.ShiftID === undefined) ? null : vm.ShiftID,
                    InstituteID: vm.institute.selected.InstituteID, //$localStorage.userInfo[0].InstituteID,
                    SectionID: (vm.SectionID === undefined) ? null : vm.SectionID
                };
                return periodSetup.getperiodByParm(params)
                    .then(function (data) {

                        $scope.clsPeriod = data;
                        $scope.disButton = false;

                        for (var i = 0; i < data.length; i++) {
                            if (data[i].StartTime === undefined || data[i].StartTime === '' || data[i].StartTime === null || data[i].IsActive === 0) {
                                data[i].StartTime = conversion.getDateTimeToTimeSpan('1900-01-01T0:0:00.000Z');
                            }
                            else {
                                //data[i].StartTime = addTimes(data[i].StartTime);
                                data[i].StartTime = conversion.getDateTimeToTimeSpan(data[i].StartTime);

                            }
                            if (data[i].EndTime === undefined || data[i].EndTime === '' || data[i].EndTime === null || data[i].IsActive === 0) {
                                data[i].EndTime = conversion.getDateTimeToTimeSpan('1900-01-01T0:0:00.000Z');
                            }
                            else {
                                //data[i].EndTime = addTimes(data[i].EndTime);
                                data[i].EndTime = conversion.getDateTimeToTimeSpan(data[i].EndTime);

                            }
                        }

                    });
            }
        };

        $scope.openPeriodIndex = function (index) {
            $scope.periodindex = index;
            $scope.clsPeriod[$scope.periodindex].Pid = $scope.periodindex;
        };

        $scope.switch = function (e) {
            if (e === 1) {
                $scope.clsPeriod[$scope.periodindex].IsActive = 0;
            } else {
                $scope.clsPeriod[$scope.periodindex].IsActive = 1;
            }

        };

        $scope.hideList = function () {
            $scope.showItem = false;
            $scope.disButton = true;
        };

        //----------------------------------//

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
        };




        $scope.ReloadClass = function (status) {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            //if (status === 0) {
            //    vm.ClassID = null;
            //}
            //vm.class = undefined;
        };

        $scope.ReloadDept = function (status) {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            if (status === 0) {
                vm.DepartmentID = null;
            }
            vm.department = undefined;

        };

        activate();

        function activate() {
            var promises = [getInstitute('')

            ];
            return $q.all(promises).then(function () {
            });
        }







        $scope.ReloadSec = function () {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];

            //vm.department = undefined;
            //vm.departments = [];
        };

        vm.ClassSelected = function (ID, Status) {
            if (status === '') {
                vm.SectionID = null;
                vm.section = undefined;
                vm.sections = [];
                $scope.ReloadSec();

            }

            var params = {
                instituteId: vm.institute.selected.InstituteID,    //$localStorage.userInfo[0].InstituteID,
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
                    //vm.getCmnBranchDdl(vm.instituteID, status);
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




        function addTimes(InputDate) {
            //debugger
            var DateToString = InputDate;
            var SplitedDate = DateToString.split('T');
            var Splitedtime = SplitedDate[1].split('.');
            var OutputTime = Splitedtime[0];

            return OutputTime;
        }


    }
})();

