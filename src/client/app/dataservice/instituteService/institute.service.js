(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('instituteSettings', instituteSettings);

        instituteSettings.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function instituteSettings($http, $q, logger, apiConfig) {
        var service = {
            getBoards:getBoards,
            getStatus:getStatus,
            postInstituteInformation:postInstituteInformation,
            getAllInsInstitute:getAllInsInstitute,
            getInsInstituteByID:getInsInstituteByID,
            deleteInstitute: deleteInstitute,
            getInstituteTypes: getInstituteTypes,
            getInstituteForUI: getInstituteForUI,
            postInsInstituteSMSOrder: postInsInstituteSMSOrder,
            getInsInstituteSMSOrder: getInsInstituteSMSOrder,
            getinsInstituteSMSOrderByOrderID: getinsInstituteSMSOrderByOrderID,
            getinsInstituteSMSBodyByInsId: getinsInstituteSMSBodyByInsId

            };

        return service;

        function getBoards() {
            
            return $http.get(apiConfig.host+'/getallboard')
            .then(success)
            .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }
        function getInstituteTypes() {
            //debugger
            return $http.get(apiConfig.host + '/getInstituteType')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        } 
        function getStatus() {
            
            return $http.get(apiConfig.host+'/getAllStatus')
            .then(success)
            .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        } 
        function postInstituteInformation(params) {
            
            return $http.post(apiConfig.host+'/setinsInstitute',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getInstituteForUI(params) {

            return $http.post(apiConfig.host +'/GetInstituteForUI', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getAllInsInstitute() {
            
            return $http.get(apiConfig.host+'/getAllInstitute')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
         }
        function getInsInstituteByID(params) {
            
            return $http.get(apiConfig.host+'/getInstituteByID/'+params.instituteID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }  

        function deleteInstitute(params) {
            
            return $http.post(apiConfig.host+'/deleteInstitute',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

        function postInsInstituteSMSOrder(params) {

            return $http.post(apiConfig.host + '/setinsInstituteSMSOrder', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getInsInstituteSMSOrder(params) {

            return $http.get(apiConfig.host + '/getinsInstituteSMSOrder/' + params.instituteID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getinsInstituteSMSOrderByOrderID(params) {

            return $http.get(apiConfig.host + '/getinsInstituteSMSOrderByOrderID/' + params.instituteID + '/' + params.SMSOrderID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getinsInstituteSMSBodyByInsId(params) {

            return $http.get(apiConfig.host + '/getinsInstituteSMSBody/' + params.SMSSetupId + '/' + params.insId, params)
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
