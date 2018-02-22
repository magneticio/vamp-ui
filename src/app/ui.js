/* eslint-disable no-unused-vars */
/* global Environment */

var Ui = null;

var UiConfig = function () {
  var defaultConfig = {
    toastTimeout: 5,
    chartPollingPeriod: 60,
    chartNoValueFailureTimeout: 150,
    chartResetValueTimeout: 90,
    chartResolution: 12
  };

  var config = JSON.parse(JSON.stringify(defaultConfig));

  var load = function (namespace) {
    namespace = namespace || '*';
    if (typeof (Storage) !== 'undefined') {
      var local = {};
      try {
        local = JSON.parse(localStorage.getItem('ui-config.' + namespace)) || {};
      } catch (e) {
      }
      for (var property in defaultConfig) {
        if (defaultConfig.hasOwnProperty(property)) {
          config[property] = local[property] || defaultConfig[property];
        }
      }
    }
  };

  var save = function (cfg, namespace) {
    namespace = namespace || '*';
    for (var property in defaultConfig) {
      if (defaultConfig.hasOwnProperty(property)) {
        config[property] = cfg[property] || config[property];
      }
    }
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem('ui-config.' + namespace, JSON.stringify(config));
      return true;
    }
    return false;
  };

  load();

  return {
    defaultConfig: defaultConfig,
    config: config,
    load: load,
    save: save
  };
};
