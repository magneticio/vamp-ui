angular.module('app')
  .controller('DeploymentsController', DeploymentsController)
  .factory('deployment', ['$rootScope', '$interval', '$filter', '$vamp', function ($rootScope, $interval, $filter, $vamp) {
    return new DeploymentService($rootScope, $interval, $filter, $vamp);
  }])
  .run(["deployment", function (deployment) {
    deployment.init();
  }]);

/** @ngInject */
function DeploymentsController($scope, deployment) {
  var $ctrl = this;
  var $parent = $scope.$parent.$parent.$ctrl;
  this.deployment = $scope.$parent.$parent.artifact;

  this.scale = deployment.scale($ctrl.deployment);
  this.status = deployment.deploymentStatus($ctrl.deployment);

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'synchronization')) {
      $parent.peek();
    }
  });
}

/** @ngInject */
function DeploymentService($rootScope, $interval, $filter, $vamp) {
  var $this = this;
  var scales = {};
  var scalePeriod = 5000;

  this.init = function () {
    $vamp.peek('/deployments');
    $interval(function () {
      $vamp.peek('/deployments');
    }, scalePeriod);
  };

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

  this.peekScales = function (deployment) {
    return scales[deployment.name];
  };

  this.deploymentStatus = function (deployment) {
    var services = this.services(deployment);
    for (var i = 0; i < services.length; i++) {
      var status = $this.serviceStatus(services[i]);
      if (status === 'failed' || status === 'updating') {
        return status;
      }
    }
    return 'running';
  };

  this.services = function (deployment) {
    return _.flatMap(deployment.clusters, function (cluster) {
      return cluster.services;
    });
  };

  this.serviceStatus = function (service) {
    var status = service.state.step.name.toLowerCase();
    if (status === 'failure') {
      return 'failed';
    } else if (status === 'initiated' || status === 'update') {
      return 'updating';
    }
    return 'running';
  };

  this.serviceLookup = function (service) {
    return service.breed.name;
  };

  var onDeployments = _.throttle(function (deployments) {
    var now = Date.now();
    _.forEach(deployments, function (deployment) {
      var scale = {
        scale: $this.scale(deployment),
        timestamp: now
      };
      if (!scales[deployment.name]) {
        scales[deployment.name] = [];
      }
      scales[deployment.name].unshift(scale);
      $rootScope.$broadcast('deployments/' + deployment.name + '/scale', scale);
      while (scales[deployment.name][scales[deployment.name].length - 1].timestamp + 60000 < now) {
        scales[deployment.name].pop();
      }
    });
  }, scalePeriod / 2, {leading: true, trailing: false});

  $rootScope.$on('/deployments', function (e, response) {
    if (response.status === 'OK') {
      onDeployments(response.data);
    }
  });
}
