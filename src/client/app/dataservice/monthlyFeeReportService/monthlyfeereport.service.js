(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('monthlyFeeReportService', monthlyFeeReportService);

        monthlyFeeReportService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function monthlyFeeReportService($http, $q, logger, apiConfig) {
        var service = {
            getMonthlyFeeReport:getMonthlyFeeReport
        };

        return service;





		function getMonthlyFeeReport(params) {
            
            return $http.get(apiConfig.host+'/getMonthlyfeesReport/'+params.MonthID+'/'+params.instituteID,params)
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