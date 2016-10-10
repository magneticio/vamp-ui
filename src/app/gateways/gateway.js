/* global TimeSeriesCharts */
angular.module('app').controller('GatewayController', GatewayController);

/** @ngInject */
function GatewayController($scope, $filter, $stateParams, $timeout, $location, vamp, alert, toastr) {
  var $ctrl = this;
  var path = '/gateways/' + $stateParams.name;

  this.gateway = null;
  this.title = $filter('decodeName')($stateParams.name);

  var charts = new TimeSeriesCharts();

  this.last = [];

  this.routeCount = function () {
    return $ctrl.gateway ? _.size($ctrl.gateway.routes) : 0;
  };

  this.edit = function () {
    var encoded = $filter('encodeName')(this.gateway.name);
    $location.path('/gateways/edit/' + encoded).search({back: '/gateways/view/' + encoded});
  };

  this.delete = function () {
    alert.show('Warning', 'Are you sure you want to delete gateway \'' + $ctrl.gateway.name + '\'?', 'Delete', 'Cancel', function () {
      vamp.await(function () {
        vamp.remove(path);
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
    console.log('edit weights');
  };

  vamp.peek(path);

  $scope.$on(path, function (e, response) {
    $ctrl.gateway = response.data;
    $timeout(updateCharts, 0);
    peekEvents();
  });

  $scope.$on('$destroy', function () {
    charts.destroy();
  });

  $scope.$on('/events/stream', function (e, response) {
    var event = response.data;
    if ($ctrl.gateway && _.includes(event.tags, 'gateways:' + $ctrl.gateway.name)) {
      if (_.includes(event.tags, 'archive:delete')) {
        alert.show('Warning', '\'' + $ctrl.gateway.name + '\' has been deleted in background.', 'Leave', 'Stay', function () {
          $location.path('/gateways');
        });
      } else if (_.includes(event.tags, 'archive:update')) {
        vamp.peek(path);
      } else {
        chartUpdate(event);
      }
    } else if (_.includes(response.data.tags, 'synchronization')) {
      vamp.peek(path);
    }
  });

  $scope.$on('/events', function (e, response) {
    _.forEach(response.data, function (event) {
      if ($ctrl.gateway && _.includes(event.tags, 'gateways:' + $ctrl.gateway.name)) {
        chartUpdate(event);
      }
    });
  });

  function peekEvents() {
    var nameTag = 'gateways:' + $ctrl.gateway.name;
    var requests = [
      {tags: [nameTag, 'health']},
      {tags: [nameTag, 'metrics:rate']},
      {tags: [nameTag, 'metrics:responseTime']}
    ];
    _.forEach(requests, function (request) {
      vamp.peek('/events', JSON.stringify(request));
    });
  }

  function updateCharts() {
    var chartConfig = {
      millisPerPixel: 100
    };
    var sparkLineConfig = {
      millisPerPixel: 300, labels: {disabled: true},
      timestampFormatter: function () {
        return '';
      }
    };
    var definitions = _.concat(
      [
        {canvasId: 'rate', chartOptions: chartConfig},
        {canvasId: 'health', chartOptions: chartConfig},
        {canvasId: 'responseTime', chartOptions: chartConfig}
      ],
      _.flatMap(_.map($ctrl.gateway.routes, function (route) {
        return [
          {canvasId: 'rate-' + route.lookup_name, chartOptions: sparkLineConfig},
          {canvasId: 'health-' + route.lookup_name, chartOptions: sparkLineConfig},
          {canvasId: 'responseTime-' + route.lookup_name, chartOptions: sparkLineConfig}
        ];
      }))
    );
    charts.define(definitions);
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
    var ts = new Date(timestamp).getTime();
    $ctrl.last[id] = value;
    charts.append(id, ts, value);
    charts.timeout(id, ts, 0, 10000).then(function () {
      $ctrl.last[id] = 'none';
    });
  }
}
