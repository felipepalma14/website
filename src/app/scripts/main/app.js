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
				templateUrl:'templates/login/login_form.view.html',
				controller:'LoginCtrl'

			}).when('/cadastro',{
				templateUrl:'templates/login/cadastro_form.view.html',
				controller:'LoginCtrl'

			}).when('/dashboard/produto',{
				templateUrl:'templates/dashboard/listagem.produto.view.html',
				controller:'DashboardCtrl'

			})
			.otherwise({redirectTo:'/login'});
			
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
		    		 $location.path('/dashboard/produto');	
		    	}else{
		        	$rootScope.currentUser = AuthenticationService.currentUser;
		        }
		    });
		}
})();



