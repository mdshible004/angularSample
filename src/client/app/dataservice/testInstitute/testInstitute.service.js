
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('testInstitute', testInstitute);

        testInstitute.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function testInstitute($http, $q, logger, apiConfig) {
        var service = {
            getAllInstituite : getAllInstituite,
            setTestDesignation : setTestDesignation,
            getAllDesignation : getAllDesignation,
            getDesignationById : getDesignationById
        };

        return service;

        function getAllInstituite() {
            
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
        
        function setTestDesignation(params) {
            
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
        
        function getAllDesignation() {
            
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

        function getDesignationById(params) {
            
            return $http.get(apiConfig.host+'/getUserDesignationByID/'+params.designationsID,params)
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

