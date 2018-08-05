(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('mediumsetting', mediumsetting);

        mediumsetting.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function mediumsetting($http, $q, logger, apiConfig) {
        var service = {
            postmedium:postmedium,
            getAllMediums:getAllMediums,
            getMediumByID:getMediumByID,
            deleteMedium:deleteMedium
			
        };

        return service;

		function postmedium(params) {
            
            return $http.post(apiConfig.host+'/setmedium',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllMediums() {
            
            return $http.get(apiConfig.host+'/getMedium')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getMediumByID(params) {
            
            return $http.get(apiConfig.host+'/getMediumByID/'+params.mediumID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
         function deleteMedium(params) {
            
            return $http.post(apiConfig.host+'/deleteMedium',params)
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
