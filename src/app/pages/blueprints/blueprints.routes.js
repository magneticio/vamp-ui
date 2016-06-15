(function() {
  'use strict';

  angular
    .module('revampUi')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('root.blueprints', {
        url: '/blueprints',
        templateUrl: 'app/pages/blueprints/readAllBlueprints.html',
        controller: 'ReadAllBlueprints as readAllBlueprints'
      })
      .state('root.blueprints.read', {
        url: '/:id',
        views: {
          '@root' : {
            templateUrl: 'app/pages/blueprints/readOneBlueprint.html',
            controller: 'ReadOneBlueprint as readOneBlueprint'
          }
        }
      });

    // $urlRouterProvider.otherwise('/');
  }

})();
