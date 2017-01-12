/* global Artifacts */
angular.module('app').config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider) {
  var artifacts = Artifacts.prototype.all();

  $urlRouterProvider.otherwise('/' + artifacts[0].kind);

  _.forEach(artifacts, function (artifact) {
    var artifactsData = {url: '/' + artifact.kind};

    if (artifact.artifactsTemplate) {
      artifactsData.templateUrl = artifact.artifactsTemplate;
    } else {
      artifactsData.templateUrl = 'app/' + artifact.kind + '/' + artifact.kind + '.html';
    }

    var artifactViewData = {url: '/' + artifact.kind + '/view/:name'};

    if (artifact.artifactViewTemplate) {
      artifactViewData.templateUrl = artifact.artifactViewTemplate;
    } else {
      artifactViewData.template = '<edit kind="' + artifact.kind + '"></edit>';
    }

    var artifactAddData = {
      url: '/' + artifact.kind + '/add',
      template: '<add kind="' + artifact.kind + '"></add>'
    };

    var artifactEditData = {
      url: '/' + artifact.kind + '/edit/:name',
      template: '<edit kind="' + artifact.kind + '"></edit>'
    };

    $stateProvider
      .state(artifact.kind, artifactsData)
      .state(artifact.kind + 'Add', artifactAddData)
      .state(artifact.kind + 'View', artifactViewData)
      .state(artifact.kind + 'Edit', artifactEditData);
  });

  $stateProvider.state('vga', {url: '/vga', template: '<vga></vga>'});
  $stateProvider.state('info', {url: '/info', template: '<info></info>'});
  $stateProvider.state('configuration', {url: '/configuration', template: '<configuration></configuration>'});
}
