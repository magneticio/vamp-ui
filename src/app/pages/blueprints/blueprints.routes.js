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
        controller: 'ReadAllBlueprints as readAllBlueprints',
      })
      // .state('root.update', {
      //   url: '/:resource/:id/edit',
      //   templateUrl: 'app/pages/defaultResource/editDefaultResource.html',
      //   controller: 'EditDefaultResourceController as editResource',

      // });

    // $urlRouterProvider.otherwise('/');
  }

})();
