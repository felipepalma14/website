(function() {
	'use strict';
	angular
		.module('app')
		.controller('DashboardCtrl', DashboardCtrl);

		DashboardCtrl.$inject = ['$firebaseArray','$location',
							'AuthenticationService','$rootScope',
							'APIService','FIPEService','$scope'
							];

		function DashboardCtrl($firebaseArray,$location,AuthenticationService,$rootScope,APIService,FIPEService,$scope){
			$scope.marcas  =  [];	
			$scope.modelos =  [];
			$scope.anos    =  [];

			$scope.carro = {};


			var ref = firebase.database().ref();
			
			$scope.Allprodutos  = APIService.getProdutos();

			$scope.categorias = APIService.getCategorias();

			$scope.produtos = [];
			

			(function(){
				if($rootScope.currentUser != null){
					FIPEService.getMarcasFIPE()
					.then(function(resposta) {
	                    $scope.marcas = resposta.data;
	                    $scope.carro.marca = resposta.data[0];
	                   	
	                   	$scope.encontrarModelos($scope.carro.marca);
	                    //$scope.encontrarAnos($scope.carro.marca,$scope.carro.modelo);

				    });

	                APIService.pecasPorEmpresa(AuthenticationService.currentUser.uid,
	                	function(produtos){
	                		$scope.produtos = produtos;
	                	});
				}else{

					$location.path('/login');
				}
			})();            

			
			$scope.$watch('produtoType.$id', function(newValue, oldValue) {
				if($scope.produtoType['$id'] != undefined){
					$scope.produto = $scope.produtoType;

					var keyCategoria = Object.keys($scope.produto['categoria'])[0];
				  	
				  	var index = $scope.categorias.$indexFor(keyCategoria);
				  	$scope.produto.categoria = $scope.categorias[index];	
				}else{
					$scope.produto = {};
				}
			});
			

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
				var empresas = {};
                var produtosRef = null;
                var produtosRefArray = null;
                empresas[AuthenticationService.currentUser.uid] = true;

				if($scope.produtoType['$id']){
					console.log('if');
					$scope.produtoType['preco'] = produto.preco;
					$scope.produtoType['descricao'] = produto.descricao;
					$scope.produtoType['empresaKey'] = AuthenticationService.currentUser.uid;
					$scope.produtoType['produtoKey'] = $scope.produtoType.$id;
					delete $scope.produtoType['empresas'];
					var categoriaKey = {};
					categoriaKey[$scope.produtoType.categoria.$id] = true;
					$scope.produtoType['categoria'] = categoriaKey;

					var produtoEmpresaRef = $firebaseArray(ref.child("produtoEmpresa"));
					produtoEmpresaRef.$add($scope.produtoType).then(function(result){
						var produtoModeloRef = $firebaseArray(ref.child("produtoEmpresa/" + result.key + "/modelos"));
						addModelosInPeca(produtoModeloRef);

					});	

					produtosRef = ref.child('produtos/' + $scope.produtoType.$id + '/empresas');
                	produtosRefArray = $firebaseArray(produtosRef);
                	console.log(produtosRefArray);
                	//TESTE ADD KEY EMPRESA em PRODUTO
                	produtosRefArray.$add(AuthenticationService.currentUser.uid).then(function(){
                		console.log('criado ');
                	});			
				}else{
					console.log('else');
					produto.nome = $scope.produtoType;
					APIService.addProduto(produto,function(resultKeyProduto){
						var produtoModeloRef = $firebaseArray(ref.child("produtoEmpresa/" + resultKeyProduto + "/modelos"));
						addModelosInPeca(produtoModeloRef);					
					});
				}
				
				alert("Produto Cadastrado");
				$location.path('/dashboard/produto');
			};

			$scope.reset = function(){
				$scope.produto = {};
				$scope.carros = {};
			};

			function addModelosInPeca(refProdutoEmpresa){
				for(let i=0; i < $scope.carros.length; i++){
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
						refProdutoEmpresa.$add(keyProdutoModelo).then(function(result){
                            console.log("PRoduto Modelo : " + result);
                        });

					});
				}
			};

		}
}) ();