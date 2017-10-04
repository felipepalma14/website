(function() {
	'use strict';
	angular
		/**
		*  Module
		*
		* Description
		*/
		.module('app')
		.controller('TesteCtrl', TesteCtrl);

		TesteCtrl.$inject = ['$scope','$http','APIService'];

		function TesteCtrl($scope,$http,APIService){
			//$scope.selected = undefined;	
    		$scope.Allprodutos  = APIService.getProdutos();
    		$scope.categorias = APIService.getCategorias();

    		$scope.produto = {};

			$scope.$watch('produtoType', function(newValue, oldValue) {
				if($scope.produtoType != undefined){
					$scope.produto = $scope.produtoType;
					var keyCategoria = Object.keys($scope.produto['categoria'])[0];
				  	console.log(keyCategoria);
				  	var index = $scope.categorias.$indexFor(keyCategoria);
				  	$scope.produto = $scope.produtoType;
				  	$scope.produto.categoria = $scope.categorias[index];	
				}else{
					$scope.produto = {};
				}
				

			});

		}
}) ();