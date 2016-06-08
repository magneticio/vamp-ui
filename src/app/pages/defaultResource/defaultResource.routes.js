(function() {
  'use strict';

  angular
    .module('revampUi')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('root.default', {
        url: '/:resource',
        templateUrl: 'app/pages/defaultResource/defaultResource.html',
        controller: 'DefaultResourceController as main',
      });

    $urlRouterProvider.otherwise('/');
  }

})();
