(function () {
    'use strict';

    angular
        .module('app.dailyFeesReport')
        .controller('DailyFeesReportController', DailyFeesReportController);

    DailyFeesReportController.$inject = ['conversion', 'dailyFeesCollectionReportService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function DailyFeesReportController(conversion, dailyFeesCollectionReportService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

        var vm = this;
        vm.feedailyReportDate = conversion.NowDateCustom();
        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration


        $scope.InstituteName = $localStorage.userInfo[0].InstituteName;
        // Create and Show list Container Hide or Show Logic
        //get date
        $scope.CurrentDate = new Date();

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        today = yyyy + '-' + mm + '-' + dd;
        $scope.OnDate = today;

        $scope.createItem = true;
        $scope.printthis = false;
        $scope.showDailyReport = false;
        $scope.totalPay = 0;
        $scope.totalfee = 0;
        $scope.totalReturn = 0;
        $scope.hideItem = function () {
            $scope.showDailyReport = false;
        };
        $scope.itemEvent = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            var Params = {
                date: conversion.getStringToDate(vm.feedailyReportDate),
                instituteID: $localStorage.userInfo[0].InstituteID
            };
            dailyFeesCollectionReportService.getdailyFeesCollectionReport(Params)

                .then(function (data) {
                    $scope.getDailyFees = data;
                    //$scope.createItem = false;
                    $scope.showDailyReport = true;

                    for (var i = 0; i < $scope.getDailyFees.length; i++) {
                        $scope.totalPay += $scope.getDailyFees[i].TotalPayment;
                        $scope.totalfee += $scope.getDailyFees[i].TotalFee;
                        $scope.totalReturn += $scope.getDailyFees[i].ReturnAmount;
                    }


                });

        };

        $scope.generatePDF = function (print) {
             $scope.printthis=true;
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
                 kendo.drawing.pdf.saveAs(group, 'DailyFeesCollection' + '.pdf'); //jshint ignore : line
                 $timeout(function () {
                     $scope.printthis = false;
                 }, 3);

             });
        };
        // $scope.generatePDF = function (print) {
        //     $scope.printthis=true;
        //     kendo.drawing.drawDOM($('#print'), {
        //         allPages: true,
        //         avoidLinks: true,
        //         paperSize: 'letter',
        //         margin: { top: '0.5cm', left: '0.1cm', right: '0.0cm', bottom: '0.5cm' },
        //         portrait: true,
        //         repeatHeaders: true,
        //         multiPage: true,
        //         scale: 0.5
        //     }).then(function (group) {
        //         kendo.drawing.pdf.saveAs(group, 'DailyFeesCollection' + '.pdf');
        //         $timeout(function () {
        //             $scope.printthis = false;
        //         }, 100);

        //     });

        // };






        //  $scope.generatePDF = function(){
        //     html2canvas(document.getElementById('print'), {
        //         onrendered: function (canvas) {
        //             var data = canvas.toDataURL();
        //             var docDefinition = {
        //                 content: [{
        //                     image: data,
        //                     width: 500,
        //                 }]
        //             };
        //             pdfMake.createPdf(docDefinition).download("test.pdf");
        //         }
        //     });
        //  }




        //   $scope.generatePDF  = function (print) {
        //     var pdf = new jsPDF('p', 'pt', 'letter');
        //     var text = "                      Attendence Details";
        //     pdf.text(100, 225, text);
        //     var source = $('#print')[0];
        //     var specialElementHandlers = {
        //         '#bypassme': function (element, renderer) {
        //             return true
        //         }
        //     };
        //     var margins = {
        //         top: 100,
        //         bottom: 100,
        //         left: 160,
        //         width: 27
        //     };
        //     pdf.fromHTML(source, margins.left, margins.top, { 'width': margins.width, 'elementHandlers': specialElementHandlers },
        //         function (dispose) { pdf.save('DailyFeesCollection.pdf'); }, margins);
        // }

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
             a.download = 'DailyFeesCollection.xls';
             a.href = url;
             a.textContent = 'DailyFeesCollection.xls';
             a.click();
             //saveAs(blob, 'DailyFeesCollection.xls');
         };



        activate();

        function activate() {
            var promises = [];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }







    }
})();
