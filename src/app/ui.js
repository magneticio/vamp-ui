/* eslint-disable no-unused-vars */
/* global Environment */

var Ui = null;

var UiConfig = function () {
  const defaultConfig = {
    toastTimeout: 5,
    chartPollingPeriod: 60,
    chartNoValueFailureTimeout: 150,
    chartResetValueTimeout: 90,
    chartResolution: 12
  };

  const config = JSON.parse(JSON.stringify(defaultConfig));

  const load = function () {
    if (typeof (Storage) !== 'undefined') {
      try {
        const local = JSON.parse(localStorage.getItem('ui-config.' + Environment.prototype.namespace()));
        for (var property in defaultConfig) {
          if (defaultConfig.hasOwnProperty(property)) {
            config[property] = local[property] || config[property];
          }
        }
      } catch (e) {
      }
    }
  };

  const save = function (cfg) {
    for (var property in defaultConfig) {
      if (defaultConfig.hasOwnProperty(property)) {
        config[property] = cfg[property] || config[property];
      }
    }
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem('ui-config.' + Environment.prototype.namespace(), JSON.stringify(config));
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
