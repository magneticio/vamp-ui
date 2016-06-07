(function() {
  'use strict';

  angular
    .module('revampUi')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('root.main', {
        url: '/:resource',
        templateUrl: 'app/main/main.html',
        controller: 'MainController as main',
      });

    $urlRouterProvider.otherwise('/');
  }

})();
