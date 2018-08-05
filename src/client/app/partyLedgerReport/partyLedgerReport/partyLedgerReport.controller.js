(function () {
    'use strict';

    angular
        .module('app.partyLedgerReport')
        .controller('PartyLedgerReportController', PartyLedgerReportController);

    PartyLedgerReportController.$inject = ['teacherAttendanceSevice', 'commonService', 'journalService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function PartyLedgerReportController(teacherAttendanceSevice, commonService, journalService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

        var vm = this;
        $scope.InstituteName = $localStorage.userInfo[0].InstituteName;
        // Create and Show list Container Hide or Show Logic
        $scope.createItem = true;
        $scope.printthis = true;
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };
        $scope.printBTn = false;
        $scope.pdfBTn = false;

        //========================
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


//====================================


        activate();

        function activate() {
            var promises = [getInsBranchDdl(), getFiscalYear(), loadPartyList(), loadCOAList()];
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

        function loadCOAList() {

            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return journalService.getCOAList()
                .then(function (data) {
                    vm.COAList = data;
                });
        }

        function loadPartyList() {

            //Generate Token API Pass Call
           // authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            return journalService.getPartyList()
                .then(function (data) {
                    vm.UserList = data;
                });
        }





     


    }
})();
