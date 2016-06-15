(function() {
  'use strict';

  angular
    .module('revampUi')
    .constant('artifactsConfig', {
      deployments          : true,
      gateways             : true,
      blueprints           : true,
      breeds               : true,
      workflows            : false,
      "scheduled-workflows": true,
      filters              : false,
      scales               : false,
      slas                 : false,
      escalations          : false,
      events               : false
    })
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
  }

})();
