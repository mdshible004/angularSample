
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('noticeSettingsSevice', noticeSettingsSevice);

    noticeSettingsSevice.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function noticeSettingsSevice($http, $q, logger, apiConfig) {
        var service = {
            setCmnMedium: setCmnMedium,
            getCmnMedium: getCmnMedium,
            postInsNotice: postInsNotice,
            getNoticeListByInsId: getNoticeListByInsId,
            DeleteNoticeListId: DeleteNoticeListId,
            SpGetInsNoticeUserList: SpGetInsNoticeUserList

        };

        return service;


        function getCmnMedium() {

            return $http.get(apiConfig.host + '/getCmnMedium')
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

            return $http.post(apiConfig.host + '/postCmnMedium', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        //function getNoticeListByInsId(params) {

        //    return $http.get(apiConfig.host + '/getNoticeListByInsID/' + params.InstituteID, params)
        //        .then(success)
        //        .catch(fail);

        //    function success(response) {
        //        return response.data;
        //    }

        //    function fail(error) {
        //        return $q.reject(error);
        //    }

        //}
        function postInsNotice(params) {

            return $http.post(apiConfig.host + '/setInsNotice', params)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }
        function getNoticeListByInsId(params) {

            return $http.post(apiConfig.host + '/getNoticeListUIGrid', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function SpGetInsNoticeUserList(params) {

            return $http.post(apiConfig.host + '/SpGetInsNoticeUserList', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function DeleteNoticeListId(params) {
           // debugger;
            return $http.post(apiConfig.host + '/deleteInsNotice', params)
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

