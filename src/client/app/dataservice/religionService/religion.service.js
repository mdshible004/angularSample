(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('religionService', religionService);

        religionService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function religionService($http, $q, logger, apiConfig) {
        var service = {
            postReligionSettings:postReligionSettings,
            getAllReligion:getAllReligion,
            getReligionById :getReligionById,
            deleteReligion:deleteReligion
        };

        return service;

		function postReligionSettings(params) {
            
            return $http.post(apiConfig.host+'/setReligion',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
		}

        function getAllReligion() {
            
            return $http.get(apiConfig.host+'/getReligion')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        
        function getReligionById(params) {
            
            return $http.get(apiConfig.host+'/getReligionByID/'+params.religionID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        } 
         function deleteReligion(params) {
            
            return $http.post(apiConfig.host+'/deleteReligion',params)
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
