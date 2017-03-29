/* global VAMP */

angular.module('vamp-ui')
  .config(function ($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
      templateUrl: 'app/common/templates/breadcrumb.html',
      includeAbstract: true
    });
  })
   .config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider) {
  var artifacts = VAMP.Artifacts.prototype.all();
  var eeRouting = VAMP.EnterpriseRoutingConfig;

  var emptyController = ['$scope', function ($scope) {
    $scope.ncyBreadcrumbIgnore = true;
  }];

  if (!eeRouting) {
    $urlRouterProvider.otherwise('/vamp/deployments');
  }

  $stateProvider
    .state('vamp', {
      url: '/vamp',
      abstract: true,
      views: {
        app: {
          templateUrl: 'app/home/templates/home.html'
        }
      },
      ncyBreadcrumb: {
        skip: true
      }
    })
    .state('artifacts', {
      parent: eeRouting && eeRouting.rootName || 'vamp',
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
        "main@vamp": {
          controllerProvider: function (artifactsMetadata) {
            return artifactsMetadata.mainController;
          },
          templateUrl: 'app/crud/artifacts.html',
          controllerAs: '$ctrl'
        },
        "right-panel@vamp": {
          controllerProvider: function (artifactsMetadata) {
            if (artifactsMetadata.listViewRightPanel) {
              return artifactsMetadata.listViewRightPanel.controller;
            }

            return emptyController;
          },
          controllerAs: '$ctrl',
          templateProvider: function ($templateCache, artifactsMetadata) {
            if (artifactsMetadata.listViewRightPanel) {
              return $templateCache.get(artifactsMetadata.listViewRightPanel.templateUrl);
            }

            return '';
          }
        }
      },
      ncyBreadcrumb: {
        label: '{{ $ctrl.kind }}'
      }
    })
    .state('artifacts.add', {
      url: '/add',
      views: {
        "main@vamp": {
          controller: 'addController as $ctrl',
          templateUrl: 'app/crud/templates/addArtifact.html'
        },
        "right-panel@vamp": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      params: {
        importData: undefined
      },
      ncyBreadcrumb: {
        label: 'New {{ $ctrl.singular }}',
        showLast: true
      }
    })
    .state('artifacts.one', {
      url: '/:name',
      views: {
        "main@vamp": {
          controllerProvider: function (artifactsMetadata) {
            return artifactsMetadata.artifactViewController;
          },
          controllerAs: '$ctrl',
          templateUrl: function (params) {
            return _.find(artifacts, {kind: params.kind}).artifactViewTemplate;
          }
        },
        "right-panel@vamp": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      resolve: {
        artifactData: function ($vamp, $stateParams) {
          return $vamp.get('/' + $stateParams.kind + '/' + $stateParams.name)
            .then(function (response) {
              var artifact = response.data;

              return artifact;
            });
        }
      },
      data: {
        allowedKinds: ['deployments', 'gateways']
      },
      ncyBreadcrumb: {
        label: '{{ $ctrl.kind.substring(0, $ctrl.kind.length - 1) }} : {{ $ctrl.name }}'
      }
    })
    .state('artifacts.one.source', {
      abstract: true,
      url: '/source',
      views: {
        "main@vamp": {
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
        "right-panel@vamp": {
          controller: 'revisionsController as $ctrl',
          templateUrl: 'app/crud/templates/revisions.html'
        }
      },
      ncyBreadcrumb: {
        label: 'View source',
        showLast: true
      }
    })
    .state('artifacts.one.source.edit', {
      url: '/edit',
      views: {
        "editor": {
          templateUrl: 'app/crud/templates/editor.html'
        },
        "right-panel@vamp": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      ncyBreadcrumb: {
        label: 'Edit source',
        showLast: true
      }
    })
    .state('artifacts.one.cluster', {
      abstract: true,
      url: '^/{kind:deployments}/:name/:cluster',
      resolve: {
        clusterData: function ($vamp, $stateParams) {
          return $vamp.get('/' + $stateParams.kind + '/' + $stateParams.name)
            .then(function (response) {
              var artifact = response.data;

              return artifact.clusters[$stateParams.cluster];
            });
        }
      },
      ncyBreadcrumb: {
        label: 'Cluster : {{ $ctrl.cluster }}'
      }
    })
    .state('artifacts.one.cluster.service', {
      url: '/:service',
      views: {
        "main@vamp": {
          controller: 'serviceController as $ctrl',
          templateUrl: 'app/deployments/templates/service.html'
        },
        "right-panel@vamp": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      resolve: {
        serviceData: function ($vamp, $stateParams) {
          return $vamp.get('/' + $stateParams.kind + '/' + $stateParams.name)
            .then(function (response) {
              var artifact = response.data;

              return _.find(artifact.clusters[$stateParams.cluster].services, ['breed.name', $stateParams.service]);
            });
        }
      },
      ncyBreadcrumb: {
        label: 'Service : {{ $ctrl.serviceName }}'
      }
    })
    .state('artifacts.one.cluster.service.instance', {
      url: '/:instance',
      views: {
        "main@vamp": {
          controller: 'instanceController as $ctrl',
          templateUrl: 'app/deployments/templates/instance.html'
        },
        "right-panel@vamp": {
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
        "main@vamp": {
          controller: 'vgaController as $ctrl',
          templateUrl: 'app/system/templates/vgaConfiguration.html'
        },
        "right-panel@vamp": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      ncyBreadcrumb: {
        label: 'VGA configuration',
        showLast: true
      }
    })
    .state('admin.log', {
      url: '/log',
      views: {
        "main@vamp": {
          controller: 'logController as $ctrl',
          templateUrl: 'app/system/templates/log.html'
        },
        "right-panel@vamp": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      ncyBreadcrumb: {
        label: 'Log',
        showLast: true
      }
    })
    .state('admin.info', {
      url: '/info',
      views: {
        "main@vamp": {
          controller: 'infoController as $ctrl',
          templateUrl: 'app/system/templates/infoConfiguration.html'
        },
        "right-panel@vamp": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      ncyBreadcrumb: {
        label: 'Extended info',
        showLast: true
      }
    })
    .state('admin.configuration', {
      url: '/configuration',
      views: {
        "main@vamp": {
          controller: 'configurationController as $ctrl',
          templateUrl: 'app/system/templates/backendConfiguration.html'
        },
        "right-panel@vamp": {
          controller: function ($scope) {
            $scope.ncyBreadcrumbIgnore = true;
          },
          template: ''
        }
      },
      ncyBreadcrumb: {
        label: 'Backend configuration',
        showLast: true
      }
    });
}
