(function(){
	'use strict';
	//iniciando aplicação
	angular
		.module('app', [
			'ui.bootstrap',
			'ngRoute',
			'ngCookies',
			'firebase',
			'imageupload'
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

			}).when('/dashboard/produto/cadastro',{
				templateUrl:'templates/dashboard/cadastro.produto.view.html',
				controller:'DashboardCtrl'

			}).when('/dashboard/produto/edita',{
				templateUrl:'templates/dashboard/editar.produto.view.html',
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
		    });

		}
})();



