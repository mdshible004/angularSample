
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('userAuthenticationService', userAuthenticationService);

        userAuthenticationService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function userAuthenticationService($http, $q, logger, apiConfig) {
        var service = {
           setUserAuthentication :setUserAuthentication,
           getUserAuthenticationByInsId: getUserAuthenticationByInsId,
           deleteUserAuthentication: deleteUserAuthentication,
           getExistsParams: getExistsParams,
           getUserAuthenticationByUserID: getUserAuthenticationByUserID
        };

        return service;

     
        function setUserAuthentication(params) {
            
            return $http.post(apiConfig.host+'/setUserAuthentication',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
   //         function getUserAuthenticationByInsId(params) {
            
   //           return $http.get(apiConfig.host+'/getUserAuthentication/'+params.InsID+'/'+params.AuthID ,params)
   //         .then(success)
   //         .catch(fail);

			//function success(response) {
			//	return response.data;
			//}

			//function fail(error) {
			//	return $q.reject(error);
			//}
            
   //     }

            function getUserAuthenticationByInsId(params) {

                return $http.post(apiConfig.host + '/getUserAuthentication', params)
                    .then(success)
                    .catch(fail);

                function success(response) {
                    return response.data;
                }

                function fail(error) {
                    return $q.reject(error);
                }

        }

            function getUserAuthenticationByUserID(params) {

                return $http.post(apiConfig.host + '/spGetCmnUserAuthenticationByUserID', params)
                    .then(success)
                    .catch(fail);

                function success(response) {
                    return response.data;
                }

                function fail(error) {
                    return $q.reject(error);
                }

            }

        


          function deleteUserAuthentication(params) {
            
            return $http.post(apiConfig.host+'/deleteUserAuthentication',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
         function getExistsParams(params) {
            
            return $http.post(apiConfig.host+'/getExistingParams',params)
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

