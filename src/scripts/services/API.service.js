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
                let produtos = ref.child('produtos');
                let retorno = $firebaseArray(produtos);
                return retorno;
            },            

            getCategoria: function getCategoria(categoria,callback){
                var retorno;
                
                ref.child("categorias/"+categoria)
                    .on("child_added",function(snap){
                        retorno = snap.val();
                        
                        return callback(retorno); 
                    });
            },
            
            getCategorias: function getCategorias(){
                let categorias = $firebaseArray(ref.child('categorias'));
                return categorias;

            },

            getModelo: function getModelo(keyModelo,callback){
                var retorno;
                ref.child("modelos/"+keyModelo+"/modelo")
                    .on("child_added",function(snap){
                        retorno = snap.val();
                        return callback(retorno); 
                    });
                /*
                modelo.$loaded().then(function(r){
                    return callback(r.modelo.nome);
                });
                */

            },
            getModelos: function getModelos(){
                let modelos = $firebaseArray(ref.child('modelos'));
                return modelos;

            },

        };

        return service;
    }
})();
