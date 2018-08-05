(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('customCodeService', customCodeService);

    customCodeService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function customCodeService($http, $q, logger, apiConfig) {
        var service = {
            getAll: getAll,
            getMasterList: getMasterList,
            getDetailsByID: getDetailsByID,
            setCustomCode: setCustomCode,
            postMasterDetail: postMasterDetail,
            deleteByID: deleteByID
        };

        return service;        
               

        //**********----Get All Record----***************
        function getMasterList(apiRoute, params) {
            return $http.post(apiRoute, params);
        }

        function getAll(apiRoute, InstituteID, loggedUser) {
            var urlGet = apiRoute + InstituteID + '/' + loggedUser;
            return $http.get(urlGet);
        }
        //************ Get Details  By ID  *************************
        function getDetailsByID(apiRoute, params) {
            return $http.post(apiRoute, params);
        }
        //**********----Get Single Record----***************
        
        //**********----Create New Record----***************
        function setCustomCode(params) {

            return $http.post(apiConfig.host + '/setCustomCode', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function deleteByID(apiRoute) {
            return $http.get(apiRoute);
        }

        //************** Post Master Details  ************
        function postMasterDetail(apiRoute, modelMaster, modelDetails) {
            var strFinal = '[' + JSON.stringify(modelMaster) + ',' + JSON.stringify(modelDetails) + ']';
            var request = $http({
                method: 'post',
                url: apiRoute,
                data: strFinal, //{ modelMaster: modelMaster, modelDetails: modelDetails }
                dataType: 'json',
                contentType: 'application/json'
            });
            return request;
        }

    }
})();
