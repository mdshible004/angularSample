(function () {
    'use strict';

    angular
        .module('app.dailySubWiseAtdSettings')
        .controller('DailySubWiseAtdSettingsController', DailySubWiseAtdSettingsController);

    DailySubWiseAtdSettingsController.$inject = ['commonService','subjectSettingsSevice', 'conversion', 'dailySubWiseAtdSettingsService', 'shiftSettings', 'mediumsetting', 'classSettings', 'sectionSettingsSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function DailySubWiseAtdSettingsController(commonService, subjectSettingsSevice, conversion, dailySubWiseAtdSettingsService, shiftSettings, mediumsetting, classSettings, sectionSettingsSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

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
        vm.dateName = conversion.NowDateCustom();
        $scope.InstituteID = $localStorage.userInfo[0].InstituteID;
        $scope.UserFullName = $localStorage.userInfo[0].UserFullName;
        $scope.UserID = $localStorage.userInfo[0].UserID;
        var CurrentDate = conversion.NowDateCustom();
        var today = conversion.getStringToDate(CurrentDate);
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.showGrid = false;
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

            $scope.divHide=function(){
//debugger;
                vm.subwiseData=[];
                  $scope.showGrid=false;
                };

            $scope.changeGrid = function () {

                vm.subwiseData = [];
                $scope.showGrid = false;
            };
        //get ins subject by m id and c id
            vm.getInsSubjectShow = function () {


                //Generate Token API Pass Call
                authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            if (vm.ClassID === undefined || vm.ClassID === null) {
                logger.error('Please select Class.');
            } else {
                // $scope.index = index;
                var Params = {
                    //ShiftID: (vm.ShiftID === undefined || vm.ShiftID === null) ? 0 : vm.ShiftID,
                    //MediumID: (vm.MediumID !== undefined || vm.MediumID !== null) ? vm.MediumID : 0,
                    //ClassID: vm.ClassID,
                    //SectionID: (vm.SectionID !== undefined || vm.SectionID !== null) ? vm.SectionID : 0,
                    //DepartmentID: (vm.DepartmentID === undefined || vm.DepartmentID === null) ? 0 : vm.DepartmentID,
                    midID:(vm.MediumID !== undefined || vm.MediumID !== null) ? vm.MediumID : 0,
                    classID: vm.ClassID,
                    InsID: $localStorage.userInfo[0].InstituteID,
                    deptID:  (vm.DepartmentID === undefined || vm.DepartmentID === null) ? 0 : vm.DepartmentID
                };
                dailySubWiseAtdSettingsService.getInsSubjectByMidnCid(Params)

                    .then(function (data) {
                        vm.subwiseData = data;
                        $scope.showGrid = true;

                    });
            }
        };
        //$scope.index;
            vm.getHrmSubWiseAtdDetails = function (index) {

                //Generate Token API Pass Call
                authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            $scope.index = index;
            var Params = {
                insID: $scope.InstituteID,
                midID: (vm.MediumID !== undefined || vm.MediumID !== null) ? vm.MediumID : 0,
                shiftID: (vm.ShiftID === undefined || vm.ShiftID === null) ? 0 : vm.ShiftID,
                classID: vm.ClassID,
                sectionID: (vm.SectionID !== undefined || vm.SectionID !== null) ? vm.SectionID : 0,
                subjectID: vm.subwiseData[index].SubjectID,
                deptID: (vm.DepartmentID === undefined || vm.DepartmentID === null) ? 0 : vm.DepartmentID,
                AtdDate: vm.dateName === null || vm.dateName === '' || vm.dateName === undefined ? '' : conversion.getStringToDate(vm.dateName)
            };
            //console.log(Params);
            dailySubWiseAtdSettingsService.getHrmSubWiseAtdDetail(Params)

                .then(function (data) {

                    $scope.subwiseAtd = data;
                    angular.forEach($scope.subwiseAtd, function (sa) {
                        sa.isReadOnly = true;
                    });
                    if (data[0] === undefined) {
                        logger.error('No data found....!');
                    } else {
                        $scope.subjectID = data[0].SubjectID;
                        $scope.subject = data[0].Subject;
                        $scope.date = date(data[0].DisplayDate);

                        $scope.time = getTimeSpanToTime(data[0].DisplayDate);
                    }

                });
        };

        //$scope.presentIndex;
        $scope.pickAddress = function (index) {
            $scope.presentIndex = index;
            //Pushing to Guardian array --> id object for genarating dynamicaly checkbox level class and ID value   
            $scope.subwiseAtd[$scope.presentIndex].IsPresentID = $scope.presentIndex;

        };
        $scope.IsPresent = function () {
            $scope.subwiseAtd[$scope.presentIndex].IsPresent = 1;
            $scope.subwiseAtd[$scope.presentIndex].IsAbsent = 0;
            $scope.subwiseAtd[$scope.presentIndex].IsLeave = 0;
            $scope.subwiseAtd[$scope.presentIndex].Islate = 0;
            $scope.subwiseAtd[$scope.presentIndex].LateTime = 0;
            $scope.subwiseAtd[$scope.presentIndex].isReadOnly = true;
        };
        $scope.IsAbsent = function () {
            $scope.subwiseAtd[$scope.presentIndex].IsPresent = 0;
            $scope.subwiseAtd[$scope.presentIndex].IsAbsent = 1;
            $scope.subwiseAtd[$scope.presentIndex].IsLeave = 0;
            $scope.subwiseAtd[$scope.presentIndex].Islate = 0;
            $scope.subwiseAtd[$scope.presentIndex].LateTime = 0;
            $scope.subwiseAtd[$scope.presentIndex].isReadOnly = true;
        };
        $scope.IsLeave = function () {
            $scope.subwiseAtd[$scope.presentIndex].IsPresent = 0;
            $scope.subwiseAtd[$scope.presentIndex].IsAbsent = 0;
            $scope.subwiseAtd[$scope.presentIndex].IsLeave = 1;
            $scope.subwiseAtd[$scope.presentIndex].Islate = 0;
            $scope.subwiseAtd[$scope.presentIndex].LateTime = 0;
            $scope.subwiseAtd[$scope.presentIndex].isReadOnly = true;
        };
        $scope.Islate = function () {
            $scope.subwiseAtd[$scope.presentIndex].IsPresent = 0;
            $scope.subwiseAtd[$scope.presentIndex].IsAbsent = 0;
            $scope.subwiseAtd[$scope.presentIndex].IsLeave = 0;
            $scope.subwiseAtd[$scope.presentIndex].Islate = 1;
            $scope.subwiseAtd[$scope.presentIndex].isReadOnly = false;
        };
        //$scope.isReadOnly = true;
        $scope.DateValidation = function (model) {
            vm.subwiseData = [];
            $scope.showGrid = false;
            var AtdDates = conversion.getStringToDate(model.dateName);
            if (AtdDates > today) {
                logger.error('Date can not be greater than current date!!!!');
                model.dateName = CurrentDate;
            }
        };

        vm.saveAttendence = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            var attendenceArray = [].concat.apply([], $scope.subwiseAtd);
            dailySubWiseAtdSettingsService.postAttendence({
                SubAtdID: attendenceArray[0].SubAtdID === null ? 0 : parseInt(attendenceArray[0].SubAtdID),
                SubjectID: attendenceArray[0].SubjectID,
                SectionID: vm.SectionID === undefined ? null : vm.SectionID,
                DepartmentID: vm.DepartmentID === undefined ? null : vm.DepartmentID,
                MediumID: vm.MediumID === undefined ? null : vm.MediumID,
                ShiftID: vm.ShiftID === undefined ? null : vm.ShiftID,
                ClassID: vm.class.selected.ClassID,
                AtdUserID: parseInt($scope.UserID),
                AtdDate: vm.dateName === null || vm.dateName === '' || vm.dateName === undefined ? '' : conversion.getStringToDate(vm.dateName),
                InstituteID: $scope.InstituteID,
                LoggedUserID: parseInt($scope.UserID),
                attendenceArr: attendenceArray
            })
                .then(function (data) {
                    logger.info('Saved!');
                    // $state.go($state.current.name, {}, {reload: true});
                    //window.location.reload(true);
                })
                .catch(function (error) { });
        };




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
            if (status === '') {
                $scope.ReloadMedium();
            }
            //debugger;
            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteMediumDdl(Params)
                .then(function (data) {
                    vm.mediums = data;

                 
                });

        }

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

                });
        }
        //--------------------------------load for dropdown as medium first------------------------------


        function getTimeSpanToTime(InputDatetime) {
            //debugger
            var DateToString = InputDatetime.toString();
            var SplitedTime = DateToString.split('T');
            var Time = SplitedTime[1].split('.');
            var OutputTime = SplitedTime[1];
            var out = OutputTime.split('.');
            var outtime = out[0];

            return outtime;
        }

        function date(InputDatetime) {
            //debugger
            var DateToString = InputDatetime.toString();
            var SplitedTime = DateToString.split('T');
            var Time = SplitedTime[0];


            return Time;
        }


    }
})();
