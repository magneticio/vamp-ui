(function() {
  'use strict';

  angular
    .module('revampUi')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('root', {
        abstract: true,
        views   : {
          'navigation' : {
            controller : 'NavigationController as navigation',
            templateUrl: 'app/components/navigation/navigation.html'
          },
          'main'       : {
            template   : '<ui-view></ui-view>'
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  }

})();
