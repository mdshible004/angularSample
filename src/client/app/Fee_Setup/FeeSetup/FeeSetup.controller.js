

//**********************************************Node Frameworks************************************************************************************* */

(function () {
    'use strict';

    angular
        .module('app.Fee_Setup')
        .controller('FeeSetupController', FeeSetupController);


    FeeSetupController.$inject = ['FeeSetupService', 'commonService', 'classSettingsService', 'subjectSettingsSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$localStorage', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants'];
    function FeeSetupController(FeeSetupService, commonService, classSettingsService, subjectSettingsSevice, filterurl, $q, authservice, logger, $scope, $localStorage, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants) {

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


        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        $scope.value = null; // store data 
        $scope.valueIndex = null;
        var ShiftID = 0, DepartmentID = 0,
            MediumID = 0, SectionID = 0,
            ClassID = 0, FeesTypeID = 0;
        $scope.showItem = false;
        $scope.createItem = true;

        $scope.ReloadDll = function () {
            //vm.instituteID = null;
            //vm.institute = undefined;
            //vm.institutes = [];
            vm.ShiftID = null;
            vm.shift = undefined;
            vm.Shift = [];
            vm.MediumID = null;
            vm.med = undefined;
            vm.medium = [];
            vm.SectionID = null;
            vm.sec = undefined;
            vm.section = [];
            vm.DepartmentID = null;
            vm.dept = undefined;
            vm.department = [];
            vm.ClassID = null;
            vm.cls = undefined;
            vm.class = [];

            $scope.showItem = false;
        };

        $scope.ReloadMedium = function (status) {
            if (status === 0) {
                vm.MediumID = null;
                //vm.med = [];
            }
            vm.med = undefined;
            vm.SectionID = null;
            vm.sec = undefined;
            vm.section = [];
            vm.DepartmentID = null;
            vm.dept = undefined;
            vm.department = [];
            vm.ClassID = null;
            vm.cls = undefined;
            vm.class = [];
        };

        $scope.ReloadClass = function (status) {
            vm.SectionID = null;
            vm.sec = undefined;
            vm.section = [];
            vm.DepartmentID = null;
            vm.dept = undefined;
            vm.department = [];
            vm.cls = undefined;
            if (status === 0) {
                vm.ClassID = null;
                //vm.class = [];
            }
        };

        $scope.ReloadDept = function (status) {
            vm.department = [];
            vm.dept = undefined;
            if (status === 0) {
                vm.DepartmentID = null;
                //vm.department = [];
            }
        };


        activate();
        function activate() {
            var promises = [getInstitute(''), getFeesType(), getWorkFlow()];
            return $q.all(promises).then(function () {
            });
        }


        //*************** WorkFlow Start********************** */

        function getWorkFlow() {
            var params = { menuID: vm.menuId, instituteId: vm.InstituteID };

            return commonService.getWorkFlow(params).then(function (data) {
                //console.log(data);
            });
        }

        //*************** WorkFlow End********************** */

        //**********************************************************Load Section************************************************************************************* */
        // loanding Grid
        vm.instituteID = $localStorage.userInfo[0].InstituteID;
        function getInstitute(status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            if (status === '') {
                $scope.ReloadDll();
            }

            return classSettingsService.getInstitute()
                .then(function (data) {
                    vm.institutes = data;

                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };
                    vm.getShift(status);
                    vm.getMedium(vm.instituteID, status);
                });
        }

        function loadGrid() {            
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            checkingDropdown();

            var params = {
                InstituteID: vm.instituteID,
                ShiftID: ShiftID,
                DepartmentID: DepartmentID,
                SectionID: SectionID,
                MediumID: MediumID,
                ClassID: ClassID,
                FeesTypeID: FeesTypeID,

            };
            return FeeSetupService.getAllClass(params)
                .then(function (data) {
                    vm.Fees = data;
                    $scope.value = data;
                });
        }

        function getFeesType() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line




            return FeeSetupService.getFeesType()
                .then(function (data) {
                    vm.FeeTypes = data;
                });
        }

        vm.getShift = function (status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var Params = {
                instituteId: vm.instituteID
            };
            return commonService.getInstituteShift(Params)
                .then(function (data) {
                    vm.Shift = data;

                    if (status === 'Edit') {
                        vm.shift = {
                            selected: vm.shifts.filter(function (ob, i) {
                                return (ob.ShiftID === vm.ShiftID);
                            })[0]
                        };
                    }
                });
        };

        vm.getDept = function (status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            if (status === '') {
                $scope.ReloadDept(1);
            }

            var Params = {
                InstituteID: vm.instituteID,
                ClassID: vm.ClassID,
                MediumID: vm.MediumID
            };
            return subjectSettingsSevice.getClassWiseDepartmentDDL(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        vm.department = data;
                        $scope.IsRequired = true;

                        if (status === 'Edit') {
                            vm.dept = {
                                selected: vm.department.filter(function (ob, i) {
                                    return (ob.DepartmentID === vm.DepartmentID);
                                })[0]
                            };
                        }
                    }
                    else {
                        $scope.IsRequired = false;

                        if (status === '') {
                            vm.DepartmentID = null;
                            vm.getSection(0, '');
                        }
                        else if (status === 'Edit') {
                            vm.getSection(vm.SectionID, status);
                        }
                    }
                });
        };

        vm.getSection = function (status) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



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
                    vm.section = data;
                    if (status === 'Edit') {
                        vm.sec = {
                            selected: vm.section.filter(function (ob, i) {
                                return (ob.SectionID === vm.SectionID);
                            })[0]
                        };
                    }
                });
        };

        vm.getClass = function (status) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



           
            if (status === '') {
                $scope.ReloadClass(1);
            }

            var Params = {
                InstituteID: vm.instituteID,
                MediumID: vm.MediumID
            };
            return subjectSettingsSevice.getMediumWiseClassDDL(Params)
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

        vm.getMedium = function (status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            if (status === '') {
                $scope.ReloadMedium(1);
            }

            var Params = {
                instituteId: vm.instituteID
            };
            return commonService.getInstituteMediumDdl(Params)
                .then(function (data) {
                    vm.medium = data;

                    if (status === 'Edit') {
                        vm.med = {
                            selected: vm.medium.filter(function (ob, i) {
                                return (ob.MediumID === vm.MediumID);
                            })[0]
                        };
                    }
                });
        };
        //**********************************************************HTML Show/Hide ************************************************************************************* */
        $scope.itemEvent = function () {
          
            $scope.createItem = true;
            loadGrid();
            checkingDropdown();
            $scope.showItem = true;
        };

        // for check box
        $scope.checkBoxIndex = function (index) {
            //debugger;
            $scope.valueIndex = index;
            $scope.value[$scope.valueIndex].id = $scope.valueIndex;
        };

        //check box click event
        $scope.clickEvent = function (tick, textBoxID, FeesTypeIDFromGrid, index) {
            if (tick === 1) {

                document.getElementById(textBoxID).readOnly = true;
                $scope.value[index].IsActive = 0;
                $scope.value[index]['inputFee'] = 0;
            }
            else {
                checkingDropdown();

                document.getElementById(textBoxID).readOnly = false;
                $scope.value[index].IsActive = 1;

                var feeID = '';
                $scope.value[index].FeesTypeID = FeesTypeIDFromGrid;
                $scope.value[index].ClassID = ClassID;
                $scope.value[index].MediumID = MediumID;
                $scope.value[index].SectionID = SectionID;
                $scope.value[index].DepartmentID = DepartmentID;
                $scope.value[index].ShiftID = ShiftID;
                $scope.value[index].InstituteID = vm.instituteID;

                feeID = $scope.value[index].FeesHead;
                // var startTime = document.getElementById(feeID);
                // $scope.value[index].StartTime=startTime;

                $scope.value.push(parseFloat(document.getElementById(feeID)));

                $scope.value.length = $scope.value.length - 1;
            }
        };

        function checkingDropdown() {
            if (vm.shift === undefined || vm.shift.selected === undefined) { ShiftID = null; } else { ShiftID = vm.shift.selected.ShiftID; }
            if (vm.dept === undefined || vm.dept.selected === undefined) { DepartmentID = null; } else { DepartmentID = vm.dept.selected.DepartmentID; }
            if (vm.sec === undefined || vm.sec.selected === undefined) { SectionID = null; } else { SectionID = vm.sec.selected.SectionID; }
            if (vm.med === undefined || vm.med.selected === undefined) { MediumID = null; } else { MediumID = vm.med.selected.MediumID; }
            if (vm.cls === undefined || vm.cls.selected === undefined) { ClassID = null; } else { ClassID = vm.cls.selected.ClassID; }
            if (vm.Fee === undefined || vm.Fee.selected === undefined) { FeesTypeID = null; } else { FeesTypeID = vm.Fee.selected.FeesTypeID; }
        }

        //managing check box read only property
        $scope.isReadOnly = function (fee) {
            if (fee != null) {
                return false;
            }
            else {
                return true;
            }
        };

        //**********************************************************CRUD************************************************************************************* */
        // add+update+delete data  in grid 
        vm.AddFees = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod));//jshint ignore : line

            //if (vm.cls === undefined || vm.cls.selected === undefined) {
            //    logger.error('Select Class!');
            //    return;
            //}

            if ($scope.value === null) {
                logger.error('Select Fee First !');
                return;
            }


            var feeSetupArr = [];
            if ($scope.value !== undefined) {
                var countUn = 0;
                for (var i = 0; i < $scope.value.length; i++) {
                    if ($scope.value[i].IsActive === 0 && $scope.value[i].FeesSetupID === null) {
                        var temp = 0;
                    } else {
                        if ($scope.value[i].inputFee !== undefined) {
                            countUn = 1;
                        }

                        if ($scope.value[i].Fee === null) {

                            if ($scope.value[i].inputFee === undefined || $scope.value[i].inputFee <= 0) {
                                logger.error('Enter Valid Fee');
                                return;
                            }
                        }

                        feeSetupArr.push($scope.value[i]);
                    }
                }

                if (countUn === 0) {
                    logger.error('Please change at least one row to save!!');
                    return;
                }

                FeeSetupService.SetFeeSetup({
                    FeesSetupID: 0,
                    CreateBy: 0,
                    CreateOn: '2017-01-01',
                    CreatePc: null,
                    UpdateBy: null,
                    UpdateOn: '2017-01-01',
                    UpdatePc: null,
                    IsDeleted: 0,
                    DeleteBy: null,
                    DeleteOn: '2017-01-01',
                    DeletePc: null,
                    feeSetupArr: feeSetupArr
                }).
                    then(function (data) {
                        logger.info('Saved!');
                        clear();
                        //$scope.showItem = false;
                        //loadGrid();
                    })
                    .catch(function (error) { });
            } else {
                logger.info('Please Select Your Institute and Medium');
            }
        };

        $scope.HideDiv = function () {
            $scope.showItem = false;
        };

        function wait(ms) {
            var start = new Date().getTime();
            var end = start;
            while (end < start + ms) {
                end = new Date().getTime();
            }
        }

        //**********************************************************Clear/Reset************************************************************************************* */

        // Reset Button Logic
        $scope.clearField = function () {
            clear();
            $scope.showItem = false;
        };
        // clearing data 
        function clear() {
            $state.go($state.current.name, {}, { reload: true });
        }
    }
})();
