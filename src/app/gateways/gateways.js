angular.module('app').controller('GatewaysController', function ($scope) {
  var $parent = $scope.$parent.$parent.$ctrl;
  this.gateway = $scope.$parent.$parent.artifact;
  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'synchronization')) {
      $parent.peek();
    }
  });
});
