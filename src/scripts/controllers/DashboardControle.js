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
			
			$scope.teste = function(categoria){
				//console.log(Object.keys(categoria)[0]); 
				APIService.getCategoria(Object.keys(categoria)[0],function(result){
					//console.log(result);
				});
			
			};

		}
}) ();