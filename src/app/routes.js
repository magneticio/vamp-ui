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

    var artifactAddData = {
      url: '/' + artifact.kind + '/add',
      template: '<add kind="' + artifact.kind + '"></add>'
    };

    var artifactViewData = {
      url: '/' + artifact.kind + '/view/:name',
      template: '<edit kind="' + artifact.kind + '"></edit>'
    };

    var artifactEditData = {
      url: '/' + artifact.kind + '/edit/:name',
      template: '<edit kind="' + artifact.kind + '"></edit>'
    };

    $stateProvider
      .state(artifact.kind, artifactsData)
      .state(artifact.kind + '/add', artifactAddData)
      .state(artifact.kind + '/view/:name*', artifactViewData)
      .state(artifact.kind + '/edit/:name*', artifactEditData);
  });
}
