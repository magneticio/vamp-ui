/* global TimeSeriesCharts, Ui */
/* eslint-disable no-new */
angular.module('vamp-ui').controller('GatewayController', GatewayController);

/** @ngInject */
function GatewayController($rootScope, $scope, $filter, $stateParams, $timeout, $interval, $state, $vamp, uiStatesFactory, slider, alert, toastr, $uibModal, $authorization) {
  var $ctrl = this;
  var path = '/gateways/' + $stateParams.name;

  this.gateway = null;
  this.kind = $stateParams.kind;
  this.name = $stateParams.name;
  this.title = $filter('decodeName')($stateParams.name);

  var charts = new TimeSeriesCharts();

  this.last = [];
  var addedRoutes = [];
  this.sliderOptions = slider.weightOptions;

  var polling;
  var lastUpdate;

  $ctrl.readOnly = function () {
    return $authorization.readOnly('gateways');
  };

  this.edit = function () {
    $state.go('.source.view');
  };

  this.openBuilder = function (name) {
    var gateway = angular.copy($ctrl.gateway);
    $uibModal.open({
      animation: true,
      backdrop: 'static',
      controller: 'conditionBuilderController',
      templateUrl: 'app/gateways/templates/conditionBuilder.html',
      windowClass: 'condition-builder-modal',
      resolve: {
        url: function () {
          return 'conditionbuilder/index.html';
        },
        conditionBuilderObject: function () {
          return gateway.routes[name].metadata;
        }
      }
    }).result.then((function (r) {
      this.saveCondition(name, r.shortcodes, r.builder);
    }).bind(this));
  };

  this.delete = function () {
    alert.show('Warning', 'Are you sure you want to delete gateway \'' + $ctrl.gateway.name + '\'?', 'Delete', 'Cancel', function () {
      $vamp.delete(path)
        .then(function () {
          $state.go('^');
          toastr.success('Gateway \'' + $ctrl.gateway.name + '\' has been successfully deleted.');
        })
        .catch(function (response) {
          if (response) {
            toastr.error(response.data.message, 'Deletion of gateway \'' + $ctrl.gateway.name + '\' failed.');
          } else {
            toastr.error('Server timeout.', 'Deletion of gateway \'' + $ctrl.gateway.name + '\' failed.');
          }
        });
    });
  };

  this.editWeights = function () {
    $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'editWeights',
      resolve: {
        gateway: function () {
          return $ctrl.gateway;
        }
      }
    }).result.then(function (weights) {
      var gateway = angular.copy($ctrl.gateway);
      _.forEach(weights, function (weight, route) {
        gateway.routes[route].weight = weight;
      });
      save(gateway, 'Weight has been successfully updated.');
    });
  };

  this.saveCondition = function (route, condition, conditionBuilderObject) {
    var gateway = angular.copy($ctrl.gateway);
    if (!condition || condition.trim().length === 0) {
      gateway.routes[route].condition = null;
      gateway.routes[route].condition_strength = '0%';
    } else if (condition && (condition.startsWith('reference:') || condition.startsWith('ref:'))) {
      var colonIndex = condition.indexOf(':');
      condition = condition.substring(colonIndex + 1);

      gateway.routes[route].condition = {
        reference: condition
      };
    } else {
      gateway.routes[route].condition = condition;
    }

    if (conditionBuilderObject) {
      gateway.routes[route].metadata = conditionBuilderObject;
    }

    save(gateway, 'Condition has been successfully updated.');
  };

  this.saveConditionStrength = function (route, strength) {
    var gateway = angular.copy($ctrl.gateway);
    gateway.routes[route].condition_strength = strength + '%';
    save(gateway, 'Condition strength has been successfully updated.');
  };

  this.stickyValues = ['not sticky', 'route', 'instance'];

  this.sticky = function (value) {
    var gateway = angular.copy($ctrl.gateway);
    if (value === 'route' || value === 'instance') {
      gateway.sticky = value;
    } else {
      gateway.sticky = null;
    }
    if (gateway.sticky !== $ctrl.gateway) {
      save(gateway, 'Sticky value has been successfully updated.');
    }
  };

  this.addedRoute = function (route) {
    return _.includes(addedRoutes, route.lookup_name);
  };

  $vamp.emit(path).catch(function () {
    $state.go('^');
    alert.show('Error', 'Gateway \'' + $stateParams.name + '\' cannot be found.', 'OK', null, function () {
    });
  });

  $scope.$on(path, function (e, response) {
    if (response.status < 200 || response.status > 299) {
      return;
    }
    updateAddedRoutes(response.data);
    $ctrl.gateway = response.data;
    $timeout(updateCharts, 0);
    $timeout(peekEvents, 0);
    startPolling();
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
    onEvent(response.data);
  });

  $scope.$on('/events', function (e, response) {
    $timeout(function () {
      _.forEach(response.data, onEvent);
    }, 0);
  });

  function isNewUpdate(event) {
    var timestamp = new Date(event.timestamp).getTime();
    if (!lastUpdate || lastUpdate < timestamp) {
      lastUpdate = timestamp;
      return true;
    }
    return false;
  }

  function onEvent(event) {
    if ($ctrl.gateway && _.includes(event.tags, 'gateways:' + $ctrl.gateway.name)) {
      if (_.includes(event.tags, 'archive:delete')) {
        $state.go('^');
      } else if (_.includes(event.tags, 'archive:update') || _.includes(event.tags, 'deployed')) {
        if (isNewUpdate(event)) {
          $vamp.emit(path);
        }
      } else {
        chartUpdate(event);
      }
    } else if (_.includes(event.tags, 'synchronization') && isNewUpdate(event)) {
      $vamp.emit(path);
    }
  }

  function save(gateway, message) {
    $vamp.put(path, JSON.stringify(gateway))
      .then(function () {
        toastr.success(message);
        $vamp.emit(path);
      })
      .catch(function (response) {
        toastr.error(response.data.message, 'Update of gateway \'' + $ctrl.gateway.name + '\' failed.');
      });
  }

  function updateAddedRoutes(gateway) {
    if ($ctrl.gateway) {
      addedRoutes = _.difference(_.map(gateway.routes, 'lookup_name'), _.map($ctrl.gateway.routes, 'lookup_name'));
      $timeout(function () {
        addedRoutes = [];
      }, 2000);
    }
  }

  function peekEvents() {
    var nameTag = 'gateways:' + $ctrl.gateway.name;
    var requests = _.concat(
      [
        {tag: [nameTag, 'synchronization'], timestamp: {gte: 'now-' + Ui.config.chartResolution + 'm'}},
        {tag: [nameTag, 'gateway', 'health'], timestamp: {gte: 'now-' + Ui.config.chartResolution + 'm'}},
        {tag: [nameTag, 'gateway', 'metrics:rate'], timestamp: {gte: 'now-' + Ui.config.chartResolution + 'm'}},
        {tag: [nameTag, 'gateway', 'metrics:responseTime'], timestamp: {gte: 'now-' + Ui.config.chartResolution + 'm'}}
      ],
      _.flatMap(_.map($ctrl.gateway.routes, function (v, n) {
        return [
          {
            tag: [nameTag, 'route', 'health', 'routes:' + n],
            timestamp: {gte: 'now-' + Ui.config.chartResolution + 'm'}
          },
          {
            tag: [nameTag, 'route', 'metrics:rate', 'routes:' + n],
            timestamp: {gte: 'now-' + Ui.config.chartResolution + 'm'}
          },
          {
            tag: [nameTag, 'route', 'metrics:responseTime', 'routes:' + n],
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
        {canvasId: 'rate', type: TimeSeriesCharts.chart},
        {canvasId: 'responseTime', type: TimeSeriesCharts.chart},
        {canvasId: 'health', type: TimeSeriesCharts.healthChart}
      ],
      _.flatMap(_.map($ctrl.gateway.routes, function (route) {
        return [
          {canvasId: 'rate-' + route.lookup_name, type: TimeSeriesCharts.sparkline},
          {canvasId: 'responseTime-' + route.lookup_name, type: TimeSeriesCharts.sparkline},
          {canvasId: 'health-' + route.lookup_name, type: TimeSeriesCharts.healthSparkline}
        ];
      }))
    );

    charts.invalidate();
    charts.define(definitions);

    _.forEach(definitions, function (definition) {
      appendToChart(definition.canvasId);
    });
  }

  function chartUpdate(event) {
    if (_.includes(event.tags, 'gateway')) {
      if (_.includes(event.tags, 'health')) {
        appendToChart('health', 100 * Number(event.value), event.timestamp);
      } else if (_.includes(event.tags, 'metrics:rate')) {
        appendToChart('rate', Number(event.value), event.timestamp);
      } else if (_.includes(event.tags, 'metrics:responseTime')) {
        appendToChart('responseTime', Number(event.value), event.timestamp);
      }
    } else if (_.includes(event.tags, 'route')) {
      var route = _.find($ctrl.gateway.routes, function (v, n) {
        return _.includes(event.tags, 'routes:' + n);
      });
      if (route) {
        if (_.includes(event.tags, 'health')) {
          appendToChart('health-' + route.lookup_name, 100 * Number(event.value), event.timestamp);
        } else if (_.includes(event.tags, 'metrics:rate')) {
          appendToChart('rate-' + route.lookup_name, Number(event.value), event.timestamp);
        } else if (_.includes(event.tags, 'metrics:responseTime')) {
          appendToChart('responseTime-' + route.lookup_name, Number(event.value), event.timestamp);
        }
      }
    }
  }

  function appendToChart(id, value, timestamp) {
    timestamp = timestamp ? new Date(timestamp).getTime() : Date.now();
    charts.append(id, timestamp, value, $ctrl.last);
  }

  $ctrl.proxy = function ($event) {
    if (!$ctrl.gateway || !$ctrl.gateway.deployed || !$ctrl.gateway.service || !$ctrl.gateway.service.port.endsWith('/http')) {
      return null;
    }
    try {
      // check if host:port are valid
      new URL('http://' + $ctrl.gateway.service.host + ':' + $ctrl.gateway.service.port);
    } catch (e) {
      return null;
    }
    var path = 'proxy/gateways/' + encodeURIComponent($ctrl.gateway.name) + '/';
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
