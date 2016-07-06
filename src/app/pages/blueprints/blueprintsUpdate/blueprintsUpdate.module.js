(function () {
  'use strict';

  angular.module('BlurAdmin.pages.blueprints.update', [])
    .config(routeConfig).config(function(){

    });

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('blueprints.update', {
          url: '/update',
          templateUrl: 'app/pages/blueprints/blueprintsUpdate/blueprintsUpdate.html',
          title: 'Blueprintsupdate',
          sidebarMeta: {
            order: 300,
          }
        });
  }

})();