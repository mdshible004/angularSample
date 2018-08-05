(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('commonService', commonService);

    commonService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function commonService($http, $q, logger, apiConfig) {
        var service = {

            require: require,
            droupDownRequire: droupDownRequire,
            getRelation: getRelation,
            getCountry: getCountry,
            getState: getState,
            getCity: getCity,
            getReligion: getReligion,
            getBloodGroups: getBloodGroups,
            getBoard: getBoard,
            getExam: getExam,
            getGrade: getGrade,
            getSession: getSession,
            getGender: getGender,
            getInstituteShift: getInstituteShift,
            getInstituteMedium: getInstituteMedium,
            getInstituteClass: getInstituteClass,
            getInstituteSection: getInstituteSection,
            getInstituteDepertment: getInstituteDepertment,
            getMonths: getMonths,
            getPaymentMethod: getPaymentMethod,
            getCurrency: getCurrency,
            getSub: getSub,
            getStudentBasicInfo: getStudentBasicInfo,
            getStudentBasicInfoByUserID: getStudentBasicInfoByUserID,
            getInsSubject: getInsSubject,
            getTotalStudentAndTotalAttendence: getTotalStudentAndTotalAttendence,
            getAllInstitute: getAllInstitute,
            getStudentBasicInfoList: getStudentBasicInfoList,
            getInstituteMediumDdl: getInstituteMediumDdl,
            getAcademicExam: getAcademicExam,
            getInstituteBrunchDdl: getInstituteBrunchDdl,
            getInstituteAndMediumWiseClass: getInstituteAndMediumWiseClass,
            getTotalTeacherAndTotalAttendence: getTotalTeacherAndTotalAttendence,
            getWorkFlow: getWorkFlow,
            postWorkFlowTransaction: postWorkFlowTransaction,
            getCmnYear: getCmnYear,
            getCmnNoticeTypeDDL: getCmnNoticeTypeDDL,
            getCmnNoticeForDDL: getCmnNoticeForDDL,
            getSubjectByParms: getSubjectByParms,
            GetClassWiseSubject: GetClassWiseSubject,
            spSetToDayAndToMonthsExpense: spSetToDayAndToMonthsExpense,
            SetFullYearCalendar: SetFullYearCalendar,
            IfExistAcademicYearCalendar: IfExistAcademicYearCalendar,
            RemoveFullYearCalendar: RemoveFullYearCalendar,
            spGetDashBoardCalendar: spGetDashBoardCalendar,
            getDashBoardCmnUserType: getDashBoardCmnUserType,
            GetOptionalAndCompulsorySubject: GetOptionalAndCompulsorySubject,
            getInsExamforDDL: getInsExamforDDL
        };

        return service;

        function require(checkValue, fieldName) {
            if (checkValue === '') {
                logger.warning(fieldName + ' is required');
                return 0;
            }
        }

        function droupDownRequire(checkValue, fieldName) {
            if (checkValue === undefined) {
                logger.warning(fieldName + ' is required');
                return 0;
            }
        }

        function getCmnYear() {

            return $http.get(apiConfig.host + '/getCmnYear')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getRelation() {

            return $http.get(apiConfig.host + '/getrelation')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getCountry() {

            return $http.get(apiConfig.host + '/getallcountry')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getCmnNoticeTypeDDL() {

            return $http.get(apiConfig.host + '/getNoticeTypeDDL')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getCmnNoticeForDDL() {

            return $http.get(apiConfig.host + '/getNoticeForDDL')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getDashBoardCmnUserType(params) {

            return $http.get(apiConfig.host + '/getDashBoardCmnUserType/' + params.LoggedUserID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getState(params) {

            return $http.get(apiConfig.host + '/getallstate/' + params.CountryID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getCity(params) {

            return $http.get(apiConfig.host + '/getallcity/' + params.StateID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getReligion() {

            return $http.get(apiConfig.host + '/getreligion')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getBloodGroups() {

            return $http.get(apiConfig.host + '/getbloodgroups')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getBoard() {

            return $http.get(apiConfig.host + '/getallboard')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getExam() {

            return $http.get(apiConfig.host + '/getallexam')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getAcademicExam() {

            return $http.get(apiConfig.host + '/getAllAcademicExam')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getGrade() {

            return $http.get(apiConfig.host + '/getallgrade')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getSession() {

            return $http.get(apiConfig.host + '/getallsession')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getGender() {

            return $http.get(apiConfig.host + '/getallgender')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getAllInstitute(params) {

            return $http.get(apiConfig.host + '/getInsShift/' + params.instituteId)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getInstituteShift(params) {

            return $http.get(apiConfig.host + '/getInsShift/' + params.instituteId)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getInstituteMedium(params) {

            return $http.get(apiConfig.host + '/getInsMedium/' + params.instituteId)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getInstituteMediumDdl(params) {

            return $http.get(apiConfig.host + '/getInstituteMediumDdl/' + params.instituteId)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getInstituteBrunchDdl(params) {

            return $http.get(apiConfig.host + '/getInstituteBrunchDdl/' + params.instituteId)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getInstituteClass(params) {

            return $http.get(apiConfig.host + '/getInsClass/' + params.instituteId)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getInstituteAndMediumWiseClass(params) {

            return $http.get(apiConfig.host + '/getInsClassByInstituteAndMediumID/' + params.InstituteID + '/' + params.MediumID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getInstituteSection(params) {

            return $http.get(apiConfig.host + '/getInsSection/' + params.instituteId + '/' + params.classId + '/' + params.DepartmentID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getInstituteDepertment(params) {

            return $http.get(apiConfig.host + '/getInsDepertment/' + params.instituteId)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getMonths() {

            return $http.get(apiConfig.host + '/getMonth')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getPaymentMethod() {

            return $http.get(apiConfig.host + '/getPaymentMethod')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getCurrency() {

            return $http.get(apiConfig.host + '/getCurrency')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getSub() {

            return $http.get(apiConfig.host + '/getCmnSubject')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getStudentBasicInfo(params) {

            return $http.get(apiConfig.host + '/getStudent/' + params.instituteId + '/' + params.ClassID + '/' + params.SectionID + '/' + params.DepartmentID + '/' + params.MediumID + '/' + params.ShiftID + '/' + params.UserID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getStudentBasicInfoList(params) {

            return $http.post(apiConfig.host + '/getStudentList', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getStudentBasicInfoByUserID(UserID) {

            return $http.get(apiConfig.host + '/getStudentToUpdate/' + UserID)

                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getInsSubject() {

            return $http.get(apiConfig.host + '/getCmnSubject')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getSubjectByParms(params) {

            return $http.get(apiConfig.host + '/getSubjectByParms/' + params.InstituteID + '/' + params.DepartmentID + '/' + params.MediumID + '/' + params.ClassID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getInsExamforDDL(params) {

            return $http.get(apiConfig.host + '/getInsExamforDDL/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function GetClassWiseSubject(params) {

            return $http.get(apiConfig.host + '/GetClassWiseSubject/' + params.InstituteID + '/' + params.DepartmentID + '/' + params.MediumID + '/' + params.ClassID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getTotalStudentAndTotalAttendence(params) {

            return $http.get(apiConfig.host + '/getTotalStudentAndTotalAttendence/' + params.CurrentDate + '/' + params.InstituteID + '/' + params.UserTypeID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getTotalTeacherAndTotalAttendence(params) {

            return $http.get(apiConfig.host + '/getTotalTeacherAndTotalAttendence/' + params.CurrentDate + '/' + params.InstituteID + '/' + params.UserTypeID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getWorkFlow(params) {

            return $http.get(apiConfig.host + '/getWorkFlow/' + params.menuID + '/' + params.instituteId, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function postWorkFlowTransaction(params) {

            return $http.post(apiConfig.host + '/setWorkFlow', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function spSetToDayAndToMonthsExpense() {

            return $http.get(apiConfig.host + '/spSetToDayAndToMonthsExpense')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function SetFullYearCalendar(params) {

            return $http.post(apiConfig.host + '/SetFullYearCalendar', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function IfExistAcademicYearCalendar(params) {
            return $http.get(apiConfig.host + '/IfExistAcademicYearCalendar/' + params.YearName + '/' + params.InstituteID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function RemoveFullYearCalendar(params) {
            return $http.get(apiConfig.host + '/RemoveFullYearCalendar/' + params.YearName + '/' + params.InstituteID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function spGetDashBoardCalendar(params) {
            return $http.get(apiConfig.host + '/spGetDashBoardCalendar/' + params.StartDate + '/' + params.EndDate + '/' + params.InstituteID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function GetOptionalAndCompulsorySubject(params) {
            //debugger;
            return $http.get(apiConfig.host + '/GetOptionalAndCompulsorySubject/' + params.InstituteID)
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
