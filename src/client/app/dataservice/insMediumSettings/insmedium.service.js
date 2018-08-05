(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('insmediumsetting', insmediumsetting);

        insmediumsetting.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function insmediumsetting($http, $q, logger, apiConfig) {
        var service = {
            postinsmedium:postinsmedium,	
            getAllMediums:getAllMediums,
            getInstituteId:getInstituteId
        };

        return service;

		function postinsmedium(params) {
            
            return $http.post(apiConfig.host+'/setinsMedium',params)
            .then (success)
            .catch (fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

        function getAllMediums(params) {
            
            return $http.get(apiConfig.host+'/getinsMedium/'+params.insID,params)
            .then (success)
            .catch (fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getInstituteId() {
            
            return $http.get(apiConfig.host+'/getInstituteName')
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