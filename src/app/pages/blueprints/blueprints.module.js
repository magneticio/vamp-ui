(function () {
  'use strict';

  angular.module('BlurAdmin.pages.blueprints', [
      'BlurAdmin.pages.blueprints.readAll',
      'BlurAdmin.pages.blueprints.update',
      'BlurAdmin.pages.blueprints.create'

  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('blueprints', {
          url: '/blueprints',
          abstract: true,
          template: '<div ui-view></div>',
          title: 'Blueprints',
          sidebarMeta: {
            icon: 'ion-stats-bars',
            order: 150,
          },
        });
  }

})();
