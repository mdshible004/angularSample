(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('experienceListSettings', experienceListSettings);

        experienceListSettings.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function experienceListSettings($http, $q, logger, apiConfig) {
        var service = {
            postexperienceList:postexperienceList,
            getAllExperienceList:getAllExperienceList,
            getExperienceListByID:getExperienceListByID,
            deleteExperience:deleteExperience
			
        };

        return service;

		function postexperienceList(params) {
            
            return $http.post(apiConfig.host+'/setExperienceList',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllExperienceList() {
            
            return $http.get(apiConfig.host+'/getExperienceList')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getExperienceListByID(params) {
            
            return $http.get(apiConfig.host+'/getExperienceListByID/'+params.experiencelistID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
         function deleteExperience(params) {
            
            return $http.post(apiConfig.host+'/deleteExperienceList',params)
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
