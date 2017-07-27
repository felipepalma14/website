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

		DashboardCtrl.$inject = ['$location','AuthenticationService','APIService','$scope'];

		function DashboardCtrl($location,AuthenticationService,APIService,$scope){	
			$scope.produtos  = APIService.getProdutos();
			$scope.categorias = APIService.getCategorias();
			$scope.modelos = APIService.getModelos();

			$scope.modeloTeste  = function(key){
				var resultado;
				var modelo = APIService.getModelo(Object.keys(key)[0],function(result){
					
					result.then(function(r){
						resultado = r.modelo.nome;
						console.log(r.modelo.nome);
					});
				});
				return resultado;
			}
		}
}) ();