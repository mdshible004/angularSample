
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('daySettingsSevice', daySettingsSevice);

        daySettingsSevice.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function daySettingsSevice($http, $q, logger, apiConfig) {
        var service = { 
            getAllDay:getAllDay,
            postday:postday,
            getAllWeekend: getAllWeekend,
            getWeekendById:getWeekendById  ,
            deleteInsWeekend:deleteInsWeekend 
        };

        return service;

        
        function getAllDay() {
            
            return $http.get(apiConfig.host+'/getcmnDay')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllWeekend(params) {
            
            return $http.get(apiConfig.host+'/getinsweekend/'+params.wkID+'/'+params.insID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getWeekendById(params) {
            
            return $http.get(apiConfig.host+'/getAllWeekendByID/'+params.weekendID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
		}
        function postday(params) {
            
            return $http.post(apiConfig.host+'/setDay',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function deleteInsWeekend(params) {

            return $http.post(apiConfig.host + '/deleteInsWeekEnd', params)
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

