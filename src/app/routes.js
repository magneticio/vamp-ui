/* global Artifacts */
angular.module('app').config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider) {
  var artifacts = Artifacts.prototype.all();

  $urlRouterProvider.otherwise('/' + artifacts[0].kind);

  _.forEach(artifacts, function (artifact) {
    var artifactsData = {
      url: '/' + artifact.kind + '?page&searchTerm',
      data: artifact,
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
      views: {
        main: {
          templateUrl: ''
        }
      }
    };

    if (artifact.artifactsTemplate) {
      artifactsData.views.main.templateUrl = artifact.artifactsTemplate;
    } else {
      artifactsData.views.main.templateUrl = 'app/' + artifact.kind + '/' + artifact.kind + '.html';
    }

    var artifactViewData = {
      url: '/' + artifact.kind + '/view/:name',
      views: {
        main: {
          templateUrl: ''
        }
      }
    };

    if (artifact.artifactViewTemplate) {
      artifactViewData.views.main.templateUrl = artifact.artifactViewTemplate;
    } else {
      artifactViewData.views.main.template = '<edit kind="' + artifact.kind + '"></edit>';
    }

    var artifactAddData = {
      url: '/' + artifact.kind + '/add',
      views: {
        main: {
          template: '<add kind="' + artifact.kind + '"></add>'
        }
      }
    };

    var artifactEditData = {
      url: '/' + artifact.kind + '/edit/:name',
      views: {
        main: {
          template: '<edit kind="' + artifact.kind + '"></edit>'
        }
      }
    };

    $stateProvider
      .state(artifact.kind, artifactsData)
      .state(artifact.kind + 'Add', artifactAddData)
      .state(artifact.kind + 'View', artifactViewData)
      .state(artifact.kind + 'Edit', artifactEditData);
  });

  $stateProvider.state('vga', {url: '/vga', views: {main: {template: '<vga></vga>'}}});
  $stateProvider.state('log', {url: '/log', views: {main: {template: '<log></log>'}}});
  $stateProvider.state('info', {url: '/info', views: {main: {template: '<info></info>'}}});
  $stateProvider.state('configuration', {url: '/configuration', views: {main: {template: '<configuration></configuration>'}}});
}
