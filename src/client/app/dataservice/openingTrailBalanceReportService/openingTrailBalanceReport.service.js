(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('openingTrailBalanceReport', openingTrailBalanceReport);

    openingTrailBalanceReport.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function openingTrailBalanceReport($http, $q, logger, apiConfig) {
        var service = {
           
            getOpeningTrailBalance: getOpeningTrailBalance,
            getBalanceSheet: getBalanceSheet,
            getIncomeStatementReport: getIncomeStatementReport,
            getvoucherReport:getvoucherReport


        };

        return service;

        

        function getOpeningTrailBalance(params) {
           // debugger
            return $http.get(apiConfig.host + '/getOpeningTrailBalance/' + params.FromDate + '/' + params.ToDate + '/' + params.InstituteID + '/' + params.BranchID + '/' + params.FiscalYearID, params)
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
