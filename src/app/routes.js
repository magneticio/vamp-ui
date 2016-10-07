/* global Artifacts */
angular.module('app').config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider) {
  var artifacts = Artifacts.prototype.all();

  var url = function (artifact) {
    return '/' + artifact.kind;
  };

  var template = function (artifact) {
    return '<artifacts kind="' + artifact.kind + '"> </artifacts>';
  };

  $urlRouterProvider.otherwise(url(artifacts[0]));

  _.forEach(artifacts, function (artifact) {
    $stateProvider.state(artifact.kind, {
      url: url(artifact),
      template: template(artifact)
    });
  });
}
