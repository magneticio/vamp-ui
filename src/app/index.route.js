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
      .state('index.dashboard', {
        url: '/minor',
        templateUrl: 'app/minor/minor.html',
        data: { pageTitle: 'Example view' }
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
        url: '/blueprints/:id',
        templateUrl: 'app/pages/editBlueprint/editBlueprint.html',
        controller: 'EditBlueprintController as blueprint',
        data: { pageTitle: 'Example view' }
      })      
      .state('index.deployments', {
        url: '/minor',
        templateUrl: 'app/minor/minor.html',
        data: { pageTitle: 'Example view' }
      })      
      .state('index.gateways', {
        url: '/minor',
        templateUrl: 'app/minor/minor.html',
        data: { pageTitle: 'Example view' }
      });

    $urlRouterProvider.otherwise('index/blueprints');
  }

})();
