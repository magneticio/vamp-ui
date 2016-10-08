angular.module('app')
  .controller('GatewayController', GatewayController);

/** @ngInject */
function GatewayController($scope) {
  this.gateway = $scope.$parent.$parent.artifact;
}
