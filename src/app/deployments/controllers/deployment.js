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
  var lastUpdate;

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
          toastr.success('Deployment \'' + $ctrl.title + '\' deletion has been started.');
        })
        .catch(function (response) {
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
      $vamp.put(path + '/clusters/' + cluster.name + '/services/' + service.breed.name + '/scale', angular.toJson(scale))
        .then(function () {
          toastr.success('Scale update for service \'' + service.breed.name + '\' has been accepted.');
          $vamp.emit(path);
        })
        .catch(function (response) {
          toastr.error(response.data.message, 'Scale update for service \'' + service.breed.name + '\' failed.');
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

  $vamp.emit(path).catch(function () {
    $state.go('^');
    alert.show('Error', 'Deployment \'' + $stateParams.name + '\' cannot be found.', 'OK', null, function () {
    });
  });

  var updated = _.throttle(function (response) {
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
  }, 1000, {
    leading: true,
    trailing: false
  });

  $scope.$on(path, function (e, response) {
    if (response.statusText !== 'OK') {
      return;
    }
    updated(response);
    $timeout(peekEvents, 0);
  });

  var rootScopeUnregister = $rootScope.$on('/vamp/settings/update', function () {
    $state.reload();
  });

  $scope.$on('$destroy', function () {
    rootScopeUnregister();
    charts.invalidate();
    stopPolling();
  });

  $scope.$on('/events/stream', function (e, response) {
    var event = response.data;
    if ($ctrl.deployment) {
      onEvent(event);
    }
  });

  $scope.$on('/events', function (e, response) {
    $timeout(function () {
      _.forEach(response.data, onEvent);
    }, 0);
  });

  function onEvent(event) {
    if (_.includes(event.tags, 'deployments:' + $ctrl.deployment.name)) {
      var archive = _.includes(event.tags, 'archive');
      var synchronization = _.includes(event.tags, 'synchronization');
      if (archive || synchronization) {
        var scaleUpdate = _.find(event.tags, function (tag) {
          return tag.indexOf('deployment-service-scales:' + $ctrl.deployment.name) === 0;
        });
        var promise = (synchronization || scaleUpdate) && isNewUpdate(event) ? $vamp.emit(path) : $vamp.get(path);
        promise.catch(function () {
          $ctrl.deployment.clusters = {};
          alert.show('Warning', '\'' + $ctrl.deployment.name + '\' has been deleted in background. Do you want to leave or stay on this page?', 'Leave', 'Stay', function () {
            $state.go('^');
          });
        });
      } else {
        chartUpdate(event);
      }
    }
  }

  function isNewUpdate(event) {
    var timestamp = new Date(event.timestamp).getTime();
    if (!lastUpdate || lastUpdate < timestamp) {
      lastUpdate = timestamp;
      return true;
    }
    return false;
  }

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
        {tag: [nameTag, 'deployment', 'synchronization'], timestamp: {gte: 'now-' + Ui.config.chartResolution + 'm'}},
        {tag: [nameTag, 'deployment', 'health'], timestamp: {gte: 'now-' + Ui.config.chartResolution + 'm'}},
        {tag: [nameTag, 'allocation'], timestamp: {gte: 'now-' + Ui.config.chartResolution + 'm'}}
      ],
      _.flatMap(_.map(services, function (service) {
        return [
          {
            tag: [nameTag, 'service', 'health', 'services:' + service.breed.name],
            timestamp: {gte: 'now-' + Ui.config.chartResolution + 'm'}
          }
        ];
      }))
    );
    _.forEach(requests, function (request) {
      $vamp.emit('/events', request);
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

    charts.invalidate();
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
      var scale = JSON.parse(event.value);
      appendToChart('cpu', scale.cpu, event.timestamp);
      appendToChart('memory', scale.memory, event.timestamp);
    }
  }

  function appendToChart(id, value, timestamp) {
    timestamp = timestamp || Date.now();
    timestamp = Number.isInteger(timestamp) ? timestamp : new Date(timestamp).getTime();
    charts.append(id, timestamp, value, $ctrl.last);
  }

  $ctrl.proxy = function (cluster, service, instance, port, $event) {
    var path = '/proxy/deployments/' + $ctrl.deployment.name + '/clusters/' + cluster.name + '/services/' + service.breed.name + '/instances/' + instance.name + '/ports/' + port + '/';
    path = $vamp.namespacePath() + path;
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
