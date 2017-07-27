var app = angular.module('app');

app.filter('categoriaByKey', ['APIService',function(APIService) {
    var teste;
    function categoriaByKey(categoria){
        APIService.getCategoria(Object.keys(categoria)[0],function(result){
            teste = result;
        });
        return teste;
    }
    categoriaByKey.$stateful = true; // This line does the trick
    return categoriaByKey;
}]);