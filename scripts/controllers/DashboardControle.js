(function() {
	'use strict';
	angular
		/**
		*  Module
		*
		* Description
		*/
		.module('app')
		.controller('DashboardCtrl', DashboardCtrl);

		DashboardCtrl.$inject = ['$http','$firebaseArray','$location',
								'AuthenticationService','$rootScope',
								'APIService','FIPEService','$scope'];

		function DashboardCtrl($http,$firebaseArray,$location,AuthenticationService,$rootScope,APIService,FIPEService,$scope){
			$scope.marcas  =  [];	
			$scope.modelos =  [];
			$scope.anos    =  [];

			$scope.carro = {};


			var ref = firebase.database().ref();
			
			//$scope.produtos  = APIService.getProdutos();

			$scope.categorias = APIService.getCategorias();
			//APIService.getModelos();

			$scope.produtos = [];
			

			(function(){
				if($rootScope.currentUser != null){
					FIPEService.getMarcasFIPE()
					.then(function(resposta) {
						//console.log(resposta.data);
	                    $scope.marcas = resposta.data;
	                    $scope.carro.marca = resposta.data[0];
	                   	
	                   	$scope.encontrarModelos($scope.carro.marca);
	                    //$scope.encontrarAnos($scope.carro.marca,$scope.carro.modelo);

				    });

	                pecasPorEmpresa(AuthenticationService.currentUser.uid);
				}else{

					$location.path('/login');
				}
				
			})();            

			
			
			function pecasPorEmpresa(empresaKey){
	            ref.child('produtos').once('value',function(dataSnapshotProdutos){
	                dataSnapshotProdutos.forEach(function(childProduto){
	                    var id = childProduto.key;
	                    var produto  = childProduto.val();
	                    firebase.database().ref().child('produtos/' + id +'/empresa/').orderByKey().once('value',function(dataSnapshot){
	                        dataSnapshot.forEach(function(child){
	                        	var produtoEmpresaKey = Object.keys(child.val())[0];
	                            //console.log("Produto/Empresa: " + produtoEmpresaKey);
	                            //console.log("Empresa: " + empresaKey);
	                            if(empresaKey === produtoEmpresaKey){
	                            	console.log("adicionando produto");
	                                $scope.produtos.push(produto);
	                            }
	                        });
	                           
	                    });
	                });
	            });            
	        }
			$scope.encontrarModelos = function(marca){
				FIPEService.getModelosFIPE(marca)
				.then(function(resposta) {
					//console.log(resposta.data.modelos);
                    $scope.modelos = resposta.data.modelos;
                    $scope.carro.modelo = resposta.data.modelos[0];//$scope.modelos[0]; 
                    $scope.encontrarAnos(marca,$scope.carro.modelo);                  
                });
			};
			
			$scope.encontrarAnos = function(marca,modelo){

				FIPEService.getAnosFIPE(marca,modelo)
				.then(function(resposta) {
					console.log("anos: " + resposta.data);
                    $scope.anos = resposta.data;
                    $scope.carro.ano = $scope.anos[0];
                });
                
			};
			/*
				Remove um item
			*/
			$scope.remove = function(item) { 
				var index = $scope.carros.indexOf(item);
			  	$scope.carros.splice(index, 1);     
			}
			/*
				Criando lista de carros 
			*/

			$scope.carros = [];

			$scope.addMarcaModelo = function(dados){
				var novoCarro = novoCarro || {};
				novoCarro.marca = dados.marca;
				novoCarro.modelo = dados.modelo;
				novoCarro.ano = dados.ano; 
				console.log(novoCarro);
				$scope.carros.push(novoCarro);
			};

				
			/*
				Cadastro de Produto To Firebase
			*/
			$scope.addProdutoToFirebase = function (produto){
				APIService.addProduto(produto,function(resultKeyProduto){
					var produtoModeloRef = $firebaseArray(ref.child("produtos/" + resultKeyProduto + "/modelo"));

					for(let i=0; i < $scope.carros.length; i ++){
						APIService.addModelo($scope.carros[i].modelo,function(resultKeyModelo){
							var modeloRef = ref.child('modelos/'+ resultKeyModelo);
		                    var modeloMarcaRef = modeloRef.child("marca");

		                    var modeloAnosRef = $firebaseArray(modeloRef.child("anos"));

							APIService.addMarca($scope.carros[i].marca,function(resultKeyMarca){
								var keyMarca = {};
								keyMarca[resultKeyMarca]=true;
		                    	modeloMarcaRef.set(keyMarca);	                    	
							});
							APIService.addAno($scope.carros[i].ano,function(resultKeyAno){
								var keyAno = {};
								keyAno[resultKeyAno]=true;
								modeloAnosRef.$loaded(function(data){
				                    var encontrei = false;
				                    for(var i =0; i < data.length;i++){
				                        var keyModeloAno = Object.keys(data[i])[0];
				                        if(keyModeloAno === resultKeyAno){
				                        	encontrei = true
				                        	break
				                        }
				                    }
				                    if(encontrei === false){
				                        console.log("Ano nao existe, vou adc");
										modeloAnosRef.$add(keyAno);	
				                    }
				                    
				                });

							});
							var keyProdutoModelo = {};
							keyProdutoModelo[resultKeyModelo] = true;
							produtoModeloRef.$add(keyProdutoModelo).then(function(result){
	                            console.log("PRoduto Modelo : " + result);
	                        });

						});
					}
				});
				
				alert("Produto Cadastrado");
				
			};

			$scope.reset = function(){
				$scope.produto = {};
				$scope.carros = {};
			};

		}
}) ();