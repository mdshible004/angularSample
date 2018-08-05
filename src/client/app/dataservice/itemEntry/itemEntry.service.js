(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('itementryservice', itementryservice);

    itementryservice.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function itementryservice($http, $q, logger, apiConfig) {
        var service = {
			getCategory : getCategory,
			postItemMaster:postItemMaster,
			getItemMaster : getItemMaster,
			postItemColor : postItemColor,
			getItemColor : getItemColor,
			getItemModel : getItemModel,
			getItemOrigin : getItemOrigin,
			getItemBrand : getItemBrand,
			getItemUMO : getItemUMO,
			getItemTax : getItemTax,
			getCurrency : getCurrency,
			getItemGrade : getItemGrade,
			getItemSeason : getItemSeason,
			getItemGroupBYCatgory : getItemGroupBYCatgory,
			getItemYear : getItemYear,
			getItemCondition : getItemCondition,
			getEditItemMaster:getEditItemMaster
        };

        return service;

        function getCategory() {
            
            return $http.get(apiConfig.host+'/itemCategory')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }  

		function getItemMaster() {
            
            return $http.get(apiConfig.host+'/itemMaster')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
		}
		
		function postItemMaster(params){
			return $http.post(apiConfig.host+'/itemMaster',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
		}

		function postItemColor(){
			// return $http.post(apiConfig.host+'/classes',params)
            // .then(success)
            // .catch(fail);

			// function success(response) {
			// 	return response.data;
			// }

			// function fail(error) {
			// 	return $q.reject(error);
			// }
		}
		function getItemColor(){
			return $http.get(apiConfig.host+'/itemColor')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
		}
		function getItemModel(){
			return $http.get(apiConfig.host+'/itemModel')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
		}
		function getItemOrigin(){
			return $http.get(apiConfig.host+'/OriginCountry')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
		}
		function getItemBrand(){
			return $http.get(apiConfig.host+'/itemBrand')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
		}
		function getItemUMO(){
			return $http.get(apiConfig.host+'/UOM')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
		}
		function getItemTax(){
			return $http.get(apiConfig.host+'/cmnTaxMaster')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
		}
		function getCurrency(){
			return $http.get(apiConfig.host+'/currency')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
		}
		function getItemGrade(){
			return $http.get(apiConfig.host+'/itemGrade')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
		}
		function getItemSeason(){
			return $http.get(apiConfig.host+'/cmnSeason')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
		}
		function getItemGroupBYCatgory(params) {
        
			return $http.put(apiConfig.host+'/itemGroup/'+params._id,params)
				.then(success)
				.catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
		}
		function getItemYear() {
        
			return [
				{
					'ItemYearID': 1,
					'Year': '2015'
				},
				{
					'ItemYearID': 2,
					'Year': '2016'
				},
				{
					'ItemYearID': 3,
					'Year': '2017'
				}
			];
		}
		function getItemCondition() {
            
            return $http.get(apiConfig.host+'/itemCondition')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
		} 
		function getEditItemMaster(){
			return[
				{
					'ItemID': 3,
					'ItemNo': '3',
					'ItemName': 'Le Reve White Cotton Polo For Men',
					'ItemCategoryID': 1,
					'ItemCategoryName':'Fashion',
					'ItemGroupID': 3
				}
			];
		}
    }
})();
