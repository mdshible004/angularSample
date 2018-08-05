(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('menuSettings', menuSettings);

    menuSettings.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function menuSettings($http, $q, logger, apiConfig) {
        var service = {
            postMenuSettings: postMenuSettings,
            getModule: getModule,
            getParentMenu: getParentMenu,
            getMenu: getMenu,
            getMenuPermission: getMenuPermission,
            getMenuType: getMenuType,
            getModulePermission: getModulePermission,
            setModule: setModule,
            setMenuPermission: setMenuPermission,
            updateModulePermission: updateModulePermission,
            getStatus: getStatus,
            getLoginUser: getLoginUser,
            savePremissionRecord: savePremissionRecord

        };

        return service;

        function postMenuSettings(params) {

            return $http.post(apiConfig.host + '/setmenu', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }


        function savePremissionRecord(params) {

            return $http.post(apiConfig.host + '/savePremissionRecord', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }




        function setModule(params) {

            return $http.post(apiConfig.host + '/setModule', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }



        function setMenuPermission(params) {

            return $http.post(apiConfig.host + '/setMenuPermission', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }


        function getModule(params) {

            return $http.get(apiConfig.host + '/getmodule/' + params.moduleID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getModulePermission(params) {

            return $http.get(apiConfig.host + '/getmodulePermission/' + params.InstituteID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }


        function getParentMenu() {

            return $http.get(apiConfig.host + '/getmenu')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getMenu(params) {

            return $http.get(apiConfig.host + '/getmenu/' + params.menuId, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }



        function updateModulePermission(params) {

            return $http.post(apiConfig.host + '/updateModulePermission', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }


        function getMenuPermission(params) {

            return $http.get(apiConfig.host + '/getmenuPermission/' + params.InstituteID + '/' + params.ModuleID + '/' + params.UserTypeID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getMenuType() {
            return $http.get(apiConfig.host + '/getmenutype')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }


        function getStatus() {

            return $http.get(apiConfig.host + '/getStatus')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }


        function getLoginUser() {

            return $http.get(apiConfig.host + '/getLoginUser')
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
