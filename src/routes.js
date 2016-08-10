angular
  .module('app')
  .config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/blueprints');

  $stateProvider
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
      template: '<menu></menu><read-one-gateway> </read-one-gateway>'
    })
    .state('updateGateway', {
      url: '/gateways/edit/:id',
      template: '<menu></menu><update-gateway> </update-gateway>'
    })
    .state('readAllBreeds', {
      url: '/breeds',
      template: '<menu></menu><read-all-breeds> </read-all-breeds>'
    })
    .state('createBreed', {
      url: '/breeds/create',
      template: '<menu></menu><create-breed> </create-breed>'
    })
    .state('updateBreed', {
      url: '/breeds/edit/:id',
      template: '<menu></menu><update-breed> </update-breed>'
    })
    .state('readAllWorkflows', {
      url: '/workflows',
      template: '<menu></menu><read-all-workflows> </read-all-workflows>'
    })
    .state('createWorkflow', {
      url: '/workflows/create',
      template: '<menu></menu><create-workflow> </create-workflow>'
    })
    .state('updateWorkflow', {
      url: '/workflows/edit/:id',
      template: '<menu></menu><update-workflow> </update-workflow>'
    });
}
