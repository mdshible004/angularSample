
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('subjectSettingsSevice', subjectSettingsSevice);

        subjectSettingsSevice.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function subjectSettingsSevice($http, $q, logger, apiConfig) {
        var service = {
            getCmnSubject:getCmnSubject,
            getSubjectByParms:getSubjectByParms,
            postInsSubject: postInsSubject,
            getClassWiseDepartmentDDL: getClassWiseDepartmentDDL,
            getMediumWiseClassDDL: getMediumWiseClassDDL
            
            
        };

        return service;

        
        function getCmnSubject() {
            
            return $http.get(apiConfig.host+'/getCmnSubject')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getSubjectByParms(params) {
            
            return $http.get(apiConfig.host+'/getSubjectByParms/'+params.InstituteID+'/'+params.DepartmentID+'/'+params.MediumID+'/'+params.ClassID,params)
            .then(success)
            .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
            
        }

        function getClassWiseDepartmentDDL(params) {

            return $http.get(apiConfig.host + '/ClassWiseDepartmentDDL/' + params.InstituteID + '/' + params.ClassID + '/' + params.MediumID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getMediumWiseClassDDL(params) {

            return $http.get(apiConfig.host + '/MediumWiseClassDDL/' + params.InstituteID + '/' + params.MediumID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function postInsSubject(params) {
            
            return $http.post(apiConfig.host+'/postSubject',params)
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

