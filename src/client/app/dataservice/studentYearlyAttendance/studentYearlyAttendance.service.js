
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('studentYearlyAttendanceService', studentYearlyAttendanceService);

    studentYearlyAttendanceService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function studentYearlyAttendanceService($http, $q, logger, apiConfig) {
        var service = {
            GetAllStudentsByParams: GetAllStudentsByParams,
            getPreviousDue: getPreviousDue

        };

        return service;


        function GetAllStudentsByParams(params) {
            //debugger
            return $http.get(apiConfig.host + '/GetAllStudentsByParams/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.DepertmentID + '/' + params.SectionID ,params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getPreviousDue(params) {

            return $http.get(apiConfig.host + '/getPreviousDue/' + params.instituteID + '/' + params.shiftID + '/' + params.depertmentID + '/' + params.mediumID + '/' + params.classID + '/' + params.studentID + '/' + params.monthID)
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


