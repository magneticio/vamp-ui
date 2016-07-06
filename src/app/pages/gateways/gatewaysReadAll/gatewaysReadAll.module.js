(function () {
  'use strict';

  angular.module('BlurAdmin.pages.gateways.readAll', [])
    .config(routeConfig).config(function(){

    });

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('gateways.readAll', {
          url: '/readAll',
          templateUrl: 'app/pages/gateways/gatewaysReadAll/gatewaysReadAll.html',
          title: 'GatewaysreadAll',
          sidebarMeta: {
            order: 300,
          }
        });
  }

})();