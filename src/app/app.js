(function(){
	'use strict';
	//iniciando aplicação
	angular
		.module('app', [
			'ngRoute',
			'ngCookies',
			'firebase'
		])
		.config(config)
		.run(run);

	config.$inject = ['$routeProvider', '$locationProvider'];
	function config ($routeProvider, $locationProvider) {
	  	$locationProvider.hashPrefix('');
	  	$routeProvider
		  	.when('/login',{
				templateUrl:'login/login_form.view.html',
				controller:'LoginCtrl'

			}).when('/cadastro',{
				templateUrl:'login/cadastro_form.view.html',
				controller:'LoginCtrl'

			})
			.otherwise({redirectTo:'/'});
			
		/*	
	  	$locationProvider.html5Mode({
		  enabled: true,
		  requireBase: false
		});
		*/
	}
	run.$inject=['$rootScope','AuthenticationService','$location'];
	function run($rootScope,AuthenticationService,$location){

		    $rootScope.$on("$locationChangeStart", function(event, next, current) {
		    	AuthenticationService.GetCurrentUser();
		    	$rootScope.currentUser = AuthenticationService.currentUser;
		    	if($rootScope.currentUser){
		    		 $location.path('/');	
		    	}else{
		        	$rootScope.currentUser = AuthenticationService.currentUser;
		        }
		    });
		}
})();



