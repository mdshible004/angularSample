(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('ClassTestService', ClassTestService);

    ClassTestService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function ClassTestService($http, $q, logger, apiConfig) {
        var service = {
            //getAllDepartment: getAllDepartment,
            //getAllDepartmentById: getAllDepartmentById,
            setInsExamCT: setInsExamCT,
            getAcademicClassDayForCT: getAcademicClassDayForCT,
            getDeclareCTList: getDeclareCTList,
            getCTListDDL: getCTListDDL,
            getAllStudentsByParamsForCT: getAllStudentsByParamsForCT,
            setInsExamCTMarks: setInsExamCTMarks,
            getCTMarksByID: getCTMarksByID
        };

        return service;

        function getAcademicClassDayForCT(params) {

            return $http.get(apiConfig.host + '/getAcademicClassDayForCT/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.DepartmentID + '/' + params.SectionID + '/' + params.SubjectID + '/' + params.ExamID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getCTListDDL(params) {

            return $http.get(apiConfig.host + '/getCTListDDL/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.DepartmentID + '/' + params.SectionID + '/' + params.SubjectID + '/' + params.ExamID + '/' + params.SessionID + '/' + params.BoardID + '/' + params.BrunchID + '/' + params.ShiftID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getAllStudentsByParamsForCT(params) {

            return $http.get(apiConfig.host + '/getAllStudentsByParamsForCT/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.DepartmentID + '/' + params.SectionID + '/' + params.SessionID + '/' + params.BranchID + '/' + params.BoardID + '/' + params.ShiftID + '/' + params.InsCTID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }


        function setInsExamCT(params) {

            return $http.post(apiConfig.host + '/setInsExamCT', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function setInsExamCTMarks(params) {

            return $http.post(apiConfig.host + '/setInsExamCTMarks', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getDeclareCTList() {

            return $http.get(apiConfig.host + '/getDeclareCTList')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getCTMarksByID(params) {

            return $http.get(apiConfig.host + '/getCTMarksByID/' + params.InsCTID, params)
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
