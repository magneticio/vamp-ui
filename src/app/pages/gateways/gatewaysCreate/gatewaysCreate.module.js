(function () {
  'use strict';

  angular.module('BlurAdmin.pages.gateways.create', [])
    .config(routeConfig).config(function(){

    });

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('gateways.create', {
          url: '/create',
          templateUrl: 'app/pages/gateways/gatewaysCreate/gatewaysCreate.html',
          title: 'Gatewayscreate',
          sidebarMeta: {
            order: 300,
          }
        });
  }

})();