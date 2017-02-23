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
        service.GetCurrentUser = GetCurrentUser;
        service.currentUser = null;
        service.ClearCredentials = ClearCredentials;
        //service.SetCredentials = SetCredentials;
        //service.ClearCredentials = ClearCredentials;

        return service;


        function GetCurrentUser(){
            var retrievedObject = localStorage.getItem('token');
            service.currentUser = JSON.parse(retrievedObject);
        }

        function ClearCredentials(){

              localStorage.removeItem("token");
        }
       
        function Login(email,senha,callback) {
            var auth = $firebaseAuth();
            auth.$signInWithEmailAndPassword(email, senha)
            .then(function(authData) {
                service.currentUser = authData;
                localStorage.setItem("token",JSON.stringify(authData));
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
              localStorage.removeItem("token");
              callback(service.currentUser);

            }).catch(function(error) {
              console.log('Error signing out:', error);
            });
            //service.currentUser
        }
    }
        /*
        function Login(username, password, callback) {

            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
        /*
            $timeout(function () {
                var response;
                UserService.GetByUsername(username)
                    .then(function (user) {
                        if (user !== null && user.password === password) {
                            response = { success: true };
                        } else {
                            response = { success: false, message: 'Username or password is incorrect' };
                        }
                        callback(response);
                    });
            }, 1000);
            */
           
        //}
})();
