
//**********************************************Angular Frameworks************************************************************************************* */
(function () {
    'use strict';

    angular
        .module('app.MonthlyDueList')
        .controller('MonthlyDueController', MonthlyDueController);

    MonthlyDueController.$inject = ['FineService', 'studentAtdReportSettingsService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    function MonthlyDueController(FineService, studentAtdReportSettingsService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {
      

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
                    var promises = [getAllMonth()];
                    return $q.all(promises).then(function () {
                    });
                }

        //************************************************************ Declaration + Initialization ************************************************************************************* */

        $scope.hideList = function () {
            $scope.showItem = false;
            $scope.createItem = true;
        };


        $scope.showItem = false;
        $scope.createItem = true;
        $scope.total = 0;
        $scope.report=false;
        $scope.today = new Date().toJSON().slice(0,10).replace(/-/g,'/');
      
        //**********************************************************Load Section************************************************************************************* */




       


        function loadDue() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var params = {
                MonthID: vm.mon.selected.MonthID,
                InstituteID: $localStorage.userInfo[0].InstituteID
            };
            FineService.getDue(params)
                .then(function (data) {
                    vm.Due = data;

                    for (var i = 0; i < data.length; i++) {

                        $scope.total += data[i].Due;
                    }
              
                });
        }


        function getAllMonth() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            return studentAtdReportSettingsService.getMonths()
                .then(function (data) {
                    vm.months = data;
                });
        }

        //**********************************************************HTML Show/Hide ************************************************************************************* */
        $scope.itemEvent = function () {
            $scope.showItem = true;
            $scope.createItem = true;
            loadDue();
        };

        $scope.listEvent = function () {
            $scope.showItem = false;
            $scope.createItem = true;
            clear();
        };




        //vm.exportToPDF = function (print) {
            //var pdf = new jsPDF('p', 'pt', 'a0');           
           // var pdf = new jsPDF('p', 'pt', 'a1');   
        //    var pdf = new jsPDF('p', 'pt', 'a1');  
        //     pdf.setFont('courier');
        //     pdf.setFontType('bolditalic');
        //      var source = document.getElementById(print).innerHTML; //$('#print')[0];
        //     var specialElementHandlers = {
        //         '#bypassme': function (element, renderer) {
        //             return true;
        //         }
        //     };
        //     var margins = {
        //         top: 80,
        //         bottom: 60,
        //         left: 50,
        //         width: 522
        //     };

        //     pdf.fromHTML(
        //         source, // HTML string or DOM elem ref.
        //         margins.left, // x coord
        //         margins.top, { // y coord
        //             'width': margins.width,
        //             'elementHandlers': specialElementHandlers
        //         },
        //         function (dispose) {                    
        //             pdf.save('demo.pdf');
        //         }, margins
        //     );    
        //};
        $scope.generatePDF = function (print) {
            $scope.report = true;
            kendo.drawing.drawDOM($('#print'), {  //jshint ignore : line
                allPages: true,
                avoidLinks: true,
                paperSize: 'letter',
                margin: { top: '0.5cm', left: '0.1cm', right: '0.0cm', bottom: '0.5cm' },
                portrait: true,
                repeatHeaders: true,
                multiPage: true,
                scale: 0.5
            }).then(function (group) {
                kendo.drawing.pdf.saveAs(group, 'MonthlyDue' + '.pdf'); //jshint ignore : line
                $timeout(function () {
                    $scope.report = false;
                }, 3);

            });
        };




        vm.printDiv = function (print) {
       

                var content = document.getElementById(print).innerHTML;
                var mywindow = window.open('', 'Print', 'height=1000,width=2000');
    
                mywindow.document.write('<html><head><title>OnEms</title>');
                mywindow.document.write('</head><body >');
                mywindow.document.write(content);
                mywindow.document.write('</body> <br/><br/>');
                  mywindow.document.write('<footer> <br/><br/><font color="green">Powered By:</font><font color="blue"> onAir International Ltd. </font></footer>');
                    mywindow.document.write('</html>');
    
    
                mywindow.document.close();
                mywindow.focus();
                mywindow.print();
                mywindow.close();
                return true;
            };



     


        //vm.exportToExcel = function () {
            // var blob = new Blob([document.getElementById('print').innerHTML], {
            //     type: 'application/vnd.ms-excel;charset=charset=utf-8'
            //     // type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            // });
            // saveAs(blob, 'Report.xls');
        //};

        vm.exportToExcel = function () {
            var blob = new Blob([document.getElementById('ExcelGenerate').innerHTML], {
                type: 'application/vnd.ms-excel;charset=charset=utf-8'
            });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.download = 'MonthlyDue.xls';
            a.href = url;
            a.textContent = 'MonthlyDue.xls';
            a.click();
            //saveAs(blob, 'DailyFeesCollection.xls');
        };

       





        //**********************************************************CRUD************************************************************************************* */
        vm.AddFine = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            FineService.SaveFine({
                InsFineID: 0,
                FineHead: vm.Fine.selected.FineHead,
                FineHeadID: vm.Fine.selected.FineHeadID,
                FineAmount: vm.FineSetup.FineAmount,
                MinimumDays: vm.FineSetup.minDays,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                isActive: 1,

                CreateBy: 0,
                CreateOn: '2017-10-10',
                CreatePc: 'Apple',
                UpdateBy: 'NULL',
                UpdateOn: '2017-10-10',
                UpdatePc: 'Apple',
                IsDeleted: 0,
                DeleteBy: 'NULL',
                DeleteOn: '2017-10-10',
                DeletePc: 'Apple'



            })
                .then(function (data) {

                    if (data[0].ReturnValue === 'Duplicate') {
                        logger.error('This name Already exists...');
                       
                        clear();
                    }
                    else {
                        logger.info('Saved Successfully!');
                      
                        clear();
                    }
                })
                .catch(function (error) { });
        };





        vm.updateFine = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            FineService.UpdateFine({

                InsFineID: vm.FineSetup.classID,
                FineHead: vm.Fine.selected.FineHead,
                FineHeadID: vm.Fine.selected.FineHeadID,
                FineAmount: vm.FineSetup.FineAmount,
                MinimumDays: vm.FineSetup.minDays,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                isActive: 1,


                CreateBy: 0,
                CreateOn: '2017-10-10',
                CreatePc: 'Apple',
                UpdateBy: 'NULL',
                UpdateOn: '2017-10-10',
                UpdatePc: 'Apple',
                IsDeleted: 0,
                DeleteBy: 'NULL',
                DeleteOn: '2017-10-10',
                DeletePc: 'Apple'


            })
                .then(function (data) {
                    if (data[0].ReturnValue === 'Duplicate') {
                        logger.error('This name Already exists...');
                        
                        clear();

                    }
                    else {
                        logger.info('Updated Successfully!');
                       
                        clear();
                    }
                    // window.onload = setTimeout("location.reload(true);", 1500);
                    //$state.transitionTo('deliverypartner.listpartner');
                })
                .catch(function (error) { });
        };


        vm.deleteFine = function (classID) {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var classParam = {
                classID: classID
            };
            FineService.deleteFineByID(classParam)
                .then(function (data) {
                    vm.Fine = data;
                });
        };

        //**********************************************************Clear/Reset************************************************************************************* */

        $scope.clearField = function () {
            clear();
        };

        function clear() {
            $state.go($state.current.name, {}, { reload: true });
        }

    }
})();
