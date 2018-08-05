(function () {
    'use strict';

    angular
        .module('app.trailBalanceReport')
        .controller('TrailBalanceReportController', TrailBalanceReportController);

    TrailBalanceReportController.$inject = ['trailBalanceReport','conversion','teacherAttendanceSevice','commonService','filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function TrailBalanceReportController(trailBalanceReport,conversion,teacherAttendanceSevice,commonService,filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage,apiConfig) {

        var vm = this;

        $scope.printBTn = false;
        $scope.pdfBTn = false;
        $scope.tblShow = false; 
        $scope.headerShow = false; 
        $scope.lastDiv = false;
        $scope.mainDIV = false;
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


        // Create and Show list Container Hide or Show Logic
        $scope.createItem = true;
        vm.ToDate = conversion.NowDateCustom();
        vm.FromDate = conversion.NowDateCustom();
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };


        $scope.gridHide = function () {
            $scope.tblShow = false;
            $scope.mainDIV = false;
            $scope.headerShow = false; 
            $scope.lastDiv = false;
            vm.trailBalance=[];
            $scope.disBtn = false;
        };


        
       // $scope.totalReturn += $scope.getDailyFees[i].ReturnAmount;
        $scope.DrAmountAss = 0;
        $scope.DrAmountLI = 0;
        $scope.DrAmountEx = 0;
        $scope.DrAmountIn = 0;
        //-------------------------
        $scope.CrAmountAss = 0;
        $scope.CrAmountLI = 0;
        $scope.CrAmountEx = 0;
        $scope.CrAmountIn = 0;
        //-------------------------
        $scope.ClosingBalAss = 0;
        $scope.ClosingBalLI = 0;
        $scope.ClosingBalEx = 0;
        $scope.ClosingBalIn = 0;
        //-------------------------
        $scope.OpeningBalAss = 0;
        $scope.OpeningBalLI = 0;
        $scope.OpeningBalEx = 0;
        $scope.OpeningBalIn = 0;
        //---------------------
        $scope.TotalCrAmount=0;
        $scope.TotalDrAmount=0;
       
        vm.getTrailBalaceReport = function () {
          
            $scope.disBtn = true;
            $scope.tblShow = true;
            $scope.mainDIV = true;
            var params = {
                FromDate: conversion.getStringToDate(vm.FromDate) === undefined || conversion.getStringToDate(vm.FromDate) === null ? null : conversion.getStringToDate(vm.FromDate),
                ToDate: conversion.getStringToDate(vm.ToDate) === undefined || conversion.getStringToDate(vm.ToDate) === null ? null : conversion.getStringToDate(vm.ToDate),
                InstituteID: $localStorage.userInfo[0].InstituteID,
                BranchID: vm.BrunchID === undefined || vm.BrunchID === null ? null : vm.BrunchID,
                FiscalYearID: vm.YearID === undefined || vm.YearID === null ? null : parseInt(vm.YearID)
            };

           // === created for test.... 
            //var params = {
            //        FromDate:'2018-02-01',
            //        ToDate: '2018-03-21',
            //        InstituteID: 1,
            //        OfficeID: 0,
            //        FiscalYearID: 0
            //    }
                return trailBalanceReport.getTrailBalance(params)
                    .then(function (data) {
                            $scope.DrAmountAss = null;
                            $scope.DrAmountLI = null;
                            $scope.DrAmountEx = null;
                            $scope.DrAmountIn = null;
                            //-------------------------
                            $scope.CrAmountAss = null;
                            $scope.CrAmountLI = null;
                            $scope.CrAmountEx = null;
                            $scope.CrAmountIn = null;
                            //-------------------------
                            $scope.ClosingBalAss = null;
                            $scope.ClosingBalLI = null;
                            $scope.ClosingBalEx = null;
                            $scope.ClosingBalIn = null;
                            //-------------------------
                            $scope.OpeningBalAss = null;
                            $scope.OpeningBalLI = null;
                            $scope.OpeningBalEx = null;
                            $scope.OpeningBalIn = null;
                            //---------------------
                            $scope.TotalCrAmount=null;
                            $scope.TotalDrAmount = null;
                            if (data[0].length === 0) {
                                logger.error('No Data Found....!');
                            } else {
                                vm.trailBalance = data;
                                if (vm.trailBalance.length > 0 || vm.trailBalance.length !== undefined || vm.trailBalance.length !== null) {

                                    for (var i = 0; i < vm.trailBalance.length; i++) {
                                        if (vm.trailBalance[i].Ledger === undefined) {
                                            console.log('ok');
                                        } else {
                                        if (vm.trailBalance[i].length > 0 || vm.trailBalance[i].length !== undefined || vm.trailBalance[i].length !== null) {

                                            for (var j = 0; j < vm.trailBalance[i].Ledger.length; j++) {
                                                //----------------- for DrAmount Calculation------------
                                                if (vm.trailBalance[i].Ledger[j].COATypeID === 1) {  //jshint ignore : line
                                                    $scope.DrAmountAss += vm.trailBalance[i].Ledger[j].DrAmount;
                                                }
                                                if (vm.trailBalance[i].Ledger[j].COATypeID === 2) { //jshint ignore : line
                                                    $scope.DrAmountLI += vm.trailBalance[i].Ledger[j].DrAmount;
                                                }
                                                if (vm.trailBalance[i].Ledger[j].COATypeID === 3) { //jshint ignore : line
                                                    $scope.DrAmountEx += vm.trailBalance[i].Ledger[j].DrAmount;
                                                }
                                                if (vm.trailBalance[i].Ledger[j].COATypeID === 4) { //jshint ignore : line
                                                    $scope.DrAmountIn += vm.trailBalance[i].Ledger[j].DrAmount;
                                                }
                                                //----------------- for CrAmount Calculation------------
                                                if (vm.trailBalance[i].Ledger[j].COATypeID === 1) { //jshint ignore : line
                                                    $scope.CrAmountAss += vm.trailBalance[i].Ledger[j].CrAmount;
                                                }
                                                if (vm.trailBalance[i].Ledger[j].COATypeID === 2) { //jshint ignore : line
                                                    $scope.CrAmountLI += vm.trailBalance[i].Ledger[j].CrAmount;
                                                }
                                                if (vm.trailBalance[i].Ledger[j].COATypeID === 3) { //jshint ignore : line
                                                    $scope.CrAmountEx += vm.trailBalance[i].Ledger[j].CrAmount;
                                                }
                                                if (vm.trailBalance[i].Ledger[j].COATypeID === 4) { //jshint ignore : line
                                                    $scope.CrAmountIn += vm.trailBalance[i].Ledger[j].CrAmount;
                                                }
                                                //----------------- for ClosingBal Calculation------------
                                                if (vm.trailBalance[i].Ledger[j].COATypeID === 1) { //jshint ignore : line
                                                    $scope.ClosingBalAss += vm.trailBalance[i].Ledger[j].ClosingBal;
                                                }
                                                if (vm.trailBalance[i].Ledger[j].COATypeID === 2) { //jshint ignore : line
                                                    $scope.ClosingBalLI += vm.trailBalance[i].Ledger[j].ClosingBal;
                                                }
                                                if (vm.trailBalance[i].Ledger[j].COATypeID === 3) { //jshint ignore : line
                                                    $scope.ClosingBalEx += vm.trailBalance[i].Ledger[j].ClosingBal;
                                                }
                                                if (vm.trailBalance[i].Ledger[j].COATypeID === 4) { //jshint ignore : line
                                                    $scope.ClosingBalIn += vm.trailBalance[i].Ledger[j].ClosingBal;
                                                }
                                                //----------------- for Opening Balance Calculation------------
                                                if (vm.trailBalance[i].Ledger[j].COATypeID === 1) { //jshint ignore : line
                                                    $scope.OpeningBalAss += vm.trailBalance[i].Ledger[j].OpeningBal;
                                                }
                                                if (vm.trailBalance[i].Ledger[j].COATypeID === 2) { //jshint ignore : line
                                                    $scope.OpeningBalLI += vm.trailBalance[i].Ledger[j].OpeningBal;
                                                }
                                                if (vm.trailBalance[i].Ledger[j].COATypeID === 3) { //jshint ignore : line
                                                    $scope.OpeningBalEx += vm.trailBalance[i].Ledger[j].OpeningBal;
                                                }
                                                if (vm.trailBalance[i].Ledger[j].COATypeID === 4) { //jshint ignore : line
                                                    $scope.OpeningBalIn += vm.trailBalance[i].Ledger[j].OpeningBal;
                                                }
                                                //-----------------Total DR and CR------------------------
                                                $scope.TotalCrAmount += vm.trailBalance[i].Ledger[j].CrAmount;
                                                $scope.TotalDrAmount += vm.trailBalance[i].Ledger[j].DrAmount;
                                            }
                                        }
                                    }
                                }
                              }
                           }
                    });
         //}
        };


        //======================== for Generate report========================================
     
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
                kendo.drawing.pdf.saveAs(group, 'Trail_Balance' + '.pdf'); //jshint ignore : line
                $timeout(function () {
                    $scope.printthis = true;
                    $scope.tblShow = true;
                    $scope.headerShow = false;
                    $scope.lastDiv = false;
                }, 3);

            });
        };
       
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
        vm.exportToExcel = function () {
            var blob = new Blob([document.getElementById('ExcelGenerate').innerHTML], {
                type: 'application/vnd.ms-excel;charset=charset=utf-8'
            });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.download = 'Trail_Balance.xls';
            a.href = url;
            a.textContent = 'Trail_Balance.xls';
            a.click();
            //saveAs(blob, 'DailyFeesCollection.xls');
        };




//==================================== end generate report ===================================


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







    }
})();
