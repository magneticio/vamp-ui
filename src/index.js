
angular.module('app', [
  'ui.router',
  'ui.bootstrap',
  'angular-websocket',
  'analytics.mixpanel',
  'ui.ace',
  'toastr',
  'ngAnimate',
  'rzModule',
  'ncy-angular-breadcrumb'
]);

function ExternalPluginsLoader() {
  this.plugins = [];

  function init() {
  }

  this.registerPlugin = function (config) {
    this.plugins.push(config);
  };

  init();
}

window.vampPluginsLoader = new ExternalPluginsLoader();
