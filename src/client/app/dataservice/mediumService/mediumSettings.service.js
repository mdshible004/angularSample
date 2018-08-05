
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('mediumSettingsSevice', mediumSettingsSevice);

        mediumSettingsSevice.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function mediumSettingsSevice($http, $q, logger, apiConfig) {
        var service = {
            setCmnMedium:setCmnMedium,
            getCmnMedium:getCmnMedium,
            getMediumById:getMediumById
            
        };

        return service;

        
        function getCmnMedium() {
            
            return $http.get(apiConfig.host+'/getCmnMedium')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
     
        function setCmnMedium(params) {
            
            return $http.post(apiConfig.host+'/postCmnMedium',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

        function getMediumById(params) {
            
            return $http.get(apiConfig.host+'/getCmnMediumById/'+params.MediumID,params)
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

