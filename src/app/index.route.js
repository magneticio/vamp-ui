(function() {
  'use strict';

  angular
    .module('revampUi')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('defaultResource', {
        url: '/:resource',
        templateUrl: 'app/pages/defaultResource/defaultResource.html',
        controller: 'DefaultResource',
        controllerAs: 'main'
      })
      
    $urlRouterProvider.otherwise('/');
  }

})();
