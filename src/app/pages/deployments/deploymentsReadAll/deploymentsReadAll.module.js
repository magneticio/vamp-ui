(function () {
  'use strict';

  angular.module('BlurAdmin.pages.deployments.readAll', [])
    .config(routeConfig).config(function(){

    });

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('deployments.readAll', {
          url: '/readAll',
          templateUrl: 'app/pages/deployments/deploymentsReadAll/deploymentsReadAll.html',
          title: 'DeploymentsreadAll',
          sidebarMeta: {
            order: 300,
          }
        });
  }

})();