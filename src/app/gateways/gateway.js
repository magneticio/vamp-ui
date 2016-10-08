angular.module('app')
  .controller('GatewayController', GatewayController);

/** @ngInject */
function GatewayController($scope) {
  var gateways = $scope.$parent.$parent.$ctrl;
  this.gateway = $scope.$parent.$parent.artifact;

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'synchronization:undeployed') || _.includes(response.data.tags, 'synchronization:deployed')) {
      gateways.peek();
    }
  });
}
