/* global TimeSeriesCharts */
angular.module('app').controller('DeploymentController', DeploymentController);

/** @ngInject */
function DeploymentController($scope, $stateParams, $timeout, $location, $vamp, deployment, snippet, alert, toastr) {
  var $ctrl = this;
  var path = '/deployments/' + $stateParams.name;

  this.deployment = null;
  this.title = $stateParams.name;

  var original;
  var services;
  var addedServices = [];
  var charts = new TimeSeriesCharts();

  this.last = [];

  this.edit = function () {
    $location.path('/deployments/edit/' + this.deployment.name).search({back: '/deployments/view/' + this.deployment.name});
  };

  this.delete = function () {
    alert.show('Warning', 'Are you sure you want to delete deployment \'' + $ctrl.deployment.name + '\'?', 'Delete', 'Cancel', function () {
      $vamp.await(function () {
        $vamp.remove(path, JSON.stringify(original));
      }).then(function () {
        $location.path('/deployments');
        toastr.success('Deployment \'' + $ctrl.deployment.name + '\' has been successfully deleted.');
      }).catch(function (response) {
        if (response) {
          toastr.error(response.data.message, 'Deletion of deployment \'' + $ctrl.deployment.name + '\' failed.');
        } else {
          toastr.error('Server timeout.', 'Deletion of deployment \'' + $ctrl.deployment.name + '\' failed.');
        }
      });
    });
  };

  this.serviceStatus = deployment.serviceStatus;

  this.editScale = function (cluster, service) {
    snippet.show('Edit Scale', header(cluster, service) + angular.toJson(service.scale, 2));
  };

  this.showInstances = function (cluster, service) {
    var instances = '';
    _.forEach(service.instances, function (instance) {
      instances += '- name: ' + instance.name + '\n';
      instances += '  deployed: ' + instance.deployed + '\n';
      instances += '  host: ' + instance.host + '\n';
      if (instance.ports) {
        instances += '  ports:\n';
        _.forEach(instance.ports, function (number, port) {
          instances += '  - ' + port + ' : ' + number + '\n';
        });
      }
      instances += '\n';
    });
    snippet.show('Instances', header(cluster, service) + instances, 'lg');
  };

  this.showEnvironmentVariables = function (cluster, service) {
    var longest = _.reduce(service.environment_variables, function (longest, e) {
      return e.name.length > longest ? e.name.length : longest;
    }, 0);
    var lines = _.sortBy(service.environment_variables, ['name.length', 'name']).map(function (env) {
      return _.padEnd(env.name, longest, ' ') + ' : ' + env.value;
    });
    snippet.show('Environment Variables', header(cluster, service) + lines.join('\n'), 'lg');
  };

  this.addedService = function (cluster, service) {
    return _.includes(addedServices, cluster.name + '/' + service.breed.name);
  };

  $vamp.await(function () {
    $vamp.peek(path);
  }).catch(function () {
    $location.path('/deployments');
    alert.show('Error', 'Deployment \'' + $stateParams.name + '\' cannot be found.', 'OK', null, function () {
    });
  });

  $scope.$on(path, function (e, response) {
    if (response.status === 'ERROR') {
      return;
    }
    var created = !$ctrl.deployment;

    original = response.data;
    updateAddedServices(original);
    $ctrl.deployment = angular.copy(original);
    services = deployment.services($ctrl.deployment);
    updateServices();

    $timeout(updateCharts, 0);

    $timeout(function () {
      if (created) {
        $scope.$on('deployments/' + response.data.name + '/scale', function (e, data) {
          appendToChart('cpu', data.scale.cpu, data.timestamp);
          appendToChart('memory', data.scale.memory, data.timestamp);
        });
      }
      _.forEach(deployment.peekScales(response.data) || [], function (data) {
        appendToChart('cpu', data.scale.cpu, data.timestamp);
        appendToChart('memory', data.scale.memory, data.timestamp);
      });
    }, 0);

    peekEvents();
  });

  $scope.$on('$destroy', function () {
    charts.invalidate();
  });

  $scope.$on('/events/stream', function (e, response) {
    var event = response.data;
    if ($ctrl.deployment && _.includes(event.tags, 'deployments:' + $ctrl.deployment.name)) {
      if (_.includes(event.tags, 'synchronization')) {
        $vamp.await(function () {
          $vamp.peek(path);
        }).catch(function () {
          $ctrl.deployment.clusters = {};
          alert.show('Warning', '\'' + $ctrl.deployment.name + '\' has been deleted in background.', 'Leave', 'Stay', function () {
            $location.path('/deployments');
          });
        });
      } else {
        chartUpdate(event);
      }
    }
  });

  $scope.$on('/events', function (e, response) {
    $timeout(function () {
      _.forEach(response.data, function (event) {
        if ($ctrl.deployment && _.includes(event.tags, 'deployments:' + $ctrl.deployment.name)) {
          chartUpdate(event);
        }
      });
    }, 0);
  });

  function header(cluster, service) {
    var header = '# cluster: ' + cluster.name + '\n';
    header += '# service: ' + service.breed.name + '\n\n';
    return header;
  }

  function updateServices() {
    _.forEach(services, function (service) {
      var vars = [];
      _.forEach(service.environment_variables, function (v, n) {
        vars.push({
          name: n,
          value: v
        });
      });
      service.environment_variables = _.sortBy(vars, ['name.length', 'name']);
    });
  }

  function updateAddedServices(deployment) {
    function flatten(d) {
      return _.flatMap(d.clusters, function (cluster, clusterName) {
        return _.map(cluster.services, function (service) {
          return clusterName + '/' + service.breed.name;
        });
      });
    }

    if ($ctrl.deployment) {
      addedServices = _.difference(flatten(deployment), flatten($ctrl.deployment));
      $timeout(function () {
        addedServices = [];
      }, 5000);
    }
  }

  function peekEvents() {
    var nameTag = 'deployments:' + $ctrl.deployment.name;
    var requests = _.concat(
      [
        {tags: [nameTag, 'deployment', 'health'], timestamp: {gte: 'now-1m'}}
      ],
      _.flatMap(_.map(services, function (service) {
        return [
          {tags: [nameTag, 'service', 'health', 'services:' + service.breed.name], timestamp: {gte: 'now-1m'}}
        ];
      }))
    );
    _.forEach(requests, function (request) {
      $vamp.peek('/events', JSON.stringify(request));
    });
  }

  function updateCharts() {
    var definitions = _.concat(
      [
        {canvasId: 'health', type: TimeSeriesCharts.healthChart},
        {canvasId: 'memory', type: TimeSeriesCharts.chart},
        {canvasId: 'cpu', type: TimeSeriesCharts.chart, chartOptions: {labels: {precision: 1}}}
      ],
      _.map(services, function (service) {
        return {canvasId: 'health-' + service.breed.name, type: TimeSeriesCharts.healthSparkline};
      })
    );

    charts.define(definitions);

    _.forEach(definitions, function (definition) {
      appendToChart(definition.canvasId);
    });
  }

  function chartUpdate(event) {
    if (_.includes(event.tags, 'health')) {
      if (_.includes(event.tags, 'deployment')) {
        appendToChart('health', 100 * Number(event.value), event.timestamp);
      } else if (_.includes(event.tags, 'service')) {
        var service = _.find(services, function (s) {
          return _.includes(event.tags, 'services:' + s.breed.name);
        });
        if (service) {
          appendToChart('health-' + service.breed.name, 100 * Number(event.value), event.timestamp);
        }
      }
    }
  }

  function appendToChart(id, value, timestamp) {
    timestamp = timestamp || Date.now();
    timestamp = Number.isInteger(timestamp) ? timestamp : new Date(timestamp).getTime();
    charts.append(id, timestamp, value, $ctrl.last);
  }
}
