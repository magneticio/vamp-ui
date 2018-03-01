/* global TimeSeriesCharts, Ui */
angular.module('vamp-ui').controller('DeploymentController', DeploymentController);

/** @ngInject */
function DeploymentController(uiStatesFactory, $rootScope, $scope, $stateParams, $timeout, $interval, $state, $vamp, $vampDeployment, $uibModal, snippet, alert, toastr, $authorization) {
  var $ctrl = this;
  var path = '/deployments/' + $stateParams.name;

  this.deployment = null;
  this.kind = $stateParams.kind;
  this.title = this.name = $stateParams.name;

  var original;
  var services;
  var addedServices = [];
  var charts = new TimeSeriesCharts();

  this.last = [];
  var polling;

  $ctrl.readOnly = function () {
    return $authorization.readOnly('deployments');
  };

  this.edit = function () {
    $state.go('.source.view');
  };

  this.delete = function () {
    alert.show('Warning', 'Are you sure you want to delete deployment \'' + $ctrl.deployment.name + '\'?', 'Delete', 'Cancel', function () {
      $vamp.delete(path, JSON.stringify(original))
        .then(function () {
          $state.go('^');
          toastr.success('Deployment \'' + $ctrl.title + '\' has been successfully deleted.');
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
      $vamp.httpPut(path + '/clusters/' + cluster.name + '/services/' + service.breed.name + '/scale', angular.toJson(scale))
        .then(function () {
          toastr.success('Scale for service \'' + service.breed.name + '\' has been successfully updated.');
        }).catch(function (response) {
          toastr.error(response.data.message, 'Update of scale for service \'' + service.breed.name + '\' failed.');
        });
    });
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

  $vamp.get(path).catch(function () {
    $state.go('^');
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

    startPolling();
  });

  var rootScopeUnregister = $rootScope.$on('/vamp/settings/update', function () {
    stopPolling();
    startPolling();
  });

  $scope.$on('$destroy', function () {
    rootScopeUnregister();
    charts.invalidate();
    stopPolling();
  });

  $scope.$on('/events/stream', function (e, response) {
    var event = response.data;
    if ($ctrl.deployment) {
      if (_.includes(event.tags, 'deployments:' + $ctrl.deployment.name)) {
        if (_.includes(event.tags, 'synchronization') || _.includes(event.tags, 'archive')) {
          $vamp.get(path)
          .catch(function () {
            $ctrl.deployment.clusters = {};
            alert.show('Warning', '\'' + $ctrl.deployment.name + '\' has been deleted in background. Do you want to leave or stay on this page?', 'Leave', 'Stay', function () {
              $state.go('^');
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
      }, 2000);
    }
  }

  function peekEvents() {
    var nameTag = 'deployments:' + $ctrl.deployment.name;
    var requests = _.concat(
      [
        {tags: [nameTag, 'deployment', 'health'], timestamp: {gte: 'now-' + Ui.config.chartResolution + 'm'}},
        {tags: [nameTag, 'allocation'], timestamp: {gte: 'now-' + Ui.config.chartResolution + 'm'}}
      ],
      _.flatMap(_.map(services, function (service) {
        return [
          {tags: [nameTag, 'service', 'health', 'services:' + service.breed.name], timestamp: {gte: 'now-' + Ui.config.chartResolution + 'm'}}
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

  $ctrl.proxy = function (cluster, service, instance, port, $event) {
    var path = '/proxy/deployments/' + $ctrl.deployment.name + '/clusters/' + cluster.name + '/services/' + service.breed.name + '/instances/' + instance.name + '/ports/' + port + '/';
    if ($vamp.getRequestNamespace()) {
      path = $vamp.getRequestNamespace() + '/' + path;
    } else if ($vamp.getConnectionNamespace()) {
      path = $vamp.getConnectionNamespace() + '/' + path;
    }
    if ($vamp.baseUrl) {
      path = window.location.protocol + '//' + $vamp.baseUrl + path;
    }
    if ($event) {
      uiStatesFactory.setProxyPanelViewState(path);
      uiStatesFactory.setInfoPanelViewState(false);
      uiStatesFactory.setHelpPanelViewState(false);
      uiStatesFactory.setConfigPanelViewState(false);
    }
    return path;
  };

  function startPolling() {
    if (Ui.config.chartPollingPeriod > 0 && !polling) {
      peekEvents();
      polling = $interval(peekEvents, Ui.config.chartPollingPeriod * 1000);
    }
  }

  function stopPolling() {
    $interval.cancel(polling);
    polling = undefined;
  }
}
