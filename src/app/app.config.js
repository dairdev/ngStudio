'use strict';
angular.module('ngStudio')
	.config(['$locationProvider', '$routeProvider',
		function config($locationProvider, $routeProvider) {
			$locationProvider.hashPrefix('!');

			$routeProvider.
				when('/sql', {
					template: '<sql-workspace></sql-workspace>'
				}).
				otherwise('/sql');
		}
	]);
