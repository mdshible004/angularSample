(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('homeWorkEntry', homeWorkEntry);

    homeWorkEntry.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function homeWorkEntry($http, $q, logger, apiConfig) {
        var service = {
           
            postHomeWork: postHomeWork,
            getInsHomeWork: getInsHomeWork,
            getHomeWorkByID: getHomeWorkByID,
            getMyInsHomeWork: getMyInsHomeWork,
            getMyInsHomeWorkDetail: getMyInsHomeWorkDetail
           
        };
       
        return service;
        
        function postHomeWork(params) {

            return $http.post(apiConfig.host + '/setHomeWork', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }
       
        function getInsHomeWork(params) {

            return $http.get(apiConfig.host + '/getInsHomeWork/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.DepartmentID + '/' + params.SectionID + '/' + params.SubjectID + '/' + params.ShiftID + '/' + params.HomeWorkDate)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getMyInsHomeWork(params) {

            return $http.get(apiConfig.host + '/getMyInsHomeWork/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.DepartmentID + '/' + params.SectionID + '/' + params.ShiftID + '/' + params.HomeWorkDate)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getHomeWorkByID(params) {

            return $http.get(apiConfig.host + '/getHomeWorkByID/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.DepartmentID + '/' + params.SectionID + '/' + params.SubjectID + '/' + params.Date )
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getMyInsHomeWorkDetail(params) {

            return $http.get(apiConfig.host + '/getMyInsHomeWorkDetail/' + params.HomeWorkID,params)
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
