(function () {
  'use strict';

  angular.module('BlurAdmin.pages.blueprints.readAll', [])
    .config(routeConfig).config(function(){

    });

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('blueprints.readAll', {
          url: '/readAll',
          templateUrl: 'app/pages/blueprints/blueprintsReadAll/blueprintsReadAll.html',
          title: 'BlueprintsreadAll',
          controller: 'BlueprintsReadAllController as blueprints',
          sidebarMeta: {
            order: 300,
          }
        });
  }

})();