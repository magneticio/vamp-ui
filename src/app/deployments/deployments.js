angular.module('app')
  .controller('DeploymentsController', DeploymentsController)
  .factory('deployment', ['$filter', function ($filter) {
    return new DeploymentService($filter);
  }]);

/** @ngInject */
function DeploymentsController($scope, deployment) {
  var $parent = $scope.$parent.$parent.$ctrl;
  this.deployment = $scope.$parent.$parent.artifact;
  this.scale = deployment.scale(this.deployment);
  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'synchronization')) {
      $parent.peek();
    }
  });
}

function DeploymentService($filter) {
  this.scale = function (deployment) {
    var cpu = 0;
    var memory = 0;
    var instances = 0;
    _.forEach(deployment.clusters, function (cluster) {
      _.forEach(cluster.services, function (service) {
        var scale = service.scale;
        instances += scale.instances;
        cpu += scale.instances * scale.cpu;
        memory += scale.instances * parseInt(scale.memory, 10);
      });
    });
    return {
      cpu: Number($filter('number')(cpu, 2)),
      memory: Number($filter('number')(memory, 2)),
      instances: instances
    };
  };
}