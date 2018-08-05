(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('feesCollectionService', feesCollectionService);

    feesCollectionService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function feesCollectionService($http, $q, logger, apiConfig) {
        var service = {
            getStudentForFeeCollections : getStudentForFeeCollections
         
            
          
        };

        return service;


    
        function getStudentForFeeCollections(params) {
            
            return $http.get(apiConfig.host+'/getStudentForFeeCollection/'+params.shiftID +'/'+params.deptID+'/'+params.mediumID+'/'+params.classID+'/'+params.sectionID+'/'+params.studentID,params)
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
