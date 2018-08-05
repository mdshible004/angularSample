(function () {
    'use strict';

    angular
        .module('app.monthReport')
        .controller('financialReportController', financialReportController);

    financialReportController.$inject = ['monthlyFeeReportService','studentAtdReportSettingsService','filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function financialReportController(monthlyFeeReportService,studentAtdReportSettingsService , filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

        $scope.hideList = function () {
            $scope.showDailyReport = false;
            $scope.createItem = true;
        };

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



        // $scope.InstituteID = $localStorage.userInfo[0].InstituteID;
        $scope.InstituteName= $localStorage.userInfo[0].InstituteName;

        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.printthis = false;
        
        $scope.listEvent = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.showItem = false;
            $scope.createItem = true;
        };

        // Reset Button Logic
        $scope.clearField = function () {
  
        };

   
        $scope.totalfee=0;
        $scope.totalpaymement=0;
        $scope.totalReturn=0;
        vm.showReport = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            $scope.showDailyReport = true;
            //$scope.createItem = false;
            
            var params = {
                MonthID:vm.mon.selected.MonthID,
                instituteID: $localStorage.userInfo[0].InstituteID
            };
            return monthlyFeeReportService.getMonthlyFeeReport(params)
            .then(function (data) {
                $scope.montlyreport = data;
                for(var i=0;i< $scope.montlyreport.length;i++){
                    
                    $scope.totalfee+= $scope.montlyreport[i].TotalFee;
                    $scope.totalpaymement+= $scope.montlyreport[i].TotalPayment;
                    $scope.totalReturn+= $scope.montlyreport[i].ReturnAmount;
                }
           
            });
        };
 
       
        // vm.printDiv = function (print) {
        //             var printContents = document.getElementById(print).innerHTML;
        //             var originalContents = document.body.innerHTML;
        //             document.body.innerHTML = printContents;
        //             window.print();            
        //            document.body.innerHTML = originalContents;
        //            $state.go($state.current.name, {}, {reload: true});
                 
        //         };
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
        
        

        // vm.exportToPDF = function (print) {
        //     var pdf = new jsPDF('p', 'pt', 'A4');
        //     var text = "                ";
        //     pdf.text(100, 225, text);
        //     var source = $('#pdf')[0];
        //     var specialElementHandlers = {
        //         '#bypassme': function (element, renderer) {
        //             return true
        //         }
        //     };
        //     var margins = {
        //         top: 80,
        //         bottom: 60,
        //         left: 40,
        //         width: 522
        //     };
        //     pdf.fromHTML(source, margins.left, margins.top, { 'width': margins.width, 'elementHandlers': specialElementHandlers },
        //         function (dispose) { pdf.save('Test.pdf'); }, margins);
        // }

        //$scope.generatePDF = function (print) {
            // $scope.printthis=true;
            // kendo.drawing.drawDOM($("#print"), {
            //     allPages: true,
            //     avoidLinks: true,
            //     paperSize: "letter",
            //     margin: { top: "0.5cm", left: "1.0cm", right: "1.0cm", bottom: "0.5cm" },
            //     portrait: true,
            //     repeatHeaders: true,
            //     multiPage: true,
            //     scale: 0.5
            // }).then(function (group) {
            //     kendo.drawing.pdf.saveAs(group, "MonthlyFeesCollection" + ".pdf");
            //     $timeout(function () {
            //         $scope.printthis = false;
            //     }, 100);
                 
            // });
           
       // };
                $scope.generatePDF = function (print) {
                    $scope.printthis = true;
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
                        kendo.drawing.pdf.saveAs(group, 'MonthlyFeesCollection' + '.pdf'); //jshint ignore : line
                        $timeout(function () {
                            $scope.printthis = false;
                        }, 3);

                    });
                };
        //vm.exportToExcel = function () {
            // var blob = new Blob([document.getElementById('export').innerHTML], {
            //     type: 'application/vnd.ms-excel;charset=charset=utf-8'
            //     // type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            // });
           // saveAs(blob, "MonthlyFeesCollection.xls");
        //};

        vm.exportToExcel = function () {
            var blob = new Blob([document.getElementById('export').innerHTML], {
                type: 'application/vnd.ms-excel;charset=charset=utf-8'
            });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.download = 'MonthlyFeesCollection.xls';
            a.href = url;
            a.textContent = 'MonthlyFeesCollection.xls';
            a.click();
            //saveAs(blob, 'DailyFeesCollection.xls');
        };

        activate();

        function activate() {
            var promises = [getAllMonth()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }




        function getAllMonth() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return studentAtdReportSettingsService.getMonths()
                .then(function (data) {
                    vm.months = data;
                });
        }




    }
})();
