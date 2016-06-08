(function() {
  'use strict';

  angular
    .module('revampUi')
    .constant('artifactsConfig', {
      breeds     : false,
      blueprints : true,
      deployments: true,
      escalations: false,
      events     : false,
      filter     : false,
      gateways   : true,
      scales     : false,
      slas       : false,
      workflow   : false
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
