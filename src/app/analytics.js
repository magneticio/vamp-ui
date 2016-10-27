/* global Environment */
/* eslint camelcase: ["error", {properties: "never"}] */
angular.module('app')
  .config(function ($mixpanelProvider) {
    if (Environment.prototype.mixpanel()) {
      $mixpanelProvider.apiKey(Environment.prototype.mixpanel());
    }
  })
  .factory('$analytics', ['$rootScope', function ($rootScope) {
    return new Analytics($rootScope);
  }])
  .run(['$analytics', function ($analytics) {
    if (Environment.prototype.mixpanel()) {
      $analytics.run();
    }
  }]);

function Analytics($rootScope) { // $mixpanel
  this.run = function () {
    var info = {};

    $rootScope.$on('/info', function (event, data) {
      data = data.data;
      if (!data.container_driver) {
        return;
      }
      info.uuid = data.uuid;
      info.version = data.version;
      info.ui_version = Environment.prototype.version();
      info.container_driver = data.container_driver.type;
    });

    $rootScope.$on('/events/stream', function () {
    });
  };
}
