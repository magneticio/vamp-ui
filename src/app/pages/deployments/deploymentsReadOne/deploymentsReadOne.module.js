(function () {
  'use strict';

  angular.module('BlurAdmin.pages.deployments.readOne', [])
    .config(routeConfig).config(function(){

    });

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('deployments.readOne', {
          url: '/readOne',
          templateUrl: 'app/pages/deployments/deploymentsReadOne/deploymentsReadOne.html',
          title: 'DeploymentsreadOne',
          sidebarMeta: {
            order: 300,
          }
        });
  }

})();