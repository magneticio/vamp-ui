/* global VAMP */

angular.module('vamp-ui')
 .config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider) {
  var artifacts = VAMP.Artifacts.prototype.all();
  var eeRouting = VAMP.EnterpriseRoutingConfig;

  var artifactKinds = _.map(artifacts, function (a) {
    return a.kind;
  });

  var emptyController = ['$scope', function () {
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
      data: {
        breadcrumb: {
          title: 'Vamp'
        }
      }
    })
    .state('artifacts', {
      parent: eeRouting && eeRouting.rootName || 'vamp',
      url: '/{kind:(?:' + artifactKinds.join('|') + ')}?page&searchTerm',
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
      data: {
        breadcrumb: {
          title: '{{ artifactsMetadata.kind | capitalize }}'
        }
      }
    })
    .state('artifacts.add', {
      url: '/add',
      views: {
        "main@vamp": {
          controller: 'addController as $ctrl',
          templateUrl: 'app/crud/templates/addArtifact.html'
        }
      },
      resolve: {
        singular: function (artifactsMetadata) {
          return artifactsMetadata.kind.substring(0, artifactsMetadata.kind.length - 1);
        }
      },
      params: {
        importData: undefined
      },
      data: {
        breadcrumb: {
          title: 'New {{ singular }}'
        }
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
        }
      },
      resolve: {
        artifactData: function ($vamp, $stateParams) {
          return $vamp.get('/' + $stateParams.kind + '/' + $stateParams.name)
            .then(function (response) {
              var artifact = response.data;

              return artifact;
            });
        },
        singular: function (artifactsMetadata) {
          return artifactsMetadata.kind.substring(0, artifactsMetadata.kind.length - 1);
        }
      },
      data: {
        allowedKinds: ['deployments', 'gateways'],
        breadcrumb: {
          title: '{{ singular | capitalize }} : {{ artifactData.name }}'
        }
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
      data: {
        breadcrumb: {
          title: 'View source'
        }
      }
    })
    .state('artifacts.one.source.edit', {
      url: '/edit',
      views: {
        editor: {
          templateUrl: 'app/crud/templates/editor.html'
        }
      },
      data: {
        breadcrumb: {
          title: 'Edit source'
        }
      }
    })
    .state('artifacts.one.cluster', {
      abstract: true,
      url: '^/vamp/{kind:deployments}/:name/:cluster',
      controller: function ($state) {
        $state.go('^');
      },
      resolve: {
        clusterData: function ($vamp, $stateParams) {
          return $vamp.get('/' + $stateParams.kind + '/' + $stateParams.name)
            .then(function (response) {
              var artifact = response.data;

              return artifact.clusters[$stateParams.cluster];
            });
        }
      },
      data: {
        breadcrumb: {
          title: 'Cluster : {{ clusterData.name }}'
        }
      }
    })
    .state('artifacts.one.cluster.service', {
      url: '/:service',
      views: {
        "main@vamp": {
          controller: 'serviceController as $ctrl',
          templateUrl: 'app/deployments/templates/service.html'
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
      data: {
        breadcrumb: {
          title: 'Service : {{ $stateParams.service }}'
        }
      }
    })
    .state('artifacts.one.cluster.service.instance', {
      url: '/:instance',
      views: {
        "main@vamp": {
          controller: 'instanceController as $ctrl',
          templateUrl: 'app/deployments/templates/instance.html'
        }
      },
      data: {
        breadcrumb: {
          title: 'Instance : {{ $stateParams.instance }}'
        }
      }
    })
    .state('admin', {
      parent: eeRouting && eeRouting.rootName || 'vamp',
      url: '/admin',
      abstract: true
    })
    .state('admin.vga', {
      url: '/vga',
      views: {
        "main@vamp": {
          controller: 'vgaController as $ctrl',
          templateUrl: 'app/system/templates/vgaConfiguration.html'
        }
      },
      data: {
        breadcrumb: {
          title: 'VGA configuration'
        }
      }
    })
    .state('admin.log', {
      url: '/log',
      views: {
        "main@vamp": {
          controller: 'logController as $ctrl',
          templateUrl: 'app/system/templates/log.html'
        }
      },
      data: {
        breadcrumb: {
          title: 'Log'
        }
      }
    })
    .state('admin.info', {
      url: '/info',
      views: {
        "main@vamp": {
          controller: 'infoController as $ctrl',
          templateUrl: 'app/system/templates/infoConfiguration.html'
        }
      },
      data: {
        breadcrumb: {
          title: 'Extended info'
        }
      }
    })
    .state('admin.configuration', {
      url: '/configuration',
      views: {
        "main@vamp": {
          controller: 'configurationController as $ctrl',
          templateUrl: 'app/system/templates/backendConfiguration.html'
        }
      },
      data: {
        breadcrumb: {
          title: 'Backend configuration'
        }
      }
    });
}
