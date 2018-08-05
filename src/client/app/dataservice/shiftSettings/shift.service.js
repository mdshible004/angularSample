(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('shiftSettings', shiftSettings);

        shiftSettings.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function shiftSettings($http, $q, logger, apiConfig) {
        var service = {
            postShiftInformation:postShiftInformation,
            getAllShift:getAllShift,
            getAllShiftByID:getAllShiftByID,
            deleteShift:deleteShift

            
        };

        return service;

        
        function postShiftInformation(params) {
            
            return $http.post(apiConfig.host+'/setShift',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllShift() {
            
            return $http.get(apiConfig.host+'/getShift')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllShiftByID(params) {
            
            return $http.get(apiConfig.host+'/getShiftById/'+params.ShiftID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        } 
         function deleteShift(params) {
            
            return $http.post(apiConfig.host+'/deletecmnShift',params)
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
