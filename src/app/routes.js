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
      artifactsData.template = '<artifacts kind="' + artifact.kind + '"></artifacts>';
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
      .state(artifact.kind + '/add', artifactAddData)
      .state(artifact.kind + '/edit/:name', artifactEditData);
  });
}
