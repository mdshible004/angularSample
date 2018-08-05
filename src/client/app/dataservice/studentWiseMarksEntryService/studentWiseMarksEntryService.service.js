(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('StudentWiseMarksEntry', StudentWiseMarksEntry);

    StudentWiseMarksEntry.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function StudentWiseMarksEntry($http, $q, logger, apiConfig) {
        var service = {          
            postExamMarks: postExamMarks,
            studenetWiseMarks: studenetWiseMarks,
            getAllGradesForReport: getAllGradesForReport
        };
       
        return service;
        
        function postExamMarks(params) {

            return $http.post(apiConfig.host + '/StudentMarks', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }


        function studenetWiseMarks(params) {

            return $http.get(apiConfig.host + '/studentWiseMarks/' + params.UserID + '/' + params.InstituteID + '/' + params.ClassID + '/' + params.SectionID + '/' + params.DepartmentID + '/' + params.MediumID + '/' + params.ShiftID + '/' + params.SubjectID + '/' + params.ExamID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getAllGradesForReport(params) {

            return $http.get(apiConfig.host + '/getinsGradeForReport/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID)
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
