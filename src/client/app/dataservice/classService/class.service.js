(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('classSettings', classSettings);

    classSettings.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function classSettings($http, $q, logger, apiConfig) {
        var service = {
            getInstituteCatagory:getInstituteCatagory,
            postClassInformation : postClassInformation,
            getAllClasses : getAllClasses,
            getClassByID : getClassByID,
            getAllBoard:getAllBoard,
            getClassRoutineByID : getClassRoutineByID,
            postClassRoutineMasterDetail : postClassRoutineMasterDetail
        };

        return service;

        function getInstituteCatagory() {
            
            return $http.get(apiConfig.host+'/getInstitute')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function postClassInformation(params) {
            
            return $http.post(apiConfig.host+'/setClass',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllClasses() {
            
            return $http.get(apiConfig.host+'/getAllClasses')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getClassByID(params) {
            
            return $http.get(apiConfig.host+'/getClassByID/'+params.classID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllBoard() {
            
            return $http.get(apiConfig.host+'/getAllBoard')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        } 
        function getClassRoutineByID(params) {
            
            return $http.get(apiConfig.host+'/getClsClassRoutineById/'+params.shiftID+'/'+params.midID+'/'+params.classID+'/'+params.sectionID+'/'+params.departmentID+'/'+params.insID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

        function postClassRoutineMasterDetail(params) {
            
            return $http.post(apiConfig.host+'/setClsClassRoutineMasterDetail',params)
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
