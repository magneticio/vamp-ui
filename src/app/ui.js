/* eslint-disable no-unused-vars */
const Ui = (function () {
  let config = {
    toastTimeout: 5000,
    chartNoValueFailureTimeout: 12500,
    chartResetValueTimeout: 7500
  };

  const load = function () {
    if (typeof (Storage) !== 'undefined') {
      try {
        const local = JSON.parse(localStorage.getItem('ui-config'));
        config.toastTimeout = local.toastTimeout || config.toastTimeout;
        config.chartResetValueTimeout = local.chartResetValueTimeout || config.chartResetValueTimeout;
        config.chartNoValueFailureTimeout = local.chartNoValueFailureTimeout || config.chartNoValueFailureTimeout;
      } catch (e) {
      }
    }
  };

  const save = function () {
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem('ui-config', JSON.stringify(config));
      return true;
    }
    return false;
  };

  load();

  return {
    config: config,
    save: save
  };
})();
