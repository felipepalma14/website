var app = angular.module('app');

app
	.filter('categoriaByKey', ['APIService',function(APIService) {
	    var retorno;
	    function categoriaByKey(categoria){
	        APIService.getCategoria(Object.keys(categoria)[0],function(result){
	            retorno =  result;
	        });
	        return retorno;
	    }
	    categoriaByKey.$stateful = true; // This line does the trick
	    
	    return categoriaByKey;
	}]
	).filter('modeloByKey',['APIService',function(APIService){
		var retorno;
	    function modeloByKey(modelo){
	    	var keyModelo = Object.keys(modelo)[0];
	        APIService.getModelo(keyModelo,function(result){
	            retorno =  result;
	            console.log("filter: " + keyModelo);
	        });
	        return retorno;
	    }
	    modeloByKey.$stateful = true; // This line does the trick
	    
	    return modeloByKey;
	}
]);