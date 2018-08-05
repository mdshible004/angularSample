
(function () {
    'use strict';

    angular
        .module('app.BankPayment')
        .controller('BankPaymentController', BankPaymentController);


    BankPaymentController.$inject = ['FeeSetupService', 'commonService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$localStorage', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants'];
    function BankPaymentController(FeeSetupService, commonService, filterurl, $q, authservice, logger, $scope, $localStorage, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants) {

        activate();
        function activate() {
            var promises = [getFeesType(), loadGrid(), getShift(), getDept(), getMedium(), getClass()];
            return $q.all(promises).then(function () {
            });
        }


        //************************************************************ Declaration + Initialization ************************************************************************************* */

        var vm = this;
        $scope.value = null; // receiving data 
        $scope.valueIndex = null;
        var ShiftID = 0, DepartmentID = 0,
            MediumID = 0, SectionID = 0,
            ClassID = 0, FeesTypeID = 0;
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.header = true;

        $scope.detailGrid = true;


        //Token generate
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;



        //**********************************************************Load Section************************************************************************************* */
        // loanding Grid
        function loadGrid() {

            //Generate Token API Pass
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            var params = {
                instituteId: $localStorage.userInfo[0].InstituteID,
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

        function getShift() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteShift(Params)
                .then(function (data) {
                    vm.Shift = data;
                });
        }

        function getDept() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteDepertment(Params)
                .then(function (data) {
                    vm.department = data;
                });
        }

        vm.ClassSelected = function (classId) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line
            
            var params = {
                instituteId: $localStorage.userInfo[0].InstituteID,
                classId: classId
            };

            commonService.getInstituteSection(params)
                .then(function (data) {
                    vm.section = data;
                });
        };

        function getClass() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteClass(Params)
                .then(function (data) {
                    vm.class = data;
                });
        }
        function getMedium() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteMedium(Params)
                .then(function (data) {
                    vm.medium = data;
                });
        }
        //**********************************************************HTML Show/Hide ************************************************************************************* */
        $scope.itemEvent = function () {
            $scope.createItem = false;
            loadGrid();
            checkingDropdown();
            $scope.showItem = true;

            $scope.detailGrid = false;
            $scope.MoreRef = false;

        };


        $scope.MoreReference = function () {

            if (document.getElementById('btnRef').innerText === 'More Reference') {
                $scope.createItem = true;
                loadGrid();
                checkingDropdown();
                $scope.MoreRef = true;
                document.getElementById('btnRef').innerText = 'Less Reference';
            }
            else {
                $scope.MoreRef = false;
                document.getElementById('btnRef').innerText = 'More Reference';
                $scope.showItem = false;
            }

        };




        // for check box
        $scope.checkBoxIndex = function (index) {
            $scope.valueIndex = index;
            $scope.value[$scope.valueIndex].id = $scope.valueIndex;
        };

        //check box click event
        $scope.clickEvent = function (tick, textBoxID, index) {
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
                $scope.value[index].FeesTypeID = FeesTypeID;
                $scope.value[index].ClassID = ClassID;
                $scope.value[index].MediumID = MediumID;
                $scope.value[index].SectionID = SectionID;
                $scope.value[index].DepartmentID = DepartmentID;
                $scope.value[index].ShiftID = ShiftID;
                $scope.value[index].InstituteID = $localStorage.userInfo[0].InstituteID;


                feeID = $scope.value[index].FeesHead;
                $scope.value.push(parseFloat(document.getElementById(feeID)));

                $scope.value.length = $scope.value.length - 1;
            }
        };

        function checkingDropdown() {
            if (vm.shift === undefined) { ShiftID = 0; } else { ShiftID = vm.shift.selected.ShiftID; }
            if (vm.dept === undefined) { DepartmentID = 0; } else { DepartmentID = vm.dept.selected.DepartmentID; }
            if (vm.sec === undefined) { SectionID = 0; } else { SectionID = vm.sec.selected.SectionID; }
            if (vm.med === undefined) { MediumID = 0; } else { MediumID = vm.med.selected.MediumID; }
            if (vm.cls === undefined) { ClassID = 0; } else { ClassID = vm.cls.selected.ClassID; }
            if (vm.Fee === undefined) { FeesTypeID = 0; } else { FeesTypeID = vm.Fee.selected.FeesTypeID; }
        }

        //managing check box read only property
        $scope.isReadOnly = function (fee) {
            if (fee !== null) {
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
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            var feeSetupArr = [];
            if ($scope.value !== undefined) {
                for (var i = 0; i < $scope.value.length; i++) {
                    if ($scope.value[i].IsActive === 0 && $scope.value[i].FeesSetupID === null) {
                        var temp = 0;
                    } else {
                        feeSetupArr.push($scope.value[i]);
                    }
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

                        loadGrid();
                    })
                    .catch(function (error) { });
            } else {
                logger.info('Please Select Your Institute and Medium');
            }
        };

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
