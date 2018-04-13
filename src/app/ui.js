/* eslint-disable no-unused-vars, no-eq-null, eqeqeq */
/* global Environment */

var Ui = null;

var UiConfig = function () {
  var defaultConfig = {
    view: 'grid',
    toastTimeout: 5,
    chartPollingPeriod: 60,
    chartNoValueFailureTimeout: 150,
    chartResetValueTimeout: 90,
    chartResolution: 12,
    eventPolling: 10,
    jvmMetricsPolling: 60,
    eventsHealth: true,
    eventsMetrics: true,
    eventsAllocation: true
  };

  var config = JSON.parse(JSON.stringify(defaultConfig));

  var load = function ($rootScope) {
    if (typeof (Storage) !== 'undefined') {
      var local = {};
      try {
        local = JSON.parse(localStorage.getItem('ui-config.' + namespace($rootScope))) || {};
      } catch (e) {
      }
      for (var property in defaultConfig) {
        if (defaultConfig.hasOwnProperty(property)) {
          config[property] = local[property] == null ? defaultConfig[property] : local[property];
        }
      }
    }
  };

  var save = function (cfg, $rootScope) {
    for (var property in defaultConfig) {
      if (defaultConfig.hasOwnProperty(property)) {
        config[property] = cfg[property] == null ? config[property] : cfg[property];
      }
    }
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem('ui-config.' + namespace($rootScope), JSON.stringify(config));
      return true;
    }
    return false;
  };

  load();

  function namespace($rootScope) {
    try {
      return $rootScope.session.environment.name;
    } catch (e) {
      return '*';
    }
  }

  return {
    defaultConfig: defaultConfig,
    config: config,
    load: load,
    save: save
  };
};
