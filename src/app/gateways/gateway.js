/* global Chart */
angular.module('app').controller('GatewayController', GatewayController);

/** @ngInject */
function GatewayController($scope, $filter, $stateParams, $location, vamp, alert, toastr) {
  var $ctrl = this;
  var path = '/gateways/' + $stateParams.name;

  this.gateway = null;
  this.title = $filter('decodeName')($stateParams.name);

  this.rate = null;
  var rateChart = new Chart('rate');
  this.health = null;
  var healthChart = new Chart('health');
  this.responseTime = null;
  var responseTimeChart = new Chart('response-time');

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

  peek();

  $scope.$on(path, function (e, response) {
    if (!$ctrl.gateway) {
      vamp.peek('/events', {tag: 'gateways:' + response.data.name, per_page: 1000});
    }
    $ctrl.gateway = response.data;
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
        $ctrl.health = 100 * Number(event.value);
        healthChart.series.append(new Date(event.timestamp).getTime(), $ctrl.health);
      } else if (_.includes(event.tags, 'metrics:rate')) {
        $ctrl.rate = Number(event.value);
        rateChart.series.append(new Date(event.timestamp).getTime(), $ctrl.rate);
      } else if (_.includes(event.tags, 'metrics:responseTime')) {
        $ctrl.responseTime = Number(event.value);
        responseTimeChart.series.append(new Date(event.timestamp).getTime(), $ctrl.responseTime);
      }
    }
  }
}
