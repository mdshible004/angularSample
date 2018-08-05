
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('branchSettingsSevice', branchSettingsSevice);

        branchSettingsSevice.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function branchSettingsSevice($http, $q, logger, apiConfig) {
        var service = {
            getInsBranch:getInsBranch,
            getInstituteName:getInstituteName,
            postInsBranch:postInsBranch,
            getBranchById:getBranchById,
            getBranchByInstituteId : getBranchByInstituteId,
            getBranchB : getBranchB,
            getBranchByBranchID: getBranchByBranchID,
            deleteInsBranches: deleteInsBranches,
            getAllBranchUI: getAllBranchUI
            
        };

        return service;

        
        function getInsBranch() {
            
            return $http.get(apiConfig.host+'/getInsBranch')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getInstituteName() {
            
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
        function postInsBranch(params) {
            
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
        function getAllBranchUI(params) {

            return $http.post(apiConfig.host + '/getAllbranchUI', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getBranchById(params) {
            
            return $http.get(apiConfig.host+'/getBranchByID/'+params.Insid+'/'+params.BrunchID,params)
            .then(success)
            .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
            
        }
        function getBranchB() {
            
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
       
        function getBranchByInstituteId(params) {
            
            return $http.get(apiConfig.host+'/getBranchByInsID/'+params.instituteId,params)
            .then(success)
            .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
            
        }
        function getBranchByBranchID(params) {
            
            return $http.get(apiConfig.host+'/getBranchByBranchID/'+params.Branchid,params)
            .then(success)
            .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
            
        }
          function deleteInsBranches(params) {
            
            return $http.post(apiConfig.host+'/deleteInsBranch',params)
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

