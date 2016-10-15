/* global TimeSeriesCharts */
angular.module('app').controller('GatewayController', GatewayController);

/** @ngInject */
function GatewayController($scope, $filter, $stateParams, $timeout, $location, $vamp, slider, alert, toastr, $uibModal) {
  var $ctrl = this;
  var path = '/gateways/' + $stateParams.name;

  this.gateway = null;
  this.title = $filter('decodeName')($stateParams.name);

  var charts = new TimeSeriesCharts();

  this.last = [];
  var addedRoutes = [];
  this.sliderOptions = slider.weightOptions;

  this.edit = function () {
    var encoded = $filter('encodeName')(this.gateway.name);
    $location.path('/gateways/edit/' + encoded).search({back: '/gateways/view/' + encoded});
  };

  this.delete = function () {
    alert.show('Warning', 'Are you sure you want to delete gateway \'' + $ctrl.gateway.name + '\'?', 'Delete', 'Cancel', function () {
      $vamp.await(function () {
        $vamp.remove(path);
      }).then(function () {
        $location.path('/gateways');
        toastr.success('Gateway \'' + $ctrl.gateway.name + '\' has been successfully deleted.');
      }).catch(function (response) {
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

  this.saveCondition = function (route, condition) {
    var gateway = angular.copy($ctrl.gateway);
    if (!condition || condition.trim().length === 0) {
      gateway.routes[route].condition = null;
      gateway.routes[route].condition_strength = '0%';
    } else {
      gateway.routes[route].condition = condition;
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

  $vamp.await(function () {
    $vamp.peek(path);
  }).catch(function () {
    $location.path('/gateways');
    alert.show('Error', 'Gateway \'' + $stateParams.name + '\' cannot be found.', 'OK', null, function () {
    });
  });

  $scope.$on(path, function (e, response) {
    if (response.status === 'ERROR') {
      return;
    }
    updateAddedRoutes(response.data);
    $ctrl.gateway = response.data;
    $timeout(updateCharts, 0);
    peekEvents();
  });

  $scope.$on('$destroy', function () {
    charts.invalidate();
  });

  $scope.$on('/events/stream', function (e, response) {
    var event = response.data;
    if ($ctrl.gateway && _.includes(event.tags, 'gateways:' + $ctrl.gateway.name)) {
      if (_.includes(event.tags, 'archive:delete')) {
        alert.show('Warning', '\'' + $ctrl.gateway.name + '\' has been deleted in background.', 'Leave', 'Stay', function () {
          $location.path('/gateways');
        });
      } else if (_.includes(event.tags, 'archive:update')) {
        $vamp.peek(path);
      } else {
        chartUpdate(event);
      }
    } else if (_.includes(response.data.tags, 'synchronization')) {
      $vamp.peek(path);
    }
  });

  $scope.$on('/events', function (e, response) {
    $timeout(function () {
      _.forEach(response.data, function (event) {
        if ($ctrl.gateway && _.includes(event.tags, 'gateways:' + $ctrl.gateway.name)) {
          chartUpdate(event);
        }
      });
    }, 0);
  });

  function save(gateway, message) {
    $vamp.await(function () {
      $vamp.put(path, JSON.stringify(gateway));
    }).then(function () {
      toastr.success(message);
    }).catch(function (response) {
      toastr.error(response.data.message, 'Update of gateway \'' + $ctrl.gateway.name + '\' failed.');
    });
  }

  function updateAddedRoutes(gateway) {
    if ($ctrl.gateway) {
      addedRoutes = _.difference(_.map(gateway.routes, 'lookup_name'), _.map($ctrl.gateway.routes, 'lookup_name'));
      $timeout(function () {
        addedRoutes = [];
      }, 5000);
    }
  }

  function peekEvents() {
    var nameTag = 'gateways:' + $ctrl.gateway.name;
    var requests = _.concat(
      [
        {tags: [nameTag, 'gateway', 'health'], timestamp: {gte: 'now-1m'}},
        {tags: [nameTag, 'gateway', 'metrics:rate'], timestamp: {gte: 'now-1m'}},
        {tags: [nameTag, 'gateway', 'metrics:responseTime'], timestamp: {gte: 'now-1m'}}
      ],
      _.flatMap(_.map($ctrl.gateway.routes, function (v, n) {
        return [
          {tags: [nameTag, 'route', 'health', 'routes:' + n], timestamp: {gte: 'now-1m'}},
          {tags: [nameTag, 'route', 'metrics:rate', 'routes:' + n], timestamp: {gte: 'now-1m'}},
          {tags: [nameTag, 'route', 'metrics:responseTime', 'routes:' + n], timestamp: {gte: 'now-1m'}}
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
}
