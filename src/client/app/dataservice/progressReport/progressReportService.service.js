(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('progressReportForGrads', progressReportForGrads);

    progressReportForGrads.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function progressReportForGrads($http, $q, logger, apiConfig) {
        var service = {
           
            postExamMarks: postExamMarks,
            getSubjectWiseMarks: getSubjectWiseMarks,
            //getAllGradesForReport: getAllGradesForReport,
            getSubjectWiseMarksByStudent: getSubjectWiseMarksByStudent,
            getAllExamProgressReport: getAllExamProgressReport
        };
       
        return service;
        
        function postExamMarks(params) {

            return $http.post(apiConfig.host + '/setMarks', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }


        function getSubjectWiseMarks(params) {

            return $http.get(apiConfig.host + '/getSubjectWiseMarks/' + params.UserID + '/' + params.InstituteID + '/' + params.ClassID + '/' + params.SectionID + '/' + params.DepartmentID + '/' + params.MediumID + '/' + params.ShiftID + '/' + params.SubjectID + '/' + params.ExamID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getSubjectWiseMarksByStudent(params) {

            return $http.get(apiConfig.host + '/SubjectWiseMarksByStudent/' + params.UserID + '/' + params.InstituteID + '/' + params.ClassID + '/' + params.SectionID + '/' + params.DepartmentID + '/' + params.MediumID + '/' + params.ShiftID + '/' + params.YearID + '/' + params.ExamID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getAllExamProgressReport(params) {

            return $http.get(apiConfig.host + '/getAllExamProgressReport/' + params.UserID + '/' + params.InstituteID + '/' + params.ClassID + '/' + params.SectionID + '/' + params.DepartmentID + '/' + params.MediumID + '/' + params.ShiftID + '/' + params.SessionID + '/' + params.FinalProcessingTypeID + '/' + params.ExeSequence + '/' + params.IsClassTestCalculate + '/' + params.ClassTestProcessingTypeID)
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
