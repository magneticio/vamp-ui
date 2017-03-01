/* global Artifacts */
angular.module('app')
   .config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider) {
  var artifacts = Artifacts.prototype.all();

  $urlRouterProvider.otherwise('/deployments');

  $stateProvider
    .state('artifacts', {
      url: '/:kind?page&searchTerm',
      params: {
        page: {
          value: '1',
          squash: true
        },
        searchTerm: {
          value: '',
          squash: true
        }
      },
      resolve: {
        artifactsMetadata: function ($stateParams) {
          return _.find(artifacts, {kind: $stateParams.kind});
        }
      },
      views: {
        "main@": {
          controllerProvider: function (artifactsMetadata) {
            return artifactsMetadata.mainController;
          },
          templateUrl: 'app/crud/artifacts.html',
          controllerAs: '$ctrl'
        }
      },
      ncyBreadcrumb: {
        label: '{{ $ctrl.kind }}'
      }
    })
    .state('artifacts.add', {
      url: '/add',
      views: {
        "main@": {
          controller: 'addController as $ctrl',
          templateUrl: 'app/crud/templates/addArtifact.html'
        }
      },
      ncyBreadcrumb: {
        label: 'New {{ $ctrl.singular }}'
      }
    })
    .state('artifacts.view', {
      url: '/:name/view',
      views: {
        "main@": {
          controllerProvider: function (artifactsMetadata) {
            return artifactsMetadata.artifactViewController;
          },
          controllerAs: '$ctrl',
          templateUrl: function (params) {
            return _.find(artifacts, {kind: params.kind}).artifactViewTemplate;
          }
        }
      },
      resolve: {
        artifactsMetadata: function ($stateParams) {
          return _.find(artifacts, {kind: $stateParams.kind});
        }
      },
      data: {
        allowedKinds: ['deployments', 'gateways']
      },
      ncyBreadcrumb: {
        label: '{{ $ctrl.title }}'
      }
    })
    .state('artifacts.view.source', {
      url: '/source',
      views: {
        "main@": {
          controller: 'edit as $ctrl',
          templateUrl: 'app/crud/edit.html'
        }
      },
      ncyBreadcrumb: {
        label: 'View source'
      }
    });

  $stateProvider.state('vga', {url: '/vga', views: {main: {template: '<vga></vga>'}}});
  $stateProvider.state('log', {url: '/log', views: {main: {template: '<log></log>'}}});
  $stateProvider.state('info', {url: '/info', views: {main: {template: '<info></info>'}}});
  $stateProvider.state('configuration', {url: '/configuration', views: {main: {template: '<configuration></configuration>'}}});
}
