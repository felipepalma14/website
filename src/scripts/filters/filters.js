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
	        APIService.getModelo(Object.keys(modelo)[0],function(result){
	            retorno =  result;
	            //console.log(retorno);
	        });
	        return retorno;
	    }
	    modeloByKey.$stateful = true; // This line does the trick
	    
	    return modeloByKey;
	}
]);