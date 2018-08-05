
(function () {
    'use strict';

    angular
        .module('app.balanceSheetReport')
        .controller('BalanceSheetReportController', BalanceSheetReportController);

    BalanceSheetReportController.$inject = ['filterurl', 'teacherAttendanceSevice', 'commonService', 'trailBalanceReport', '$q', 'conversion', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function BalanceSheetReportController(filterurl, teacherAttendanceSevice, commonService, trailBalanceReport, $q, conversion, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, apiConfig) {

        var vm = this;
        $scope.printBTn = false;
        $scope.pdfBTn = false;
        $scope.mainDIV = false;
        $scope.headerShow = false;
        $scope.lastDiv = false;

        vm.ToDate = conversion.NowDateCustom();
        vm.FromDate = conversion.NowDateCustom();
        //==============for report header information ===
        vm.imgHost = apiConfig.imagehost;
        $scope.InstituteLogo = $localStorage.userInfo[0].InstituteLogo;
        $scope.InsEmail = $localStorage.userInfo[0].InsEmail;
        $scope.InsAddress = $localStorage.userInfo[0].InsAddress;
        $scope.InsWeb = $localStorage.userInfo[0].InsWeb;
        $scope.InsPhoneNo = $localStorage.userInfo[0].InsPhoneNo;
        $scope.InstituteName = $localStorage.userInfo[0].InstituteName;

        // ============end report Heasder information===
        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration



        $scope.gridHide = function () {
            $scope.tblShow = false;
            $scope.mainDIV = false;
            $scope.headerShow = false;
            $scope.lastDiv = false;
            vm.balance = [];
        };





        // Create and Show list Container Hide or Show Logic
        $scope.createItem = true;

        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        $scope.AmountAss = 0;
        $scope.AmountLI = 0;
        $scope.AmountEx = 0;
        $scope.AmountIn = 0;


        vm.getBalaceReport = function () {

            $scope.mainDIV = true;
            $scope.headerShow = false;
            $scope.showItem = true;

            $scope.printBTn = false;
            $scope.pdfBTn = false;
            var params = {
                FromDate: conversion.getStringToDate(vm.FromDate) === undefined || conversion.getStringToDate(vm.FromDate) === null ? null : conversion.getStringToDate(vm.FromDate),
                ToDate: conversion.getStringToDate(vm.ToDate) === undefined || conversion.getStringToDate(vm.ToDate) === null ? null : conversion.getStringToDate(vm.ToDate),
                InstituteID: $localStorage.userInfo[0].InstituteID,
                BranchID: vm.BrunchID === undefined || vm.BrunchID === null ? null : vm.BrunchID,
                FiscalYearID: vm.YearID === undefined || vm.YearID === null ? null : parseInt(vm.YearID)

            };
            return trailBalanceReport.getBalanceSheet(params)
                .then(function (data) {
                    //debugger;

                    $scope.AmountAss = null;
                    $scope.AmountLI = null;
                    $scope.AmountEx = null;
                    $scope.AmountIn = null;
                    if (data[0] === 0 || data[0] === undefined) {
                        logger.error('No data Found.......!');
                    } else {

                        vm.balance = data;
                        if (vm.balance.length > 0 || vm.balance.length !== undefined || vm.balance.length !== null) {

                            for (var i = 0; i < vm.balance.length; i++) {
                                if (vm.balance[i].Ledger === undefined) {
                                    console.log('ok');
                                }
                                else {
                                    for (var j = 0; j < vm.balance[i].Ledger.length; j++) {

                                        if (vm.balance[i].length > 0 || vm.balance[i].length !== undefined || vm.balance[i].length !== null) { // jshint maxdepth:5
                                            if (vm.balance[i].Ledger[j].COATypeID === 1) { //jshint ignore : line
                                                $scope.AmountAss += vm.balance[i].Ledger[j].Balance;
                                            }
                                            if (vm.balance[i].Ledger[j].COATypeID === 2) {  //jshint ignore : line
                                                $scope.AmountLI += vm.balance[i].Ledger[j].Balance;
                                            }
                                            if (vm.balance[i].Ledger[j].COATypeID === 3) { //jshint ignore : line
                                                $scope.AmountEx += vm.balance[i].Ledger[j].Balance;
                                            }

                                            if (vm.balance[i].Ledger[j].COATypeID === 4) { //jshint ignore : line
                                                $scope.AmountIn += vm.balance[i].Ledger[j].Balance;
                                            }
                                        } else { //jshint ignore : line
                                            console.log('ok');
                                        }

                                    }
                                }
                            }
                        }
                    }
                });
        };





        activate();

        function activate() {
            var promises = [getInsBranchDdl(), getFiscalYear()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }



        function getInsBranchDdl() {


            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            var params = {
                InstituteID: $localStorage.userInfo[0].InstituteID
            };
            return teacherAttendanceSevice.getInsBranch(params)
                .then(function (data) {
                    vm.branches = data;
                });
        }



        function getFiscalYear() {

            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            return commonService.getCmnYear()
                .then(function (data) {
                    vm.years = data;
                });
        }




        vm.printDiv = function printElem(print) {
            var content = document.getElementById(print).innerHTML;
            var mywindow = window.open('', 'Print', 'height=1000,width=2000');

            mywindow.document.write('<html><head><title></title>');
            mywindow.document.write('</head><body >');
            mywindow.document.write(content);
            mywindow.document.write('</body> <br/><br/>');
            mywindow.document.write('<footer> <font color="green">Powered By:</font><font color="blue"> onAir International Ltd. </font></footer>');
            mywindow.document.write('</html>');


            mywindow.document.close();
            mywindow.focus();
            mywindow.print();
            mywindow.close();
            return true;
        };



        $scope.exportToPDF = function (print) {
            $scope.printthis = true;
            $scope.tblShow = true;
            $scope.headerShow = true;
            $scope.lastDiv = true;
            kendo.drawing.drawDOM($('#print'), { //jshint ignore : line
                allPages: true,
                avoidLinks: true,
                paperSize: 'letter',
                margin: { top: '0.5cm', left: '0.1cm', right: '0.0cm', bottom: '0.5cm' },
                portrait: true,
                repeatHeaders: true,
                multiPage: true,
                scale: 0.5
            }).then(function (group) {
                kendo.drawing.pdf.saveAs(group, 'BalanceSheet' + '.pdf'); //jshint ignore : line
                $timeout(function () {
                    $scope.printthis = false;

                    $scope.tblShow = false;
                    $scope.headerShow = false;
                    $scope.lastDiv = false;
                }, 3);

            });
        };



        vm.exportToExcel = function () {
            var blob = new Blob([document.getElementById('ExcelGenerate').innerHTML], {
                type: 'application/vnd.ms-excel;charset=charset=utf-8'
            });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.download = 'BalanceSheet.xls';
            a.href = url;
            a.textContent = 'BalanceSheet.xls';
            a.click();
            //saveAs(blob, 'DailyFeesCollection.xls');
        };




    }
})();
