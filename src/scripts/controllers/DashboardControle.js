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

		DashboardCtrl.$inject = ['$http',
								'AuthenticationService',
								'APIService','FIPEService','$scope'];

		function DashboardCtrl($http,AuthenticationService,APIService,FIPEService,$scope){
			$scope.marcas  =  [];	
			$scope.modelos =  [];
			$scope.anos    =  [];

			$scope.carro = {};


				console.log(APIService.getMarcas());

			$scope.produtos  = APIService.getProdutos();
			$scope.categorias = APIService.getCategorias();
//APIService.getModelos();

			(function(){
				FIPEService.getMarcasFIPE()
				.then(function(resposta) {
					//console.log(resposta.data);
                    $scope.marcas = resposta.data;
                    $scope.carro.marca = resposta.data[0];
                   	
                   	$scope.encontrarModelos($scope.carro.marca);
                    //$scope.encontrarAnos($scope.carro.marca,$scope.carro.modelo);
                });

			})();            
			
			$scope.encontrarModelos = function(marca){
				FIPEService.getModelosFIPE(marca)
				.then(function(resposta) {
					//console.log(resposta.data.modelos);
                    $scope.modelos = resposta.data.modelos;
                    $scope.carro.modelo = resposta.data.modelos[0];//$scope.modelos[0];                    
                });
			};
			
			$scope.encontrarAnos = function(marca,modelo){

				FIPEService.getAnosFIPE(marca,modelo)
				.then(function(resposta) {
					console.log(resposta.data);
                    $scope.anos = resposta.data;
                    $scope.carro.ano = $scope.anos[0];
                });
                
			};


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

				var keyCategoria = {};
				keyCategoria[produto.categoria.$id] = true;
				produto.categoria = null;
				produto.categoria = keyCategoria;
				console.log(produto.imagem);
				produto.imagem = produto.imagem.dataURL;
				produto.empresa = AuthenticationService.currentUser.uid;

				for(let i=0; i < $scope.carros.length; i ++){
					console.log($scope.carros[i]);
					/*
					APIService.addMarca($scope.carros[i].marca,function(result){
						console.log("Key: " + result);
					});
					*/
				}
				
				//console.log(produto);
			};

			$scope.reset = function(){
				$scope.produto = {};
				$scope.carros = {};
			};

		}
}) ();