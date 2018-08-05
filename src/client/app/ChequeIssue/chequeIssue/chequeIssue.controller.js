

//**********************************************Node Frameworks************************************************************************************* */
(function () {
    'use strict';

    angular
        .module('app.ChequeIssue')
        .controller('chequeIssueController', chequeIssueController);

    chequeIssueController.$inject = ['filterurl', '$q', 'authservice', 'logger', '$scope', '$localStorage', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants'];
    function chequeIssueController(filterurl, $q, authservice, logger, $scope, $localStorage, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants) {



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




        activate();
        function activate() {
            var promises = [loadGrid(), getShift(), getDept(), getMedium(), getClass()];
            return $q.all(promises).then(function () {
            });
        }



        //************************************************************ Declaration + Initialization ************************************************************************************* */

     
        var updateUserID = 0;
        var updateScholarshipID = 0;
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

        //**********************************************************Load Section************************************************************************************* */



        function loadScholarship() {

        }

        function getClass() {

        }

        function loadGrid() {

        }


        function getShift() {

        }

        function getDept() {

        }

        vm.ClassSelected = function (classId) {

        };



        function getMedium() {

        }

        function myFun(ClassID) {

        }


        vm.getScholarshipByID = function (StudentID, ClassID) {


        };

        //zahid_list_button click 
        vm.getHrmSubWiseAtdDetails = function () {
            checkingDropdown();


        };
        //zahid_list button click 

        //**********************************************************HTML Show/Hide ************************************************************************************* */

        $scope.itemEvent = function () {
            $scope.createItem = true;
            loadGrid();
            checkingDropdown();
            $scope.showItem = true;
            loadScholarship();
        };



        // for check box
        $scope.checkBoxIndex = function (index) {
            $scope.valueIndex = index;
            $scope.value[$scope.valueIndex].id = $scope.valueIndex;
        };

        vm.getMonthlyAtd = function (index) {

            vm.monthlyAtd = vm.monAtd[index];
            vm.studentName = vm.monthlyAtd.UserFullName;
            $scope.studentProfile = true;
        };

        //check box click event      
        $scope.clickEventTotal = function (check, textBoxID, index) {
            if (check === true) {

                vm.onTution = 0;
                vm.tutionChkBox = false;
                vm.checkedTution = false;
                document.getElementById('txtOnTotal').value = 0;
                document.getElementById('txtOnTotal').readOnly = false;

                document.getElementById('txtOnTution').value = 0;
                document.getElementById('txtOnTution').readOnly = true;
            }
            else {

                vm.onTotal = 0;
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

                vm.onTotal = 0;
                vm.tolalChkBox = false;
                vm.checkedTotal = false;
                document.getElementById('txtOnTotal').value = 0;
                document.getElementById('txtOnTotal').readOnly = true;

                document.getElementById('txtOnTution').value = 0;
                document.getElementById('txtOnTution').readOnly = false;
            }
            else {

                vm.onTution = 0;
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

                vm.onTotal = 0;
                vm.EtolalChkBox = false;
                vm.EcheckedTotal = false;

                document.getElementById('EtxtOnTotal').value = 0;
                document.getElementById('EtxtOnTotal').readOnly = true;

                document.getElementById('EtxtOnTution').value = 0;
                document.getElementById('EtxtOnTution').readOnly = false;

                vm.EonTotal = 0;
                vm.EonTution = 0;
                isPercent = false;


            }
            else {

                vm.onTution = 0;
                vm.EtolalChkBox = true;

                document.getElementById('EtxtOnTotal').value = 0;
                document.getElementById('EtxtOnTotal').readOnly = false;

                document.getElementById('EtxtOnTution').value = 0;
                document.getElementById('EtxtOnTution').readOnly = true;

                vm.EonTotal = 0;
                vm.EonTution = 0;
                isPercent = false;
            }
        };

        $scope.updateClickEventTotal = function (check, textBoxID, index) {
            if (check === true) {

                vm.onTution = 0;
                vm.EtutionChkBox = false;
                vm.EcheckedTution = false;
                document.getElementById('EtxtOnTotal').value = 0;
                document.getElementById('EtxtOnTotal').readOnly = false;

                document.getElementById('EtxtOnTution').value = 0;
                document.getElementById('EtxtOnTution').readOnly = true;

                vm.EonTotal = 0;
                vm.EonTution = 0;
                isPercent = false;
            }
            else {

                vm.onTotal = 0;
                vm.EtutionChkBox = true;
                document.getElementById('EtxtOnTotal').value = 0;
                document.getElementById('EtxtOnTotal').readOnly = true;

                document.getElementById('EtxtOnTution').value = 0;
                document.getElementById('EtxtOnTution').readOnly = false;

                vm.EonTotal = 0;
                vm.EonTution = 0;
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
            if (fee !== null) {
                return false;
            }
            else {
                return true;
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


        $scope.openFeesTabIndex = function (index) {

            $scope.value = index;

        };

        //**********************************************************CRUD************************************************************************************* */

        // add+update+delete data  in grid 
        vm.addScholar = function () {
            var temp = 0;

            if (vm.studentName === 0 || vm.studentName === undefined || vm.studentName === null) {
                logger.error('Please Select a Student From List');
            } else {
                checkingDropdown();

                var amount;
                if (vm.onTution === 0) {
                    amount = vm.onTotal;
                    isTution = false;
                    isTotal = true;
                }
                if (vm.onTotal === 0) {
                    amount = vm.onTution;
                    isTotal = false;
                    isTution = true;
                }

                if (isPercent) {
                    if (amount > 100) {
                        logger.error('Percent Selected<br/> Amount cannot be greater than 100');
                    }
                    else {
                        temp = 0;
                    }
                }
                else {
                    temp = 0;
                }

            }
        };



        vm.updateScholar = function () {
            checkingDropdown();

            var amount;
            if (vm.EonTution === 0) {
                amount = vm.EonTotal;
                isTution = false;
                isTotal = true;
            }
            if (vm.EonTotal === 0) {
                isTotal = false;
                isTution = true;
                amount = vm.EonTution;
            }

            if (isPercent) {
                if (amount > 100) {
                    logger.error('Percent Selected<br/> Amount cannot be greater than 100');
                }
                else {
                    updateServiceCall(amount, isPercent, isTotal, isTution);
                }
            }
            else {
                updateServiceCall(amount, isPercent, isTotal, isTution);
            }
        };


        function updateServiceCall(amount, isPercent, isTotal, isTution) {

        }

        vm.deleteScholarship = function (ScholarshipID) {

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

    }
})();
