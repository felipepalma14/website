// Login
(function(){
	'use strict';
	angular
		.module('app')
		.controller('LoginCtrl',LoginCtrl);


	//Injetando Dependencias, e Serviços
	LoginCtrl.$inject = ['$location','AuthenticationService','$scope'];

	function LoginCtrl($location,AuthenticationService,$scope,$firebaseAuth){
		
		(function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

		/*
			AUTENTICAÇÃO DE USUARIO
		*/

		$scope.login = function(email,senha){
			AuthenticationService.Login(email,senha, function(resposta){
				if(resposta.uid){
					//console.log(resposta);
					alert("Seja Bem Vindo: " + resposta.email );
					$location.path('/');
				}else{
					alert(resposta.message);
				}
			});
		}

		/*
			Logout do Usuario
		*/

		$scope.logOut = function(){
			AuthenticationService.Logout(function(resposta){
				if(resposta === null){
					alert("Até mais tarde¹¹¹");
					$location.path('/login');
				}
			});
		}
	}
})();
