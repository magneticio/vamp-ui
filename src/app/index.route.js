(function() {
  'use strict';

  angular
    .module('inspinia')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('index', {
        abstract: true,
        url: '/index',
        templateUrl: 'app/components/common/content.html'
      }) 
      .state('index.blueprints', {
        url: '/blueprints',
        templateUrl: 'app/pages/readAllBlueprints/readAllBlueprints.html',
        controller: 'ReadAllBlueprintsController as blueprints',
        data: { pageTitle: 'Example view' }
      })  
      .state('index.createBlueprint', {
        url: '/blueprints/create',
        templateUrl: 'app/pages/createBlueprint/createBlueprint.html',
        controller: 'CreateBlueprintController as blueprint',
        data: { pageTitle: 'Example view' }
      })           
      .state('index.editBlueprint', {
        url: '/blueprints/edit/:id',
        templateUrl: 'app/pages/editBlueprint/editBlueprint.html',
        controller: 'EditBlueprintController as blueprint',
        data: { pageTitle: 'Example view' }
      })
      .state('index.deployments', {
        url: '/deployments',
        templateUrl: 'app/pages/readAllDeployments/readAllDeployments.html',
        controller: 'ReadAllDeploymentsController as deployments',
        data: { pageTitle: 'Example view' }
      })     
      .state('index.readDeployment', {
        url: '/deployments/:id',
        templateUrl: 'app/pages/readDeployment/readDeployment.html',
        controller: 'ReadDeploymentController as deployment',
        data: { pageTitle: 'Example view' }
      })
      .state('index.gateways', {
        url: '/gateways',
        templateUrl: 'app/pages/readAllGateways/readAllGateways.html',
        controller: 'ReadAllGatewaysController as gateways',
        data: { pageTitle: 'Example view' }
      })
      .state('index.editGateway', {
        url: '/gateways/edit/:id',
        templateUrl: 'app/pages/editGateway/editGateway.html',
        controller: 'EditGatewayController as gateway',
        data: { pageTitle: 'Example view' }
      })
      .state('index.createGateway', {
        url: '/gateways/create',
        templateUrl: 'app/pages/createGateway/createGateway.html',
        controller: 'CreateGatewayController as gateway',
        data: { pageTitle: 'Example view' }
      })
      .state('index.readGateway', {
        url: '/gateways/:id',
        templateUrl: 'app/pages/readGateway/readGateway.html',
        controller: 'ReadGatewayController as gateway',
        data: { pageTitle: 'Example view' }
      })   

    $urlRouterProvider.otherwise('index/blueprints');
  }

})();
