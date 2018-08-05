
//**********************************************Node Frameworks************************************************************************************* */

(function () {
    'use strict';

    angular
        .module('app.FeeHead')
        .controller('FeeController', FeeController);

    FeeController.$inject = ['FeeService', 'chartOfAccountsService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$localStorage', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants'];
    function FeeController(FeeService, chartOfAccountsService, filterurl, $q, authservice, logger, $scope, $localStorage, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants) {



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
        var FuncName = '';

        activate();
        function activate() {
            var promises = [getAccountHead(), getFeesType(), loadGrid()];
            return $q.all(promises).then(function () {
            });
        }

        //************************************************************ Declaration + Initialization ************************************************************************************* */



        $scope.showItem = false;
        $scope.createItem = true;

        var testSame_FeeHead = null;
        var testSame_typeID = null;
        var testSame_Active = null;

        //**********************************************************Load Section************************************************************************************* */

        function getAccountHead() {
            // console.log(vm.COA.selected.COATypeID);

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            vm.coaByType = null;
            var params = {
                Insid: $localStorage.userInfo[0].InstituteID,
                COATypeID: 3
            };
            return chartOfAccountsService.getChartOfAccountByTypeID(params)
                .then(function (data) {
                    vm.COATypeList = data;
                    if (FuncName === 'Edit') {
                        vm.coaType = {
                            selected: vm.COATypeList.filter(function (ob, i) {
                                return (ob.COAID === vm.COAID);
                            })[0]
                        };
                        FuncName = '';
                    }

                });
        }

        function getFeesType() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return FeeService.getFeesType()
                .then(function (data) {
                    vm.FeeTypes = data;

                });
        }

        function loadGrid() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID
            };
            return FeeService.getAllClass(Params)
                .then(function (data) {
                    vm.Fees = data;
                });
        }


        vm.getFeesByID = function (FeeID) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var Param = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                FeeID: FeeID
            };
            FeeService.getFeesByID(Param)
                .then(function (data) {

                    vm.FeesSetup.classID = FeeID;
                    vm.FeesSetup.FeesHead = data[0].FeesHead;
                    vm.FeesSetup.FeesTypeID = data[0].FeesTypeID;
                    vm.Fee = {
                        selected: vm.FeeTypes.filter(function (ob, i) {
                            return (ob.FeesType === data[0].FeesType);
                        })[0]
                    };
                    vm.check = data[0].IsActive;

                    vm.COAID = data[0].COAID;
                    vm.coaType = { selected: vm.COATypeList.filter(function (ob, i) { return (ob.COAID === vm.COAID); })[0] };

                    //for testing same value in all field // no update message 
                    testSame_FeeHead = data[0].FeesHead;
                    testSame_typeID = data[0].FeesTypeID;
                    testSame_Active = data[0].IsActive;
                });
        };

        //**********************************************************HTML Show/Hide ************************************************************************************* */

        $scope.itemEvent = function () {
            $scope.showItem = true;
            $scope.createItem = false;

        };
        $scope.listEvent = function () {
            $scope.showItem = false;
            $scope.createItem = true;
            clear();

        };

        //**********************************************************CRUD************************************************************************************* */

        vm.AddFees = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line
            
            var check = '';
            if (vm.check === true) {
                check = 'true';
            }
            else {
                check = 'false';
            }

            FeeService.SaveFees({
                InsFeesHeadID: 0,
                FeesHead: vm.FeesSetup.FeesHead,
                FeesTypeID: vm.Fee.selected.FeesTypeID,
                COAID: vm.COAID,
                isActive: check,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                LoggedUserID: $localStorage.userInfo[0].UserID
            })
                .then(function (data) {
                    if (data[0].ReturnValue === 'Duplicate') {
                        logger.error('This name Already exists...');
                        loadGrid();
                        clear();
                    }
                    else {
                        logger.info('Saved Successfully!');
                        loadGrid();
                        clear();
                    }
                })
                .catch(function (error) { });
        };

        //Update Fees
        vm.UpdateFees = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line
            
            var check = '';
            if (vm.check === true) {
                check = 'true';
            }
            else {
                check = 'false';
            }

            if (testSame_FeeHead === vm.FeesSetup.FeesHead && testSame_typeID === vm.Fee.selected.FeesTypeID && testSame_Active === vm.check) {
                logger.warning('Please Update Something !!');
                return;
            }

            FeeService.UpdateFees({
                InsFeesHeadID: vm.FeesSetup.classID,
                FeesHead: vm.FeesSetup.FeesHead,
                FeesTypeID: vm.Fee.selected.FeesTypeID,
                isActive: check,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                LoggedUserID: $localStorage.userInfo[0].UserID
            })
                .then(function (data) {
                    if (data[0].ReturnValue === 'Duplicate') {
                        logger.error('This name Already exists...');
                        loadGrid();
                        //  clear();
                    }
                    else {
                        logger.info('Updated Successfully!');
                        loadGrid();
                        //   clear();
                    }
                })
                .catch(function (error) { });
        };

        //Delete Fees
        vm.deleteFee = function (classID) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line
            
            var classParam = {
                classID: classID
            };
            FeeService.deleteFeeByID(classParam)
                .then(function (data) {
                    // vm.Fees = data;
                    loadGrid();
                });
        };

        $scope.SaveAccountHead = function () {

            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line            

            chartOfAccountsService.postChartOfAccount({
                COAID: 0,
                COATypeID: 3,
                COAName: vm.COAName,
                ParentID: null,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                LoggedUserID: $localStorage.userInfo[0].UserID
            })

                .then(function (data) {
                    if (data[0].ReturnValue > 0) {
                        logger.info('Account Head Saved!');
                        vm.COAName = undefined;

                        var IfExist = vm.COATypeList.filter(function (ob, i) { return (ob.COAID === data[0].ReturnValue); })[0];
                        if (IfExist === null || IfExist === undefined) {
                            vm.COAID = data[0].ReturnValue;
                            vm.COATypeList.push({ COAID: vm.COAID, COAName: data[0].COAName, COANameParent: '', COATypeID: 3, COATypeName: 'Income ', ParentID: null });
                            vm.coaType = { selected: vm.COATypeList.filter(function (ob, i) { return (ob.COAID === vm.COAID); })[0] };
                        }
                    }
                })
                .catch(function (error) { });
        };

        //**********************************************************Clear/Reset************************************************************************************* */

        $scope.clearField = function () {
            clear();
        };

        function clear() {
            $state.go($state.current.name, {}, { reload: true });
        }

        vm.Refresh = function () {
            loadGrid();
        };

    }
})();
