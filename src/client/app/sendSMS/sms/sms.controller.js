
(function () {
    'use strict';

    angular
        .module('app.sms')
        .controller('SMSController', SMSController);

    SMSController.$inject = ['instituteSettings','filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function SMSController(instituteSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {



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

        $scope.itemEvent = function () {
            //$scope.IsVisible = $scope.IsVisible ? false : true;
            $scope.showItem = true;
            $scope.createItem = false;

        };
        $scope.changeGrid = function () {
            vm.attendances = [];
            vm.totalattendances = [];

            $scope.showItem = false;
        };

        $scope.listEvent = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.showItem = false;
            $scope.createItem = true;
        };

        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };
        $scope.changegrid = function () {
            vm.attendances = [];
            $scope.showItem = false;
        };

        
        //SMS Payment Method JSON
        vm.paymentMethod = [
            {
                id: 1,
                methodName: 'Bkash',
                discription: {
                    dailNumber: 'Dial *247#',
                    sendType: 'Select Send money/Cash in',
                    paymentSendNum: 'Send BDT to 01749-139-144',
                    rule1: 'Check Your Bkash confirmation Message for TRXID',
                    rule2: 'Enter the TRXID Below & Click Order SMS Button',
                    rule3: 'Your Account will be recharged within 3 hours of sending payment'

                }

            },
            {
                id: 2,
                methodName: 'ROCKET',
                discription: {
                    dailNumber: 'Dial *322#',
                    sendType: 'Select Send money',
                    paymentSendNum: 'Send BDT to 01615-05-05-043',
                    rule1: 'Check Your Rocket confirmation Message for TXNID',
                    rule2: 'Enter the TXNID Below & Click Order SMS Button',
                    rule3: 'Your Account will be recharged within 3 hours of sending payment'

                }
            }
        ];

        $scope.QuantityInput = function () {
            smsPriceCalculation();
        };
        vm.getPaymentRule = function (paymentId) {
            for (var i = 0; i < vm.paymentMethod.length; i++) {
                if (vm.paymentMethod[i].id === paymentId) {
                    vm.paymentRule = vm.paymentMethod[i].discription;
                }
            }
        };
        function smsPriceCalculation() {
            vm.smsTotalPiceCalculation = 0;
            vm.Quantity = (vm.smsQuantity === undefined) ? 0 : vm.smsQuantity;

            var smsRate = parseInt('.30');
            vm.smsTotalPiceCalculation = vm.Quantity * smsRate;
            assignWatchers();
        }

        var allWatchers = [];
        function assignWatchers() {

            setTimeout(function () {
                if (allWatchers.length !== 0) {
                    return;
                }
                allWatchers.push($scope.$watch('vm.smsQuantity', function () {
                    allWatchers = deassignWatchers();
                    smsPriceCalculation();
                }, true));
            }, 300);

        }
        function deassignWatchers() {
            while (allWatchers.length > 0) {
                allWatchers.pop()();
            }
            return allWatchers;
        }
        deassignWatchers();
        
        vm.SMSOrderID = 0;
        vm.orderSMS = function () {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line

            if ( vm.smsQuantity < 500) {
                logger.error('SMS Quantity Minmum 500');
              
            } else {
                //debugger
                instituteSettings.postInsInstituteSMSOrder({
                    SMSOrderID: vm.SMSOrderID,
                    SMSOrderNo: '',
                    InstituteID: vm.InstituteID,
                    OrderdSMS: vm.Quantity,
                    PaidAmount: vm.smsTotalPiceCalculation,
                    PaymentType: vm.paymentTypeID === undefined ? null : vm.pm.selected.id,
                    TrxID: vm.TrxID,
                    IsBuyComplete: 0,
                    IsSalesComplete: 0,
                    LoggedUserID: vm.LoggedUserID

                })
                    .then(function (data) {
                        if (data[0].ReturnValue === 'Duplicate') {
                            logger.error('Order Already Exists..............!');
                        } else {
                            logger.info('Saved!');                         
                            $state.go($state.current.name, {}, { reload: true });

                        }

                    })
                    .catch(function (error) { });
            }



        };


        vm.editInsInstituteSMSOrde = function (ID) {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line
            var params = {
                instituteID: vm.InstituteID,
                SMSOrderID: ID
            };

            return instituteSettings.getinsInstituteSMSOrderByOrderID(params)
                .then(function (data) {
                    vm.insSMSOrder = data;
                    $scope.createItem = true;
                    $scope.showItem = false;
                    vm.SMSOrderID = data[0].SMSOrderID;
                    vm.smsQuantity = data[0].OrderdSMS;
                    vm.pm = {
                        selected: vm.paymentMethod.filter(function (ob, i) {
                            return (ob.id === data[0].PaymentType);
                        })[0]
                    };
                    vm.TrxID = data[0].TrxID;
                    smsPriceCalculation();
                });
        };
        activate();

        function activate() {
            var promises = [getInsInstituteSMSOrde()];
            return $q.all(promises).then(function () {
            });
        }
        
        function getInsInstituteSMSOrde() {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line
            var params = {
                instituteID: vm.InstituteID
            };

            return instituteSettings.getInsInstituteSMSOrder(params)
                .then(function (data) {
                    vm.insSMSOrderList = data;
                });
        }

    }
})();

