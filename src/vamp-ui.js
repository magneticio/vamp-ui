/* eslint-disable */
var VAMP = {};

angular.module('vamp-ui', [
  'ui.router',
  'ui.bootstrap',
  'angular-websocket',
  'analytics.mixpanel',
  'ui.ace',
  'toastr',
  'ngAnimate',
  'rzModule',
  'angularUtils.directives.uiBreadcrumbs',
  'uiSwitch'
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
