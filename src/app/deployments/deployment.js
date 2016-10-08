angular.module('app')
  .controller('DeploymentController', DeploymentController);

/** @ngInject */
function DeploymentController($scope) {
  var deployments = $scope.$parent.$parent.$ctrl;
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

  this.cpu = cpu;
  this.memory = memory;
  this.instances = instances;

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'synchronization:undeployed') || _.includes(response.data.tags, 'synchronization:deployed')) {
      deployments.peek();
    }
  });
}
