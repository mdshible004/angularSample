(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('chartOfAccountsService', chartOfAccountsService);

    chartOfAccountsService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function chartOfAccountsService($http, $q, logger, apiConfig) {
        var service = {
          postChartOfAccount:postChartOfAccount,
          getChartOfAccount:getChartOfAccount,
          getChartOfAccountBycoaID:getChartOfAccountBycoaID,
        //   ****
          getChartOfAccountTypeByInsID: getChartOfAccountTypeByInsID,
          getChartOfAccountByTypeID:getChartOfAccountByTypeID,
          deleteChartOfAccount: deleteChartOfAccount,
          getChartOfAccForParentDDL: getChartOfAccForParentDDL,
          getChartOfAccForUiGrid: getChartOfAccForUiGrid
        };

        return service;
        
        function getChartOfAccForUiGrid(params) {

            return $http.post(apiConfig.host + '/getCOAAllForUiGrid', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }


         function getChartOfAccount(params) {
            
            return $http.get(apiConfig.host+'/getChartOfAccountByInstituteID/'+params.InstituteID,params)
            .then(success)
            .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
            
        }

        function getChartOfAccountBycoaID(params) {
            
            return $http.get(apiConfig.host+'/getChartOfAccountByID/'+params.InstituteID+'/'+params.COAID,params)
            .then(success)
            .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
            
        }

        function postChartOfAccount(params) {
            
            return $http.post(apiConfig.host+'/setChartOfAccounts',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        //**************************/
          function getChartOfAccountTypeByInsID(params) {
            
            return $http.get(apiConfig.host+'/getChartOfAccountsTypeID/'+params.Insid,params)
            .then(success)
            .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
            
        }
         function getChartOfAccountByTypeID(params) {
            
            return $http.get(apiConfig.host+'/getChartOfAccountsByCOATypeID/'+params.Insid+'/'+params.COATypeID,params)
            .then(success)
            .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
            
        }

         function getChartOfAccForParentDDL(params) {

            return $http.get(apiConfig.host + '/getChartOfAccForParentDDL/' + params.Insid + '/' + params.COATypeID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

         }



        function deleteChartOfAccount(params) {
            
            return $http.post(apiConfig.host+'/deleteChartOfAccounts',params)
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
