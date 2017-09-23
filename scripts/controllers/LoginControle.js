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
						'$rootScope',
						'$scope'];

	function LoginCtrl($location,AuthenticationService,
                    APIService,$rootScope,$scope, $firebaseAuth,$firebaseObject){
		/*
			AUTENTICAÇÃO DE USUARIO
		*/
		(function() {
			if($rootScope.currentUser != null){
				$location.path('dashboard/produto');
			}
		})();
    /*
		 var vm = this;
        NgMap.getMap().then(function(map) {
          vm.showCustomMarker= function(evt) {
            map.customMarkers.foo.setVisible(true);
            map.customMarkers.foo.setPosition(this.getPosition());
          };
          vm.closeCustomMarker= function(evt) {
            this.style.display = 'none';
          };
        });
*/
		$scope.login = function(email,senha){
			AuthenticationService.Login(email,senha, function(resposta){
				if(resposta.uid){
					//console.log(resposta);
					alert("Seja Bem Vindo: " + resposta.email );
					$location.path('#/dashboard/produto');
				}else{
					alert(resposta.message);
				}
			});
		}

		/*
			REGISTRO DE USUARIO
		*/
		$scope.registro = function(user){
			if (user.email.length < 4) {
            alert('Please enter an email address.');
            return;
          }if(user.cnpj.length < 8){
            alert('Por favor, indique um numero para contato valido!!.');
            return;
          }
          if (user.senha.length < 4) {
            alert('Insira uma senha mais forte');
            return;
          }
          if(user.senha != $scope.confirmaSenha){
            alert("Por favor,verifique sua senha");
            return ;
          }
          	if(user.imagem === undefined){
          		 /*
          		 	SEM IMAGEM
          		 */

	            var storageRef = firebase.storage().ref('produtos/'+ "semImagem");
          		 var uploadTask = storageRef.putString("data:image/png;base64,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");
          	}else{

	          	var nomeImagem  = user.imagem.file.name;
	            var storageRef = firebase.storage().ref('produtos/'+ nomeImagem);
	            var uploadTask = storageRef.put(user.imagem.file);//(produto.imagem);	
          	}
           
            var downloadURL = '';
                
                uploadTask.on('state_changed', function(snapshot){
                  // Observe state change events such as progress, pause, and resume
                  // See below for more detail
                }, function(error) {
                  // Handle unsuccessful uploads
                }, function() {
                  // Handle successful uploads on complete
                  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                  downloadURL = uploadTask.snapshot.downloadURL;
                  // Sign in with email and pass.
                  // [START createwithemail]
                  firebase.auth().createUserWithEmailAndPassword(user.email, user.senha)
                  	.then(function(){
                    	var ref = firebase.database().ref().child('empresas');
                    	var regUser = firebase.auth().currentUser;
                    	//AuthenticationService.currentUser = regUser.uid;
                    	AuthenticationService.Logout(function(logout){
                    		console.log("saindo");
                    	});
                        //Set data in firebase making a child using the user id 
                    ref.push().set({
                          uid: regUser.uid, //key Empresa
                          empresa: user.empresa,
                          cnpj:user.cnpj,
                          date_criacao: firebase.database.ServerValue.TIMESTAMP,
                          email: user.email,
                          imagem: downloadURL
                        });
                  	$location.path('/login');
                  	alert("Cadastrado com sucesso!!!");
                  }).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // [START_EXCLUDE]
                    
                    if (errorCode == 'auth/weak-password') {
                        alert('Insira uma senha mais forte!!!');
                    } else {
                      alert(errorMessage);
                    }
                    console.log(error);
                    // [END_EXCLUDE]
                  });
                  // [END createwithemail]

            });
			/*
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
			*/
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
