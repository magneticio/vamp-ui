angular
  .module('app')
  .config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/blueprints');

  $stateProvider
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
      template: '<read-one-deployment> </read-one-deployment>'
    })
    .state('updateDeployment', {
      url: '/deployments/edit/:id',
      template: '<update-deployment> </update-deployment>'
    })
    .state('readAllGateways', {
      url: '/gateways',
      template: '<read-all-gateways> </read-all-gateways>'
    })
    .state('createGateway', {
      url: '/gateways/create',
      template: '<create-gateway> </create-gateway>'
    })
    .state('readOneGateway', {
      url: '/gateways/:id',
      template: '<read-one-gateway> </read-one-gateway>'
    })
    .state('updateGateway', {
      url: '/gateways/edit/:id',
      template: '<update-gateway> </update-gateway>'
    })
    .state('readAllBreeds', {
      url: '/breeds',
      template: '<read-all-breeds> </read-all-breeds>'
    })
    .state('createBreed', {
      url: '/breeds/create',
      template: '<create-breed> </create-breed>'
    })
    .state('updateBreed', {
      url: '/breeds/edit/:id',
      template: '<update-breed> </update-breed>'
    })
    .state('readAllEvents', {
      url: '/events',
      template: '<read-all-events> </read-all-events>'
    });
}
