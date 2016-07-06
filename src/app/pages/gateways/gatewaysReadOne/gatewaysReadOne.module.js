(function () {
  'use strict';

  angular.module('BlurAdmin.pages.gateways.readOne', [])
    .config(routeConfig).config(function(){

    });

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('gateways.readOne', {
          url: '/readOne',
          templateUrl: 'app/pages/gateways/gatewaysReadOne/gatewaysReadOne.html',
          title: 'GatewaysreadOne',
          sidebarMeta: {
            order: 300,
          }
        });
  }

})();