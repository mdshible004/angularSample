(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('mailSettings', mailSettings);

        mailSettings.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function mailSettings($http, $q, logger, apiConfig) {
        var service = {
            getAllmails:getAllmails,
            getAllInstitutes:getAllInstitutes,
            postMailInformation:postMailInformation,
            getallMailInformation:getallMailInformation,
            getMailId:getMailId,
            deleteinsMail: deleteinsMail,
            getAllMailUI: getAllMailUI
            
        
        };

        return service;


        function getAllmails() {
            
            return $http.get(apiConfig.host+'/getallmail')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        } 
        function getAllInstitutes() {
            
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
        function postMailInformation(params) {
            
            return $http.post(apiConfig.host+'/setMail',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllMailUI(params) {

            return $http.post(apiConfig.host + '/getInsMailUI', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getallMailInformation() {
            
            return $http.get(apiConfig.host+'/getMail')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getMailId(params) {
            
            return $http.get(apiConfig.host+'/getMailById/'+params.InsMailSetupID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        // function getCityById(params) {
            
        //     return $http.get(apiConfig.host+'/getCityById/'+params.cityID,params)
        //     .then(success)
        //     .catch(fail);

		// 	function success(response) {
		// 		return response.data;
		// 	}

		// 	function fail(error) {
		// 		return $q.reject(error);
		// 	}
            
        // }


        
        // function postAdressInformation(params) {
            
        //     return $http.post(apiConfig.host+'/setAdress',params)
        //     .then(success)
        //     .catch(fail);

		// 	function success(response) {
		// 		return response.data;
		// 	}

		// 	function fail(error) {
		// 		return $q.reject(error);
		// 	}
            
        // }
        function deleteinsMail(params) {
        
        return $http.post(apiConfig.host+'/deleteInsMail',params)
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
