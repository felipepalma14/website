(function () {
    'use strict';

    angular
        .module('app')
        .factory('APIService', APIService);

    APIService.$inject = ['$http', '$cookies', '$rootScope', '$timeout','$firebaseArray','$firebaseObject'];
    function APIService($http, $cookies, $rootScope, $timeout,$firebaseArray,$firebaseObject) {
        var ref = firebase.database().ref();
        var service = {
            getEmpresas : function getEmpresas(){
                var empresas = ref.child("empresas");
                // create a synchronized array
                // click on `index.html` above to see it used in the DOM!
                return $firebaseArray(empresas);
            },
            getProdutos : function getProdutos(){
                var produtos = ref.child('produtos');
                return $firebaseArray(produtos);
            },            

            getCategoria: function getCategoria(categoria,callback){
                var retorno;
                
                ref.child("categorias/"+categoria)
                    .on("child_added",function(snap){
                        retorno = snap.val();
                        
                        callback(retorno); 
                    });
            },
            
            getCategorias: function getCategorias(){
                return $firebaseArray(ref.child('categorias'));

            }

        };

        return service;
    }
})();
