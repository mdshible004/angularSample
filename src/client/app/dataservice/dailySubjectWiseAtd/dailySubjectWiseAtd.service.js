(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('dailySubWiseAtdSettingsService', dailySubWiseAtdSettingsService);

    dailySubWiseAtdSettingsService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function dailySubWiseAtdSettingsService($http, $q, logger, apiConfig) {
        var service = {

            getInsSubjectByMidnCid: getInsSubjectByMidnCid,
            getHrmSubWiseAtdDetail: getHrmSubWiseAtdDetail,
            postAttendence: postAttendence


        };

        return service;



        function getInsSubjectByMidnCid(params) {

            return $http.get(apiConfig.host + '/getInsSubject/' + params.InsID + '/' + params.deptID + '/' + params.midID + '/' + params.classID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getHrmSubWiseAtdDetail(params) {

            return $http.get(apiConfig.host + '/getHrmSubWiseAtdDetail/' + params.insID + '/' + params.midID + '/' + params.shiftID + '/' + params.classID + '/' + params.sectionID + '/' + params.subjectID + '/' + params.deptID + '/' + params.AtdDate, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function postAttendence(params) {

            return $http.post(apiConfig.host + '/setHrmSubWiseAtd', params)
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
