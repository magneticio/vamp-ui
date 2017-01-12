/* global TimeSeriesCharts */
angular.module('app').controller('DeploymentController', DeploymentController);

/** @ngInject */
function DeploymentController($scope, $stateParams, $timeout, $location, $vamp, $vampDeployment, $uibModal, snippet, alert, toastr) {
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

  this.serviceStatus = $vampDeployment.serviceStatus;

  this.editScale = function (cluster, service) {
    $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'editScale',
      resolve: {
        deployment: function () {
          return $ctrl.deployment;
        },
        cluster: function () {
          return cluster;
        },
        service: function () {
          return service;
        }
      }
    }).result.then(function (scale) {
      $vamp.await(function () {
        $vamp.put(path + '/clusters/' + cluster.name + '/services/' + service.breed.name + '/scale', angular.toJson(scale));
      }).then(function () {
        toastr.success('Scale for service \'' + service.breed.name + '\' has been successfully updated.');
      }).catch(function (response) {
        toastr.error(response.data.message, 'Update of scale for service \'' + service.breed.name + '\' failed.');
      });
    });
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
    original = response.data;
    updateAddedServices(original);
    $ctrl.deployment = angular.copy(original);
    services = $vampDeployment.services($ctrl.deployment);
    updateServices();

    $timeout(updateCharts, 0);

    $timeout(function () {
      _.forEach($vampDeployment.peekScales(response.data) || [], function (data) {
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
    if ($ctrl.deployment) {
      if (_.includes(event.tags, 'deployments:' + $ctrl.deployment.name)) {
        if (_.includes(event.tags, 'synchronization') || _.includes(event.tags, 'archive')) {
          $vamp.await(function () {
            $vamp.peek(path);
          }).catch(function () {
            $ctrl.deployment.clusters = {};
            alert.show('Warning', '\'' + $ctrl.deployment.name + '\' has been deleted in background. Do you want to leave or stay on this page?', 'Leave', 'Stay', function () {
              $location.path('/deployments');
            });
          });
        } else {
          chartUpdate(event);
        }
      } else {
        var scaleUpdate = _.find(event.tags, function (tag) {
          return tag.indexOf('deployment-service-scales:' + $ctrl.deployment.name) === 0;
        });
        if (scaleUpdate) {
          $vamp.peek(path);
        }
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

  $scope.$on('$vamp:connection', function (event, connection) {
    if (connection === 'opened') {
      $vamp.peek(path);
    }
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
      service.scale.memory = parseInt(service.scale.memory, 10) + ' MB';
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
        {tags: [nameTag, 'deployment', 'health'], timestamp: {gte: 'now-1m'}},
        {tags: [nameTag, 'allocation'], timestamp: {gte: 'now-1m'}}
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
    } else if (_.includes(event.tags, 'allocation')) {
      appendToChart('cpu', event.value.cpu, event.timestamp);
      appendToChart('memory', event.value.memory, event.timestamp);
    }
  }

  function appendToChart(id, value, timestamp) {
    timestamp = timestamp || Date.now();
    timestamp = Number.isInteger(timestamp) ? timestamp : new Date(timestamp).getTime();
    charts.append(id, timestamp, value, $ctrl.last);
  }
}
