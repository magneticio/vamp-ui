/* global VAMP */

angular.module('vamp-ui').config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider) {
  var external = VAMP.External;
  var artifacts = VAMP.Artifacts.prototype.all();

  if (external && external.artifacts) {
    artifacts = artifacts.concat(external.artifacts());
  }

  var artifactKinds = _.map(artifacts, function (a) {
    return a.kind;
  });

  var emptyController = ['$scope', function () {}];

  var artifactsResolve = {
    artifactsMetadata: ['$stateParams', function ($stateParams) {
      return _.find(artifacts, {kind: $stateParams.kind});
    }],
    typeConfig: ['$stateParams', function ($stateParams) {
      return {
        type: $stateParams.kind,
        path: '/' + $stateParams.kind
      };
    }]
  };

  if (!external) {
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
      parent: external && external.name || 'vamp',
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
      resolve: external && external.resolve || artifactsResolve,
      views: {
        "main@vamp": {
          controllerProvider: function (artifactsMetadata) {
            if (artifactsMetadata.artifactsMainView) {
              return artifactsMetadata.artifactsMainView.controller;
            }

            return artifactsMetadata.mainController;
          },
          templateProvider: function ($templateCache, artifactsMetadata) {
            if (artifactsMetadata.artifactsMainView) {
              return $templateCache.get(artifactsMetadata.artifactsMainView.templateUrl);
            }

            return $templateCache.get('app/crud/artifacts.html');
          },
          controllerAs: '$ctrl'
        },
        "right-panel@vamp": {
          controllerProvider: function (artifactsMetadata) {
            if (artifactsMetadata.artifactsRightPanel) {
              return artifactsMetadata.artifactsRightPanel.controller;
            }

            return emptyController;
          },
          controllerAs: '$ctrl',
          templateProvider: function ($templateCache, artifactsMetadata) {
            if (artifactsMetadata.artifactsRightPanel) {
              return $templateCache.get(artifactsMetadata.artifactsRightPanel.templateUrl);
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
        },
        model: function (artifactsMetadata) {
          return artifactsMetadata.model || artifactsMetadata.kind;
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
            if (artifactsMetadata.oneMainView) {
              return artifactsMetadata.oneMainView.controller;
            }

            return emptyController;
          },
          controllerAs: '$ctrl',
          templateProvider: function ($templateCache, artifactsMetadata) {
            if (artifactsMetadata.oneMainView) {
              return $templateCache.get(artifactsMetadata.oneMainView.templateUrl);
            }

            return '';
          }
        }
      },
      resolve: {
        artifactData: function ($vamp, $stateParams, artifactsMetadata) {
          var model = (artifactsMetadata.model || artifactsMetadata.kind);
          return $vamp.get('/' + model + '/' + $stateParams.name)
            .then(function (response) {
              return response.data;
            });
        },
        singular: function (artifactsMetadata) {
          return artifactsMetadata.kind.substring(0, artifactsMetadata.kind.length - 1);
        },
        model: function (artifactsMetadata) {
          return artifactsMetadata.model || artifactsMetadata.kind;
        }
      },
      data: {
        allowedKinds: ['deployments', 'gateways'],
        breadcrumb: {
          title: '{{ singular | capitalize }} : {{ artifactData.metadata.title || artifactData.name }}'
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
        },
        "right-panel@vamp": {
          controller: 'revisionsController as $ctrl',
          templateUrl: 'app/crud/templates/revisions.html'
        }
      }
    })
    .state('artifacts.one.source.view', {
      url: '/view',
      views: {
        editor: {
          templateUrl: 'app/crud/templates/editor.html'
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
      parent: external && external.name || 'vamp',
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
