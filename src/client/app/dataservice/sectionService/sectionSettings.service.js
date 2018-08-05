
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('sectionSettingsSevice', sectionSettingsSevice);

        sectionSettingsSevice.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function sectionSettingsSevice($http, $q, logger, apiConfig) {
        var service = {
            setCmnSection:setCmnSection,
            getCmnSection:getCmnSection,
            getSectionById:getSectionById,
            deleteSection:deleteSection
            
        };

        return service;

        
        function getCmnSection() {
            
            return $http.get(apiConfig.host+'/getCmnSection')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
     
        function setCmnSection(params) {
            
            return $http.post(apiConfig.host+'/postCmnSection',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

        function getSectionById(params) {
            
            return $http.get(apiConfig.host+'/getCmnSectionById/'+params.SectionID,params)
            .then(success)
            .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
            
        }
        function deleteSection(params) {
            
            return $http.post(apiConfig.host+'/deleteSection',params)
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

