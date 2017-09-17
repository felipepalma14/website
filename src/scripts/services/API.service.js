(function () {
    'use strict';

    angular
        .module('app')
        .factory('APIService', APIService);

    APIService.$inject = ['$http', '$cookies', '$rootScope','AuthenticationService',
                         '$timeout','$firebaseArray','$firebaseObject'];
    
    function APIService($http, $cookies, $rootScope,AuthenticationService, $timeout,$firebaseArray,$firebaseObject) {
        var ref = firebase.database().ref();
        var service = {
            getEmpresas : function getEmpresas(){
                var empresas = ref.child("empresas");
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
            },

            getMarcas: function getMarcas(){
                let marcas = $firebaseArray(ref.child('marcas'));
                return marcas;

            },
            getModelos: function getModelos(){
                let modelos = $firebaseArray(ref.child('modelos'));
                return modelos;

            },
            getAnos: function getAnos(){
                let anos = $firebaseArray(ref.child('anos'));
                return anos;

            },

            addMarca: function addMarca(marca,callback){
                //getMarcas().$add(marca);
                let marcas = $firebaseArray(ref.child('marcas'));
                var retorno = null;
                marcas.$loaded(function(data){
                    var encontrei = false;
                    for(var i =0; i < data.length;i++){
                        
                        if(data[i].codigo === marca.codigo){
                            console.log("achei");   
                            encontrei = true;
                            return callback(data[i].$id);
                        }
                    }
                    if(encontrei === false){
                        console.log("nao encontrei,vou adc");
                        marcas.$add(marca).then(function(result){
                            //console.log(result.key);
                            retorno = result.key;
                            return callback(retorno);
                        });
                    }

                });

            },
            addAno: function addAno(ano,callback){
                var anos = this.getAnos();
                anos.$loaded(function(data){
                    var encontrei = false;
                    for(var i =0; i < data.length;i++){
                        
                        if(data[i].codigo === ano.codigo){
                            console.log("achei");   
                            encontrei = true;
                            return callback(data[i].$id);
                        }
                    }
                    if(encontrei === false){
                        console.log("nao encontrei,vou adc");
                        anos.$add(ano).then(function(result){
                            //console.log(result.key);
                            
                            return callback(result.key);
                        });
                    }
                });
            },
            addModelo: function addModelo(modelo,callback){
                var modelos = this.getModelos();
                modelos.$loaded(function(data){
                    var encontrei = false;
                    for(var i =0; i < data.length;i++){
                        
                        if(data[i].codigo === modelo.codigo){
                            console.log("achei");   
                            encontrei = true;
                            return callback(data[i].$id);
                        }
                    }
                    if(encontrei === false){
                        console.log("nao encontrei,vou adc");
                        modelos.$add(modelo).then(function(result){
                            //console.log(result.key);
                            
                            return callback(result.key);
                        });
                    }
                });
            },
            addProduto: function addProduto(produto,callback){
                var produtos = this.getProdutos();
                var keyCategoria = {};
                keyCategoria[produto.categoria.$id] = true;
                produto.categoria = null;
                produto.categoria = keyCategoria;
                produto.data_criacao = firebase.database.ServerValue.TIMESTAMP;
                produto.data_atualizacao = firebase.database.ServerValue.TIMESTAMP;
                var nomeImagem  = produto.imagem.file.name;
                var storageRef = firebase.storage().ref('produtos/'+ nomeImagem);
                var uploadTask = storageRef.put(produto.imagem.file);//(produto.imagem);
                var downloadURL = '';
                
                
                uploadTask.on('state_changed', function(snapshot){
                          // Observe state change events such as progress, pause, and resume
                          // See below for more detail
                        }, function(error) {
                          // Handle unsuccessful uploads
                        }, function() {
                            produto.imagem = uploadTask.snapshot.downloadURL;
                            produtos.$add(produto).then(function(result){
                            //console.log(result.key);
                                var produtoEmpresaRef = $firebaseArray(ref.child("produtos/" + result.key + "/empresa"));
                                var keyProdutoEmpresa = {};
                                keyProdutoEmpresa[AuthenticationService.currentUser.uid] = true;
                                produtoEmpresaRef.$add(keyProdutoEmpresa);
                                return callback(result.key);
                            });
                          console.log(uploadTask.snapshot.downloadURL);
                        }
                );
                
            }
        };

        return service;
    }
})();
