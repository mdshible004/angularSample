(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('yearlyFeeGenerationService', yearlyFeeGenerationService);

        yearlyFeeGenerationService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function yearlyFeeGenerationService($http, $q, logger, apiConfig) {
        var service = {
            
            getInsYearlyFees:getInsYearlyFees,
            postInsYearlyFees: postInsYearlyFees,
            getInsYearlyFeesMasterID: getInsYearlyFeesMasterID
                     
        };

        return service;

        function getInsYearlyFees(params) {
            
            return $http.get(apiConfig.host+'/getInsYearlyFees/'+params.InstituteID +'/'+params.ShiftID+'/'+params.MediumID+'/'+params.ClassID+'/'+params.DepartmentID+'/'+params.MonthID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

        function getInsYearlyFeesMasterID(params) {

            return $http.get(apiConfig.host + '/getInsYearlyFeesMasterID/' + params.InstituteID + '/' + params.ShiftID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.DepartmentID + '/' + params.MonthID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function postInsYearlyFees(params) {
            
            return $http.post(apiConfig.host+'/setInsYearlyFeesMasterDetail',params)
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
