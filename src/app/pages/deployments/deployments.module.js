(function () {
  'use strict';

  angular.module('BlurAdmin.pages.deployments', [
      'BlurAdmin.pages.deployments.readAll',
      'BlurAdmin.pages.deployments.readOne'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('deployments', {
          url: '/deployments',
          abstract: true,
          template: '<div ui-view></div>',
          title: 'Deployments',
          sidebarMeta: {
            icon: 'ion-stats-bars',
            order: 150,
          },
        });
  }

})();
