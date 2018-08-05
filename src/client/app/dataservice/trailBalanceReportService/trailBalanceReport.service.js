(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('trailBalanceReport', trailBalanceReport);

    trailBalanceReport.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function trailBalanceReport($http, $q, logger, apiConfig) {
        var service = {
           
            getTrailBalance: getTrailBalance,
            getBalanceSheet: getBalanceSheet,
            getIncomeStatementReport: getIncomeStatementReport,
            getvoucherReport:getvoucherReport

        };

        return service;

        

        function getTrailBalance(params) {
           // debugger
            return $http.get(apiConfig.host + '/getTrailBalanceReport/' + params.FromDate + '/' + params.ToDate + '/' + params.InstituteID + '/' + params.BranchID + '/' + params.FiscalYearID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }





        function getBalanceSheet(params) {
           // debugger
            return $http.get(apiConfig.host + '/getBalanceSheet/' + params.FromDate + '/' + params.ToDate + '/' + params.InstituteID + '/' + params.BranchID + '/' + params.FiscalYearID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getIncomeStatementReport(params) {
            //debugger
            return $http.get(apiConfig.host + '/getIncomeStatementReport/' + params.FromDate + '/' + params.ToDate + '/' + params.InstituteID + '/' + params.BranchID + '/' + params.FiscalYearID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }
      function getvoucherReport(params) {
            //debugger
            return $http.get(apiConfig.host + '/getvoucherReport/' + params.FromDate + '/' + params.ToDate + '/' + params.InstituteID + '/' + params.BranchID + '/' + params.FiscalYearID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }




     
    }
})();
