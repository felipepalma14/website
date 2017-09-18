(function () {
    'use strict';

    angular
        .module('app')
        .factory('FIPEService', FIPEService);

    FIPEService.$inject = ['$http', '$cookies', '$rootScope','$firebaseArray','$firebaseObject'];
    function FIPEService($http, $cookies, $rootScope, $firebaseArray,$firebaseObject) {
    	var service = {
    		getMarcasFIPE : function getMarcasFIPE(){
    			$http({
				      method: 'GET',
				      url: 'https://fipe-parallelum.rhcloud.com/api/v1/carros/marcas'
				   });
    			return $http.get("https://fipe-parallelum.rhcloud.com/api/v1/carros/marcas");                        
    		},

    		getModelosFIPE : function getModelosFIPE(marca){
                if(marca.codigo > 0){
                    return $http.get("https://fipe-parallelum.rhcloud.com/api/v1/carros/marcas/" + marca.codigo + "/modelos");    
                }
                return null;
    		},
          	getAnosFIPE : function getAnosFIPE(marca,modelo){
                    return $http.get("https://fipe-parallelum.rhcloud.com/api/v1/carros/marcas/" + marca.codigo + "/modelos/" + modelo.codigo + "/anos");
                
            },
              
    	};
    	return service;
 	
 	}
})();