angular
  .module('app')
  .config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('app', {
      url: '/',
      template: '<navbar></navbar><app></app>'
    })
    .state('readAllBlueprints', {
      url: '/blueprints',
      template: '<read-all-blueprints> </read-all-blueprints>'
    })
    .state('createBlueprint', {
      url: '/blueprints/create',
      template: '<create-blueprint> </create-blueprint>'
    })
    .state('updateBlueprint', {
      url: '/blueprints/edit/:id',
      template: '<update-blueprint> </update-blueprint>'
    })
    .state('readAllDeployments', {
      url: '/deployments',
      template: '<read-all-deployments> </read-all-deployments>'
    })
    .state('readOneDeployment', {
      url: '/deployments/:id',
      template: '<read-one-deployments> </read-one-deployments>'
    })
    .state('readAllGateways', {
      url: '/gateways',
      template: '<read-all-gateways> </read-all-gateways>'
    })
    .state('readOneGateway', {
      url: '/gateways/:id',
      template: '<read-one-gateways> </read-one-gateways>'
    })
    .state('createGateway', {
      url: '/gateways/create',
      template: '<create-gateway> </create-gateway>'
    })
    .state('updateGateway', {
      url: '/gateways/edit/:id',
      template: '<update-gateway> </update-gateway>'
    })

}
