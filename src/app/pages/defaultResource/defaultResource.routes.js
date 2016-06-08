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
        controller: 'DefaultResourceController as main',
      })
      .state('root.update', {
        url: '/:resource/:name/edit',
        templateUrl: 'app/pages/defaultResource/editDefaultResource.html',
        controller: 'EditDefaultResourceController as edit',

      });

    $urlRouterProvider.otherwise('/');
  }

})();
