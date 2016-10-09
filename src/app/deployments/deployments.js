angular.module('app')
  .controller('DeploymentsController', DeploymentsController);

/** @ngInject */
function DeploymentsController($scope, $filter) {
  var $parent = $scope.$parent.$parent.$ctrl;
  this.deployment = $scope.$parent.$parent.artifact;

  var cpu = 0;
  var memory = 0;
  var instances = 0;

  _.forEach(this.deployment.clusters, function (cluster) {
    _.forEach(cluster.services, function (service) {
      var scale = service.scale;
      instances += scale.instances;
      cpu += scale.instances * scale.cpu;
      memory += scale.instances * parseInt(scale.memory, 10);
    });
  });

  this.cpu = Number($filter('number')(cpu, 2));
  this.memory = Number($filter('number')(memory, 2));
  this.instances = instances;

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'synchronization')) {
      $parent.peek();
    }
  });
}
