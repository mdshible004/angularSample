(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('dailyFeesCollectionReportService', dailyFeesCollectionReportService);

    dailyFeesCollectionReportService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function dailyFeesCollectionReportService($http, $q, logger, apiConfig) {
        var service = {

            getdailyFeesCollectionReport: getdailyFeesCollectionReport

        };

        return service;



        function getdailyFeesCollectionReport(params) {

            return $http.get(apiConfig.host + '/getDailyFeesCollectionReport/' + params.date + '/' + params.instituteID, params)
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
