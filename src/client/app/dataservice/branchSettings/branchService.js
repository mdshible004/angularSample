(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('branchSettings', branchSettings);

        branchSettings.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function branchSettings($http, $q, logger, apiConfig) {
        var service = {
            postBranch:postBranch,
            getAllBranch:getAllBranch,
            getBranchByID:getBranchByID,
            getInstitute : getInstitute
			
        };

        return service;

		function postBranch(params) {
            
            return $http.post(apiConfig.host+'/setBranch',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllBranch() {
            
            return $http.get(apiConfig.host+'/getBranch')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getBranchByID(params) {
            
            return $http.get(apiConfig.host+'/getBranchByID/'+params.branchID,params)
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
