(function() {
  'use strict';

  angular
    .module('revampUi')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('root.readall', {
        url: '/:resource',
        templateUrl: 'app/pages/defaultResource/defaultResource.html',
        controller: 'DefaultResourceController as readAllResource',
      })
      .state('root.detail', {
        url: '/:resource/:id',
        templateUrl: 'app/pages/defaultResource/editDefaultResource.html',
        controller: 'EditDefaultResourceController as editResource',
      })
      .state('root.update', {
        url: '/:resource/:id/edit',
        templateUrl: 'app/pages/defaultResource/editDefaultResource.html',
        controller: 'EditDefaultResourceController as editResource',
      });

    $urlRouterProvider.otherwise('/');
  }

})();
