(function () {
    'use strict';

    angular
        .module('app.incomeStatementReport')
        .controller('IncomeStatementReportController', IncomeStatementReportController);

    IncomeStatementReportController.$inject = ['trailBalanceReport','conversion','teacherAttendanceSevice','commonService','filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function IncomeStatementReportController(trailBalanceReport,conversion,teacherAttendanceSevice,commonService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage,apiConfig) {

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


        // Create and Show list Container Hide or Show Logic
        $scope.createItem=true;
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
             $scope.disBtn = false;
            vm.IncomeStatement=[];
        };


        $scope.AmountAss = 0;
        $scope.AmountLI = 0;
        $scope.AmountEx = 0;
        $scope.AmountIn = 0;
   



         vm.getIncomeStatementReport = function () {
          
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
                return trailBalanceReport.getIncomeStatementReport(params)
                    .then(function (data) {
                            $scope.AmountAss = null;
                            $scope.AmountLI = null;
                            $scope.AmountEx =null;
                            $scope.AmountIn = null;
                            if (data[0] === 0) {
                                logger.error('No data Found.......!');
                            } else {

                                vm.IncomeStatement = data;
                                if (vm.IncomeStatement.length > 0 || vm.IncomeStatement.length !== undefined || vm.IncomeStatement.length !== null) {

                                    for (var i = 0; i < vm.IncomeStatement.length; i++) {
                                        if (vm.IncomeStatement[i].Ledger === undefined) {
                                            console.log('ok');
                                        } else {
                                            for (var j = 0; j < vm.IncomeStatement[i].Ledger.length; j++) {
                                                if (vm.IncomeStatement[i].length > 0 || vm.IncomeStatement[i].length !== undefined || vm.IncomeStatement[i].length !== null) {
                                                    if (vm.IncomeStatement[i].Ledger[j].COATypeID === 1) { //jshint ignore : line
                                                        $scope.AmountAss += vm.IncomeStatement[i].Ledger[j].Balance;
                                                    }
                                                    if (vm.IncomeStatement[i].Ledger[j].COATypeID === 2) { //jshint ignore : line
                                                        $scope.AmountLI += vm.IncomeStatement[i].Ledger[j].Balance;
                                                    }
                                                    if (vm.IncomeStatement[i].Ledger[j].COATypeID === 3) { //jshint ignore : line
                                                        $scope.AmountEx += vm.IncomeStatement[i].Ledger[j].Balance;
                                                    }
                                                    if (vm.IncomeStatement[i].Ledger[j].COATypeID === 4) { //jshint ignore : line
                                                        $scope.AmountIn += vm.IncomeStatement[i].Ledger[j].Balance;
                                                    }
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
                kendo.drawing.pdf.saveAs(group, 'IncomeStatement' + '.pdf'); //jshint ignore : line
                $timeout(function () {
                  //$scope.mainDIV = false;
                    
                  //  $scope.tblShow = false;
                  //  $scope.headerShow = false;
                  //  $scope.lastDiv = false;
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
            a.download = 'IncomeStatement.xls';
            a.href = url;
            a.textContent = 'IncomeStatement.xls';
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
