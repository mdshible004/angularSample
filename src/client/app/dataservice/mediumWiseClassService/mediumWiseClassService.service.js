(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('mediumWiseClassService', mediumWiseClassService);

    mediumWiseClassService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function mediumWiseClassService($http, $q, logger, apiConfig) {
        var service = {
           getInstitute : getInstitute,
           getClassByInsID : getClassByInsID,
           getSectionByID : getSectionByID,
           postClass : postClass,
           getUserbyTypeId: getUserbyTypeId,
           getMedWiseClass: getMedWiseClass,
           postMidWiseClass: postMidWiseClass
        };

        return service;


        function getMedWiseClass(params) {

            return $http.get(apiConfig.host + '/spGetMediumWiseClass/' + params.InstituteID + '/' + params.MediumID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function postMidWiseClass(params) {

            return $http.post(apiConfig.host + '/setMidWiseClass', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

		  function getInstitute() {
            
            return $http.get(apiConfig.host+'/getAllInstitute')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getClassByInsID(params) {
            
            return $http.get(apiConfig.host+'/getClassByInsID/'+params.insID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getSectionByID(params) {
            
            return $http.get(apiConfig.host+'/getSectionByID/'+params.clID+'/'+params.insID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
             function postClass(params) {
            
            return $http.post(apiConfig.host+'/setClassAndSection',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
          function getUserbyTypeId(params) {
            
            return $http.get(apiConfig.host+'/getUserByUserTypeId/'+params.uId+'/'+params.insID,params)
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
