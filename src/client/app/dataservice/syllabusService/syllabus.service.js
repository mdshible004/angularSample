
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('syllabusSevice', syllabusSevice);

    syllabusSevice.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function syllabusSevice($http, $q, logger, apiConfig) {
        var service = {
            getAcademicClassDay : getAcademicClassDay,
            setInsSyllabus : setInsSyllabus,
            getUrlTopicDetailByID : getUrlTopicDetailByID,
            getInsSyllabusMaster : getInsSyllabusMaster,
            getUrlMasterByID : getUrlMasterByID,
            getClassTopicDetailUrlByID : getClassTopicDetailUrlByID,
            getAcademicClassDayByID : getAcademicClassDayByID,
            deleteInsSyllabus: deleteInsSyllabus,
            getAcademicClassDayForMySyllabus: getAcademicClassDayForMySyllabus,
            getDateWiseLessonPlan: getDateWiseLessonPlan,
            getDateWiseLessonPlanDetail: getDateWiseLessonPlanDetail

        };

        return service;


        function getAcademicClassDay(params) {

            return $http.get(apiConfig.host + '/getAcademicClassDay/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.DepartmentID + '/' + params.SectionID + '/' + params.SubjectID + '/' + params.ExamID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getAcademicClassDayForMySyllabus(params) {

            return $http.get(apiConfig.host + '/getAcademicClassDayForMySyllabus/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.DepartmentID + '/' + params.SectionID + '/' + params.SubjectID + '/' + params.ExamID + '/' + params.FromDate + '/' + params.ToDate, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }


        function getUrlTopicDetailByID(params) {

            return $http.get(apiConfig.host + '/getUrlTopicDetailByID/' + params.SyllabusID + '/' + params.SyllabusDetailID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getUrlMasterByID(params) {

            return $http.get(apiConfig.host + '/getUrlMasterByID/' + params.SyllabusID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getAcademicClassDayByID(params) {

            return $http.get(apiConfig.host + '/getAcademicClassDayByID/' + params.InstituteID + '/' + params.SyllabusID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getClassTopicDetailUrlByID(params) {

            return $http.get(apiConfig.host + '/getClassTopicDetailUrlByID/' + params.SyllabusID + '/' + params.SyllabusDetailID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function setInsSyllabus(params) {

            return $http.post(apiConfig.host + '/setInsSyllabus', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getInsSyllabusMaster(params) {

            return $http.post(apiConfig.host + '/getInsSyllabusMaster', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function deleteInsSyllabus(params) {
            return $http.post(apiConfig.host + '/deleteInsSyllabus', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getDateWiseLessonPlan(params) {

            return $http.get(apiConfig.host + '/getDateWiseLessonPlan/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.DepartmentID + '/' + params.SectionID + '/' + params.Date)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getDateWiseLessonPlanDetail(params) {

            return $http.get(apiConfig.host + '/getDateWiseLessonPlanDetail/' + params.SyllabusDetailID, params)
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

