(function() {
  'use strict';

  angular
    .module('revampUi')
    .constant('artifactsConfig', {
      breeds     : true,
      blueprints : true,
      deployments: true,
      escalations: true,
      events     : true,
      filter     : true,
      gateways   : true,
      scales     : true,
      slas       : true,
      workflow   : true
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
