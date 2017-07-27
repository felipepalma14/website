// Login
(function(){
	'use strict';
	angular
		.module('app')
		.controller('LoginCtrl',LoginCtrl);


	//Injetando Dependencias, e Serviços
	LoginCtrl.$inject = ['$location',
						'AuthenticationService',
						'APIService',
						'$scope'];

	function LoginCtrl($location,AuthenticationService,APIService,$scope,$firebaseAuth,$firebaseObject){
		/*
			AUTENTICAÇÃO DE USUARIO
		*/

		$scope.login = function(email,senha){
			AuthenticationService.Login(email,senha, function(resposta){
				if(resposta.uid){
					//console.log(resposta);
					alert("Seja Bem Vindo: " + resposta.email );
					$location.path('/dashboard/produto');
				}else{
					alert(resposta.message);
				}
			});
		}

		/*
			REGISTRO DE USUARIO
		*/
		$scope.registro = function(user){
			AuthenticationService.Registro(user.email,user.senha,function(resposta){
				if(resposta.uid){
					alert("Usuario criado: " + resposta.uid);
					var refUsers = firebase.database().ref("users");
					refUsers.child(resposta.uid).set(user);
					$location.path('/login');
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
