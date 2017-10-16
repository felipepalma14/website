(function () {
    'use strict';

    angular
        .module('app')
        .factory('FIPEService', FIPEService);

    FIPEService.$inject = ['$http', '$cookies', '$rootScope','$firebaseArray','$firebaseObject'];
    function FIPEService($http, $cookies, $rootScope, $firebaseArray,$firebaseObject) {
    	var URL_FIPE = "https://fipe.parallelum.com.br/api/v1/";
        var service = {
    		getMarcasFIPE : function getMarcasFIPE(){
    			return $http.get(URL_FIPE + "carros/marcas");                        
    		},

    		getModelosFIPE : function getModelosFIPE(marca){
                if(marca.codigo > 0){
                    return $http.get(URL_FIPE + "carros/marcas/" + marca.codigo + "/modelos");    
                }
                return null;
    		},
          	getAnosFIPE : function getAnosFIPE(marca,modelo){
                    return $http.get( URL_FIPE + "carros/marcas/" + marca.codigo + "/modelos/" + modelo.codigo + "/anos");
                
            },
              
    	};
    	return service;
 	
 	}
})();