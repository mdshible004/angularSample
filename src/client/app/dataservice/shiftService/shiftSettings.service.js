
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('shiftSettingsSevice', shiftSettingsSevice);

        shiftSettingsSevice.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function shiftSettingsSevice($http, $q, logger, apiConfig) {
        var service = {
            setCmnShift:setCmnShift,
            getCmnShift:getCmnShift,
            getShiftById:getShiftById
            
        };

        return service;

        
        function getCmnShift() {
            
            return $http.get(apiConfig.host+'/getCmnShift')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
     
        function setCmnShift(params) {
            
            return $http.post(apiConfig.host+'/postCmnShift',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

        function getShiftById(params) {
            
            return $http.get(apiConfig.host+'/getCmnShiftById/'+params.ShiftID,params)
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

