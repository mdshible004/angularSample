(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('subjectWiseMarksEntry', subjectWiseMarksEntry);

    subjectWiseMarksEntry.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function subjectWiseMarksEntry($http, $q, logger, apiConfig) {
        var service = {
           
            
            getSubjectWiseMarks: getSubjectWiseMarks,
            postExamMarks: postExamMarks
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
   
    


}
})();