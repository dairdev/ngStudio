'use strict';

angular.module("ngStudio", [
	'ngAnimate',
	'ngRoute',
	'sqlWorkspace'
]);

require('./app.config.js');
require('./sql-workspace/sql-workspace.module.js');
require('./sql-workspace/sql-workspace.component.js');
