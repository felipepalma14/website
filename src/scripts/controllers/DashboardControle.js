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

		DashboardCtrl.$inject = ['$http','AuthenticationService','APIService','FIPEService','$scope'];

		function DashboardCtrl($http,AuthenticationService,APIService,FIPEService,$scope){
			$scope.marcas  =  [];	
			$scope.modelos =  [];
			$scope.anos    =  [];

			$scope.produtos  = APIService.getProdutos();
			$scope.categorias = APIService.getCategorias();
//APIService.getModelos();

			$scope.single = function(image) {
                    console.log(image);
             };

			FIPEService.getMarcasFIPE()
				.then(function(resposta) {
					//console.log(resposta.data);
                    $scope.marcas = resposta.data;
                });

			$scope.encontrarModelos = function(marca){
				FIPEService.getModelosFIPE(marca)
				.then(function(resposta) {
					//console.log(resposta.data.modelos);
                    $scope.modelos = resposta.data.modelos;
                    $scope.carro.modelo = $scope.modelos[0];
                });
			};
			
			$scope.encontrarAnos = function(marca,modelo){
				FIPEService.getAnosFIPE(marca,modelo)
				.then(function(resposta) {
					console.log(resposta.data);
                    $scope.anos = resposta.data;
                });
			};

		}
}) ();