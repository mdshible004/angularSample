
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('gradeSettingsSevice', gradeSettingsSevice);

        gradeSettingsSevice.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function gradeSettingsSevice($http, $q, logger, apiConfig) {
        var service = {
            getCmnGrade:getCmnGrade,
            setCmnGrade:setCmnGrade,
            getGradeById:getGradeById,
            deleteGrade:deleteGrade
            
        };

        return service;

        
        function getCmnGrade() {
            
            return $http.get(apiConfig.host+'/getCmnGrade')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
     
        function setCmnGrade(params) {
            
            return $http.post(apiConfig.host+'/postCmnGrade',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

        function getGradeById(params) {
            
            return $http.get(apiConfig.host+'/getCmnGradeById/'+params.GradeID,params)
            .then(success)
            .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
            
        }
         function deleteGrade(params) {
            
            return $http.post(apiConfig.host+'/deleteCmnGrade',params)
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

