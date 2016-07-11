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
    .state('readOneDeployment', {
      url: '/deployment',
      template: '<navbar></navbar><deployment></deployment>'
    })
    .state('readAllBlueprints', {
      url: '/blueprints',
      template: '<navbar></navbar><blueprints></blueprints>'
    })
    .state('createBlueprint', {
      url: '/blueprints/create',
      template: '<navbar></navbar><blueprints-create></blueprints-create>'
    });
}
