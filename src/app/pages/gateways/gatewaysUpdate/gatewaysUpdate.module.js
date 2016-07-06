(function () {
  'use strict';

  angular.module('BlurAdmin.pages.gateways.update', [])
    .config(routeConfig).config(function(){

    });

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('gateways.update', {
          url: '/update',
          templateUrl: 'app/pages/gateways/gatewaysUpdate/gatewaysUpdate.html',
          title: 'Gatewaysupdate',
          sidebarMeta: {
            order: 300,
          }
        });
  }

})();