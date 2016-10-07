/* global Artifacts */
angular.module('app').config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider) {
  var artifacts = Artifacts.prototype.all();

  $urlRouterProvider.otherwise('/' + artifacts[0].kind);

  _.forEach(artifacts, function (artifact) {
    $stateProvider
      .state(artifact.kind, {
        url: '/' + artifact.kind,
        template: '<artifacts kind="' + artifact.kind + '"> </artifacts>'
      })
      .state(artifact.kind + '/add', {
        url: '/' + artifact.kind + '/add',
        template: '<add kind="' + artifact.kind + '"> </add>'
      })
      .state(artifact.kind + '/edit/:name', {
        url: '/' + artifact.kind + '/edit/:name',
        template: '<edit kind="' + artifact.kind + '"> </edit>'
      });
  });
}
