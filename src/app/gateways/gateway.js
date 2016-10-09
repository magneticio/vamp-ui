/* global Chart */
angular.module('app').controller('GatewayController', GatewayController);

/** @ngInject */
function GatewayController($scope, $filter, $stateParams, $timeout, $location, vamp, alert, toastr) {
  var $ctrl = this;
  var path = '/gateways/' + $stateParams.name;

  this.gateway = null;
  this.title = $filter('decodeName')($stateParams.name);

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

  function peek() {
    vamp.peek(path);
  }

  function peekEvents() {
    var requests = [{
      tags: [
        'gateways:' + $ctrl.gateway.name,
        'health'
      ]
    }, {
      tags: [
        'gateways:' + $ctrl.gateway.name,
        'metrics:rate'
      ]
    }, {
      tags: [
        'gateways:' + $ctrl.gateway.name,
        'metrics:responseTime'
      ]
    }];

    _.forEach(requests, function (request) {
      vamp.peek('/events', JSON.stringify(request));
    });
  }

  peek();

  this.charts = {};

  function updateCharts() {
    var sparkline = {
      millisPerPixel: 300, labels: {
        disabled: true
      },
      timestampFormatter: function () {
        return '';
      }
    };

    var list = _.flatMap([['rate', 'health', 'responseTime'], _.flatMap(_.map($ctrl.gateway.routes, function (route) {
      return ['rate-' + route.lookup_name, 'health-' + route.lookup_name, 'responseTime-' + route.lookup_name];
    }))]);

    var remove = _.filter(_.map($ctrl.charts, function (v, n) {
      return n;
    }), function (entry) {
      return !_.includes(list, entry);
    });

    _.forEach(remove, function (entry) {
      delete $ctrl.charts[entry];
    });

    _.forEach(list, function (name) {
      if (!$ctrl.charts[name] || !$ctrl.charts[name].chart) {
        $ctrl.charts[name] = {
          chart: new Chart(name, name.indexOf('-') === -1 ? {} : sparkline)
        };
      }
    });
  }

  $scope.$on(path, function (e, response) {
    $ctrl.gateway = response.data;
    $timeout(updateCharts, 0);
    peekEvents();
  });

  $scope.$on('/events/stream', function (e, response) {
    var event = response.data;
    if ($ctrl.gateway && _.includes(event.tags, 'gateways:' + $ctrl.gateway.name)) {
      if (_.includes(event.tags, 'archive:delete')) {
        alert.show('Warning', '\'' + $ctrl.gateway.name + '\' has been deleted in background.', 'Leave', 'Stay', function () {
          $location.path('/gateways');
        });
      } else if (_.includes(event.tags, 'archive:update')) {
        peek();
      } else {
        processForCharts(event);
      }
    } else if (_.includes(response.data.tags, 'synchronization')) {
      peek();
    }
  });

  $scope.$on('/events', function (e, response) {
    _.forEach(response.data, function (event) {
      if ($ctrl.gateway && _.includes(event.tags, 'gateways:' + $ctrl.gateway.name)) {
        processForCharts(event);
      }
    });
  });

  function processForCharts(event) {
    if (_.includes(event.tags, 'gateway')) {
      if (_.includes(event.tags, 'health')) {
        $ctrl.charts.health.last = 100 * Number(event.value);
        $ctrl.charts.health.chart.append(new Date(event.timestamp).getTime(), $ctrl.charts.health.last);
      } else if (_.includes(event.tags, 'metrics:rate')) {
        $ctrl.charts.rate.last = Number(event.value);
        $ctrl.charts.rate.chart.append(new Date(event.timestamp).getTime(), $ctrl.charts.rate.last);
      } else if (_.includes(event.tags, 'metrics:responseTime')) {
        $ctrl.charts.responseTime.last = Number(event.value);
        $ctrl.charts.responseTime.chart.append(new Date(event.timestamp).getTime(), $ctrl.charts.responseTime.last);
      }
    } else if (_.includes(event.tags, 'route')) {
      var route = _.find($ctrl.gateway.routes, function (v, n) {
        return _.includes(event.tags, 'routes:' + n);
      });
      if (route) {
        if (_.includes(event.tags, 'health')) {
          $ctrl.charts['health-' + route.lookup_name].last = 100 * Number(event.value);
          $ctrl.charts['health-' + route.lookup_name].chart.append(new Date(event.timestamp).getTime(), $ctrl.charts['health-' + route.lookup_name].last);
        } else if (_.includes(event.tags, 'metrics:rate')) {
          $ctrl.charts['rate-' + route.lookup_name].last = Number(event.value);
          $ctrl.charts['rate-' + route.lookup_name].chart.append(new Date(event.timestamp).getTime(), $ctrl.charts['rate-' + route.lookup_name].last);
        } else if (_.includes(event.tags, 'metrics:responseTime')) {
          $ctrl.charts['responseTime-' + route.lookup_name].last = Number(event.value);
          $ctrl.charts['responseTime-' + route.lookup_name].chart.append(new Date(event.timestamp).getTime(), $ctrl.charts['responseTime-' + route.lookup_name].last);
        }
      }
    }
  }
}
