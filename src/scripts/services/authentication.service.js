(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout','$firebaseAuth'];
    function AuthenticationService($http, $cookies, $rootScope, $timeout,$firebaseAuth) {
        var service = {};
        
        service.Login = Login;
        service.Logout = Logout;
        service.Registro = Registro;
        service.GetCurrentUser = GetCurrentUser;
        service.currentUser = null;
        return service;

        function GetCurrentUser(){
            for(var key in localStorage){
                if(key.startsWith("firebase:authUser")){
                    var localStorageObject = localStorage.getItem(key);
                    service.currentUser = JSON.parse(localStorageObject);
                }
            }
        }
       
        function Registro(email,senha,callback) {
            var auth = $firebaseAuth();
            auth.$createUserWithEmailAndPassword(email, senha)
            .then(function(userUID) {
                service.currentUser = userUID;
                callback(service.currentUser);

            }).catch(function(error) {
                callback(error);
                console.log(error);
            }).finally(function(xx) {
                console.log("finally", xx);
            });
        }

        function Login(email,senha,callback) {
            var auth = $firebaseAuth();
            auth.$signInWithEmailAndPassword(email, senha)
                .then(function(authData) {
                    service.currentUser = authData;
                    callback(authData);

                }).catch(function(error) {
                    callback(error);
                    console.log(error);
                }).finally(function(xx) {
                    console.log("finally", xx);
                });
        }

        function Logout(callback){
            var auth = $firebaseAuth();
            auth.$signOut().then(function() {
              service.currentUser = null;
              callback(service.currentUser);

            }).catch(function(error) {
              console.log('Error signing out:', error);
            });
            //service.currentUser
        }
    }
})();
