/* global Artifacts */
angular.module('app').config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider) {
  var artifacts = Artifacts.prototype.all();

  $urlRouterProvider.otherwise('/' + artifacts[0].kind);

  _.forEach(artifacts, function (artifact) {
    $stateProvider.state(artifact.kind, {
      url: '/' + artifact.kind,
      template: '<artifacts kind="' + artifact.kind + '"> </artifacts>'
    }).state(artifact.kind + '/manage/:name', {
      url: '/' + artifact.kind + '/manage/:name',
      template: '<manage kind="' + artifact.kind + '"> </manage>'
    });
  });
}
