angular.module('app').config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/blueprints');

  $stateProvider.state('blueprints', {
    url: '/blueprints',
    template: '<list artifact="blueprint"> </list>'
  });
}
