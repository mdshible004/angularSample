

//**********************************************Node Frameworks************************************************************************************* */

(function () {
    'use strict';

    angular
        .module('app.CashReceive')
        .controller('CashReceiveController', CashReceiveController);


    CashReceiveController.$inject = ['filterurl', '$q', 'authservice', 'logger', '$scope', '$localStorage', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants'];
    function CashReceiveController(filterurl, $q, authservice, logger, $scope, $localStorage, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants) {


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
            var promises = [getFeesType(), loadGrid(), getShift(), getDept(), getMedium(), getClass()];
            return $q.all(promises).then(function () {
            });
        }


        //************************************************************ Declaration + Initialization ************************************************************************************* */

       



        $scope.value = null; // receiving data 
        $scope.valueIndex = null;
        var ShiftID = 0, DepartmentID = 0,
            MediumID = 0, SectionID = 0,
            ClassID = 0, FeesTypeID = 0;
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.header=true;

        $scope.detailGrid = true;
        //**********************************************************Load Section************************************************************************************* */
        // loanding Grid
        function loadGrid() {
           
        }

        function getFeesType() {
            
        }

        function getShift() {
          
        }

        function getDept() {
          
        }

        vm.ClassSelected = function (classId) {
        
        };

        function getClass() {
          
        }
        function getMedium() {
           
        }
        //**********************************************************HTML Show/Hide ************************************************************************************* */
        $scope.itemEvent = function () {
            $scope.createItem = false;
            loadGrid();
            checkingDropdown();
            $scope.showItem = true;

            $scope.detailGrid = false;
            $scope.MoreRef =false;

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
