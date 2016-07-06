(function () {
  'use strict';

  angular.module('BlurAdmin.pages.blueprints.create', [])
    .config(routeConfig).config(function(){

    });

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('blueprints.create', {
          url: '/create',
          templateUrl: 'app/pages/blueprints/blueprintsCreate/blueprintsCreate.html',
          title: 'Blueprintscreate',
          sidebarMeta: {
            order: 300,
          }
        });
  }

})();