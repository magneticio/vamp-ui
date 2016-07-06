(function () {
  'use strict';

  angular.module('BlurAdmin.pages.gateways', [
      'BlurAdmin.pages.gateways.readAll',
      'BlurAdmin.pages.gateways.update',
      'BlurAdmin.pages.gateways.create',
      'BlurAdmin.pages.gateways.readOne'

  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('gateways', {
          url: '/gateways',
          abstract: true,
          template: '<div ui-view></div>',
          title: 'Gateways',
          sidebarMeta: {
            icon: 'ion-stats-bars',
            order: 150,
          },
        });
  }

})();
