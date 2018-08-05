(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('userService', userService);

    userService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function userService($http, $q, logger, apiConfig) {
        var service = {
            postUserGuardian: postUserGuardian,
            postUserStudent: postUserStudent,
            postUserEmployee: postUserEmployee,
            postUserAddress: postUserAddress,
            getGuardian: getGuardian,
            getLastUserID: getLastUserID,
            getUserByID: getUserByID,
            deleteUserByID: deleteUserByID,
            getUserByTypeID: getUserByTypeID,
            getUserMasterDetailsByID: getUserMasterDetailsByID,
            getUserExprienceList: getUserExprienceList,
            uploadeImage: uploadeImage,
            postStudentBasicInfo: postStudentBasicInfo,
            getUserByUserID: getUserByUserID,
            // postUserGuardian: postUserGuardian,
            // postUserStudent: postUserStudent,
            // postUserEmployee: postUserEmployee,
            // postUserAddress: postUserAddress,
            // getGuardian: getGuardian,
            // getLastUserID: getLastUserID,
            // getUserByID: getUserByID,
            // deleteUserByID: deleteUserByID,
            // getUserByTypeID: getUserByTypeID,
            // getUserMasterDetailsByID: getUserMasterDetailsByID,
            // getUserExprienceList: getUserExprienceList,
            // uploadeImage: uploadeImage,
            SetExcelData: SetExcelData,
            getAllUsers: getAllUsers,
            getUserType: getUserType,
            getDesignationByInstituteID: getDesignationByInstituteID,
            getDepartmentByInstituteID: getDepartmentByInstituteID

        };

        return service;

        function postUserGuardian(params) {

            return $http.post(apiConfig.host + '/setUserGuardian', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function postUserAddress(params) {

            return $http.post(apiConfig.host + '/setBulkAddress', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function postUserStudent(params) {

            return $http.post(apiConfig.host + '/setUserStudent', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function postUserEmployee(params) {

            return $http.post(apiConfig.host + '/setUserStudent', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getGuardian() {

            return $http.get(apiConfig.host + '/getUserGuardian')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getLastUserID() {

            return $http.get(apiConfig.host + '/getLastInputUser')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getUserByID(params) {

            return $http.get(apiConfig.host + '/getUser/' + params.userID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function deleteUserByID(params) {

            return $http.delete(apiConfig.host + '/deleteUser/' + params.userID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        //**** */
        function getUserByTypeID(params) {

            return $http.get(apiConfig.host + '/getUser/0/' + params.typeID + '/' + params.instituteId)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getAllUsers(funcName, params) {

            return $http.post(apiConfig.host + funcName, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getUserMasterDetailsByID(params) {

            return $http.get(apiConfig.host + '/getUserMasterDetails/' + params.userID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getUserExprienceList() {

            return $http.get(apiConfig.host + '/getUserExprienceList')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function uploadeImage(params) {

            return $http.post(apiConfig.host + '/uploads', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function postStudentBasicInfo(params) {

            return $http.post(apiConfig.host + '/setStudentBasicInfo', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }



        function SetExcelData(params) {

            return $http.post(apiConfig.host + '/SetExcelData', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        //  function getUserByUserID(params) {

        //     return $http.get(apiConfig.host + '/getUser/' + params.userID+'/' + params.typeID + '/' + params.instituteId)
        //         .then(success)
        //         .catch(fail);

        //     function success(response) {
        //         return response.data;
        //     }

        //     function fail(error) {
        //         return $q.reject(error);
        //     }

        // }

        function getUserByUserID(params) {

            return $http.get(apiConfig.host + '/getUser/' + params.userID + '/' + params.typeID + '/' + params.instituteId, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getUserType(params) {

            return $http.get(apiConfig.host + '/getUserType/' + params.instituteId, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getDesignationByInstituteID(params) {
         
            return $http.get(apiConfig.host + '/getDesignationByInstituteID/' + params.instituteId, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getDepartmentByInstituteID(params) {

            return $http.get(apiConfig.host + '/getDepartmentByInstituteID/' + params.instituteId, params)
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
