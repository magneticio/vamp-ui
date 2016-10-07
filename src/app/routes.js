/* global Artifacts */
angular.module('app').config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider) {
  var artifacts = Artifacts.prototype.all();

  // $urlRouterProvider.otherwise('/' + artifacts[0].kind);
  $urlRouterProvider.otherwise('/breeds/view/kibana');

  _.forEach(artifacts, function (artifact) {
    $stateProvider.state(artifact.kind, {
      url: '/' + artifact.kind,
      template: '<artifacts kind="' + artifact.kind + '"> </artifacts>'
    }).state(artifact.kind + '/view/:name', {
      url: '/' + artifact.kind + '/view/:name',
      template: '<view kind="' + artifact.kind + '"> </view>'
    });
  });
}
