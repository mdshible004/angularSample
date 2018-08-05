
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('studentAttendanceSevice', studentAttendanceSevice);

    studentAttendanceSevice.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function studentAttendanceSevice($http, $q, logger, apiConfig) {
        var service = {
            getHrmDeviceByParms: getHrmDeviceByParms,
            sendMailer: sendMailer,
            sendSMS: sendSMS,
            getInstitutePurchaseSMS: getInstitutePurchaseSMS,
            getTotalHrmDeviceByParmsforStudent: getTotalHrmDeviceByParmsforStudent,
            setManualStudentAttendance: setManualStudentAttendance,
            getHrmDeviceByParmsforManualStudentAtd: getHrmDeviceByParmsforManualStudentAtd,
            getMonthlyClassWiseStudentAttendance: getMonthlyClassWiseStudentAttendance,
            GetAllStudentsByParams: GetAllStudentsByParams,
            getStudentYearlyAttendance: getStudentYearlyAttendance

        };

        return service;
        function GetAllStudentsByParams(params) {
            //debugger
            return $http.get(apiConfig.host + '/GetAllStudentsByParams/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.DepertmentID + '/' + params.SectionID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getStudentYearlyAttendance(params) {
            //debugger
            return $http.get(apiConfig.host + '/getStudentYearlyAttendance/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.DepertmentID + '/' + params.SectionID + '/' + params.YearID + '/' + params.FromMonthID + '/' + params.ToMonthID + '/' + params.RFID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function sendMailer(params) {

            return $http.post(apiConfig.host + '/sendMailer', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function sendSMS(params) {

            axios.post('http://sms.greenweb.com.bd/api.php?token=' + params.token + '&to=' + params.to + '&message=' + params.message)  //jshint ignore : line
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        function getHrmDeviceByParms(params) {

            return $http.get(apiConfig.host + '/gethrmDeviceByParmsforStudent/' + params.ShiftID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.SectionID + '/' + params.DepartmentID + '/' + params.Date + '/' + params.IsPresent + '/' + params.IsAbsent + '/' + params.InstituteID + '/' + params.UserTypeID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getInstitutePurchaseSMS(params) {

            return $http.get(apiConfig.host + '/getInstituteAvailableSMS/' + params.instituteId)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }
            function fail(error) {
                return $q.reject(error);
            }

        }
        function getMonthlyClassWiseStudentAttendance(params) {

            return $http.get(apiConfig.host + '/getMonthlyClassWiseStudentAttendance/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.DepartmentID + '/' + params.SectionID + '/' + params.ShiftID + '/' + params.MonthID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getHrmDeviceByParmsforManualStudentAtd(params) {

            return $http.get(apiConfig.host + '/getHrmStudentAttendanceforManual/' + params.ShiftID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.SectionID + '/' + params.DepartmentID + '/' + params.Date + '/' + params.IsPresent + '/' + params.IsAbsent + '/' + params.InstituteID + '/' + params.UserTypeID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getTotalHrmDeviceByParmsforStudent(params) {
            return $http.get(apiConfig.host + '/getHrmTotalStudentAttendance/' + params.ShiftID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.SectionID + '/' + params.DepartmentID + '/' + params.Date + '/' + params.InstituteID + '/' + params.UserTypeID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function setManualStudentAttendance(params) {

            return $http.post(apiConfig.host + '/setDeviceAttendanceForStudent', params)
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

