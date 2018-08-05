(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('insShiftSettings', insShiftSettings);

        insShiftSettings.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function insShiftSettings($http, $q, logger, apiConfig) {
        var service = {
            getAllInsShift:getAllInsShift,
            getAllInsShiftById:getAllInsShiftById,
            postInsShift:postInsShift
        };

        return service;

        
        function postInsShift(params) {
            
            return $http.post(apiConfig.host+'/setInsShift',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllInsShift() {
            
            return $http.get(apiConfig.host+'/getInsShift')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllInsShiftById(params) {
            
            return $http.get(apiConfig.host+'/getInsShiftById/'+params.insID,params)
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
