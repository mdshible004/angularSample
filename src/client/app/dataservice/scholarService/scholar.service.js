(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('ScholarService', ScholarService);

    ScholarService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function ScholarService($http, $q, logger, apiConfig) {
        var service = {

            setScholarShip: setScholarShip,
            getScholarship: getScholarship,
            deleteScholarship: deleteScholarship,
            getAllStudentsForScholarship: getAllStudentsForScholarship
        };

        return service;


        function getAllStudentsForScholarship(params) {
            //debugger
            return $http.get(apiConfig.host + '/getAllStudentsForScholarship/' + params.instituteID + '/' + params.shiftID + '/' + params.mediumID + '/' + params.classID + '/' + params.sectionID + '/' + params.depertmentID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function setScholarShip(params) {

            return $http.post(apiConfig.host + '/setInsScholarship', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        //:shid/:Mid/:cid/:secid/:uid
        function getScholarship(params) {
            //debugger;
            return $http.post(apiConfig.host + '/getAllScholarship', params)
                .then(success)
                .catch(fail);
            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }



        function deleteScholarship(params) {
            return $http.get(apiConfig.host + '/deleteScholarshipByID/' + params.ScholarshipID, params)
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
