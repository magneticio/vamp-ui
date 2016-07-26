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
      template: '<menu></menu><navbar></navbar><app></app>'
    })
    .state('readAllBlueprints', {
      url: '/blueprints',
      template: '<menu></menu><read-all-blueprints> </read-all-blueprints>'
    })
    .state('createBlueprint', {
      url: '/blueprints/create',
      template: '<menu></menu><create-blueprint> </create-blueprint>'
    })
    .state('updateBlueprint', {
      url: '/blueprints/edit/:id',
      template: '<menu></menu><update-blueprint> </update-blueprint>'
    })
    .state('readAllDeployments', {
      url: '/deployments',
      template: '<menu></menu><read-all-deployments> </read-all-deployments>'
    })
    .state('readOneDeployment', {
      url: '/deployments/:id',
      template: '<menu></menu><read-one-deployment> </read-one-deployment>'
    })
    .state('readAllGateways', {
      url: '/gateways',
      template: '<menu></menu><read-all-gateways> </read-all-gateways>'
    })
    .state('createGateway', {
      url: '/gateways/create',
      template: '<menu></menu><create-gateway> </create-gateway>'
    })
    .state('readOneGateway', {
      url: '/gateways/:id',
      template: '<menu></menu><read-one-gateways> </read-one-gateways>'
    })
    .state('updateGateway', {
      url: '/gateways/edit/:id',
      template: '<menu></menu><update-gateway> </update-gateway>'
    })

}
