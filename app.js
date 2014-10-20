/**
@toc
1. setup - whitelist, appPath, html5Mode
*/

'use strict';

angular.module('myApp', [ 'mc-drag-and-drop' ]).
config(['$locationProvider', '$compileProvider', function($locationProvider, $compileProvider) {
	/**
	setup - whitelist, appPath, html5Mode
	@toc 1.
	*/
	$locationProvider.html5Mode(false);		//can't use this with github pages / if don't have access to the server

	// var staticPath ='/';
	var staticPath;
	// staticPath ='/angular-directives/dragon-drop/';		//local
	staticPath ='/';		//nodejs (local)
	// staticPath ='/dragon-drop/';		//gh-pages
	var appPathRoute ='/';
	var pagesPath =staticPath+'pages/';

}]);