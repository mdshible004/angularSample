(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('designationSettings', designationSettings);

        designationSettings.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function designationSettings($http, $q, logger, apiConfig) {
        var service = {
            postDesignation:postDesignation,
            getAllDesignations:getAllDesignations,
            getDesignationByID:getDesignationByID,
            deleteUserDesignation: deleteUserDesignation,
            getAllDesignation: getAllDesignation
           
        };

        return service;

		function postDesignation(params) {
            
            return $http.post(apiConfig.host+'/setUserDesignation',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllDesignations() {
            
            return $http.get(apiConfig.host+'/getUserDesignation')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getDesignationByID(params) {
            
            return $http.get(apiConfig.host+'/getUserDesignationByID/'+params.UserDesignationID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function deleteUserDesignation(params) {

            return $http.post(apiConfig.host + '/deleteDesignation', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getAllDesignation(params) {

            return $http.post(apiConfig.host + '/getDesignation', params)
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
