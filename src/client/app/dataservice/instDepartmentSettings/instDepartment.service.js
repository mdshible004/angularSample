(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('instDepartmentSettings', instDepartmentSettings);

        instDepartmentSettings.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function instDepartmentSettings($http, $q, logger, apiConfig) {
        var service = {
            getAllDepartment:getAllDepartment,
            getAllDepartmentById:getAllDepartmentById,
            postInsDepartmentInformation:postInsDepartmentInformation
        };

        return service;

        
        function postInsDepartmentInformation(params) {
            
            return $http.post(apiConfig.host+'/setInsDepartment',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllDepartment() {
            
            return $http.get(apiConfig.host+'/getDepartment')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllDepartmentById(params) {
            
            return $http.get(apiConfig.host+'/getDepartmentById/'+params.insID,params)
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
