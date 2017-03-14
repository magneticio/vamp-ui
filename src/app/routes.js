/* global Artifacts */
/* global Environment */

angular.module('app')
  .config(function ($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
      templateUrl: 'app/common/templates/breadcrumb.html',
      includeAbstract: true
    });
  })
   .config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider) {
  var artifacts = Artifacts.prototype.all();

  var origin = Environment.prototype.origin() || window.location.host;

  $urlRouterProvider.otherwise('/vamp/deployments');

  $stateProvider
    .state('vamp', {
      abstract: true,
      url: '/vamp',
      ncyBreadcrumb: {
        skip: true
      }
    })
    .state('artifacts', {
      parent: 'vamp',
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
        },
        "right-panel@": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      ncyBreadcrumb: {
        label: '{{ $ctrl.kind }}',
        hideIfCurrent: true
      }
    })
    .state('artifacts.add', {
      url: '/add',
      views: {
        "main@": {
          controller: 'addController as $ctrl',
          templateUrl: 'app/crud/templates/addArtifact.html'
        },
        "right-panel@": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      ncyBreadcrumb: {
        label: 'New {{ $ctrl.singular }}'
      }
    })
    .state('artifacts.one', {
      url: '/:name',
      views: {
        "main@": {
          controllerProvider: function (artifactsMetadata) {
            return artifactsMetadata.artifactViewController;
          },
          controllerAs: '$ctrl',
          templateUrl: function (params) {
            return _.find(artifacts, {kind: params.kind}).artifactViewTemplate;
          }
        },
        "right-panel@": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      resolve: {
        artifactData: function ($http, $stateParams) {
          return $http({
            method: 'GET',
            url: 'http://' + origin + '/api/v1/' + $stateParams.kind + '/' + $stateParams.name
          }).then(function (response) {
            var artifact = response.data;

            return artifact;// _.find(clusterServices, ['breed.name', $stateParams.service]);
          });
        }
      },
      data: {
        allowedKinds: ['deployments', 'gateways']
      },
      ncyBreadcrumb: {
        label: '{{ $ctrl.name }}'
      }
    })
    .state('artifacts.one.source', {
      abstract: true,
      url: '/source',
      views: {
        "main@": {
          controller: 'edit as $ctrl',
          templateUrl: 'app/crud/edit.html'
        }
      },
      ncyBreadcrumb: {
        skip: true
      }
    })
    .state('artifacts.one.source.view', {
      url: '/view',
      views: {
        "editor": {
          templateUrl: 'app/crud/templates/editor.html'
        },
        "right-panel@": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }/*
        "right-panel@": {
          controller: 'revisionsController as $ctrl',
          templateUrl: 'app/crud/templates/revisions.html'
        }*/
      },

      ncyBreadcrumb: {
        label: 'View source'
      }
    })
    .state('artifacts.one.source.edit', {
      url: '/edit',
      views: {
        "editor": {
          // controller: 'edit as $ctrl',
          templateUrl: 'app/crud/templates/editor.html'
        },
        "right-panel@": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      ncyBreadcrumb: {
        label: 'Edit source'
      }
    })
    .state('artifacts.one.cluster', {
      abstract: true,
      url: '^/{kind:deployments}/:name/:cluster',
      resolve: {
        clusterData: function (artifactData, $stateParams) {
          return artifactData.clusters[$stateParams.cluster];
        }
      },
      ncyBreadcrumb: {
        label: '{{ $ctrl.cluster }}'
      }
    })
    .state('artifacts.one.cluster.service', {
      url: '/:service',
      views: {
        "main@": {
          controller: 'serviceController as $ctrl',
          templateUrl: 'app/deployments/templates/service.html'
        },
        "right-panel@": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      resolve: {
        serviceData: function (clusterData, $stateParams) {
          return _.find(clusterData.services, ['breed.name', $stateParams.service]);
        }
      },
      ncyBreadcrumb: {
        label: '{{ $ctrl.serviceName }}'
      }
    })
    .state('artifacts.one.cluster.service.instance', {
      url: '/:instance',
      views: {
        "main@": {
          controller: 'instanceController as $ctrl',
          templateUrl: 'app/deployments/templates/instance.html'
        },
        "right-panel@": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      ncyBreadcrumb: {
        label: '{{ $ctrl.instanceName }}'
      }
    })
    .state('admin', {
      url: '/admin',
      abstract: true
    })
    .state('admin.vga', {
      url: '/vga',
      views: {
        "main@": {
          controller: 'vgaController as $ctrl',
          templateUrl: 'app/system/templates/vgaConfiguration.html'
        },
        "right-panel@": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      ncyBreadcrumb: {
        label: 'VGA configuration'
      }
    })
    .state('admin.log', {
      url: '/log',
      views: {
        "main@": {
          controller: 'logController as $ctrl',
          templateUrl: 'app/system/templates/log.html'
        },
        "right-panel@": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      ncyBreadcrumb: {
        label: 'Log'
      }
    })
    .state('admin.info', {
      url: '/info',
      views: {
        "main@": {
          controller: 'infoController as $ctrl',
          templateUrl: 'app/system/templates/infoConfiguration.html'
        },
        "right-panel@": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      ncyBreadcrumb: {
        label: 'Extended info'
      }
    })
    .state('admin.configuration', {
      url: '/configuration',
      views: {
        "main@": {
          controller: 'configurationController as $ctrl',
          templateUrl: 'app/system/templates/backendConfiguration.html'
        },
        "right-panel@": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      ncyBreadcrumb: {
        label: 'Backend configuration'
      }
    });
}
