(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('insExameSetting', insExameSetting);

    insExameSetting.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function insExameSetting($http, $q, logger, apiConfig) {
        var service = {
            getInstituteId: getInstituteId,
            getAllExames: getAllExames,
            postinsexame: postinsexame,
            getAllGrade: getAllGrade,
            postinsgrade: postinsgrade,
            getExamPassMarks: getExamPassMarks,
            postExamePassMarksDetail: postExamePassMarksDetail,
            IsdeleteExamPassByID: IsdeleteExamPassByID,
            getInsExamepassmarkAll: getInsExamepassmarkAll,
            postexammarks: postexammarks,
            getInsExamemarkAll: getInsExamemarkAll,
            getInsPassMarkByParms: getInsPassMarkByParms,
            postExamMarks: postExamMarks,
            getSubjectWiseMarks: getSubjectWiseMarks,
            getAllExamesDDL: getAllExamesDDL,
            getInsExamRoutineByParms: getInsExamRoutineByParms,
            spGetExameStartEndDate: spGetExameStartEndDate
        };

        return service;

        function postExamMarks(params) {

            return $http.post(apiConfig.host + '/setMarks', params)
                .then (success)
                .catch (fail);

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

        function postinsexame(params) {

            return $http.post(apiConfig.host + '/setinsExame', params)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function postinsgrade(params) {

            return $http.post(apiConfig.host + '/setinsGrade', params)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getAllExamesDDL(params) {
            
            return $http.get(apiConfig.host + '/getinsExameID/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID, params)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getAllExames(params) {

            return $http.get(apiConfig.host + '/getinsExameDDL/' + params.insID, params)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function spGetExameStartEndDate(params) {

            return $http.get(apiConfig.host + '/spGetExameStartEndDate/' + params.ExamID + '/' + params.DepartmentID + '/' + params.MediumID + '/' + params.ShiftID + '/' + params.SectionID + '/' + params.ClassID + '/' + params.InstituteID)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getAllGrade(params) {

            return $http.get(apiConfig.host + '/getinsGrade/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID, params)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getInstituteId() {

            return $http.get(apiConfig.host + '/getInstituteName')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getExamPassMarks(params) {

            return $http.get(apiConfig.host + '/getExamPassMark/' + params.InstituteID, params)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function postExamePassMarksDetail(params) {

            return $http.post(apiConfig.host + '/setExamePassMarks', params)
                .then(success)
                .catch(fail) ;

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function IsdeleteExamPassByID(params) {

            return $http.delete(apiConfig.host + '/deleteExamPassMarksByID/' + params.PassMarkID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getInsExamepassmarkAll(params) {
            return $http.get(apiConfig.host + '/getExamePassmarksDetail/' + params.InstituteID + '/' + params.PassMarkID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function postexammarks(params) {

            return $http.post(apiConfig.host + '/setExamMark', params)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getInsExamemarkAll(params) {
            return $http.get(apiConfig.host + '/getExamMark/' + params.InstituteID + '/' + params.ExamID + '/' + params.ClassID + '/' + params.SectionID + '/' + params.DepartmentID + '/' + params.ShiftID + '/' + params.MeduimID + '/' + params.SubjectID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getInsPassMarkByParms(params) {

            return $http.get(apiConfig.host + '/getInsPassMarksByParms/' + params.InstituteID + '/' + params.PassMarkID + '/' + params.MediumID + '/' + params.DepartmentID + '/' + params.ClassID + '/' + params.ExamID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getInsExamRoutineByParms(params) {

            return $http.get(apiConfig.host + '/getExameRounineByParams/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.DepartmentID + '/' + params.SectionID + '/' + params.ShiftID + '/' + params.ExamID + '/' + params.StartDate + '/' + params.EndDate, params)
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
