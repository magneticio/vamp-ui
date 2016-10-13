/* global TimeSeriesCharts */
angular.module('app').controller('DeploymentController', DeploymentController);

/** @ngInject */
function DeploymentController($scope, $stateParams, $timeout, $location, $vamp, deployment, alert, toastr) {
  var $ctrl = this;
  var path = '/deployments/' + $stateParams.name;

  this.deployment = null;
  this.title = $stateParams.name;

  var charts = new TimeSeriesCharts();

  this.last = [];

  this.edit = function () {
    $location.path('/deployments/edit/' + this.deployment.name).search({back: '/deployments/view/' + this.deployment.name});
  };

  this.delete = function () {
    alert.show('Warning', 'Are you sure you want to delete deployment \'' + $ctrl.deployment.name + '\'?', 'Delete', 'Cancel', function () {
      $vamp.await(function () {
        $vamp.remove(path, angular.toJson($ctrl.deployment));
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
    $ctrl.deployment = response.data;
    $timeout(updateCharts, 0);
    if (created) {
      $timeout(function () {
        $scope.$on('deployments/' + response.data.name + '/scale', function (e, data) {
          appendToChart('cpu', data.scale.cpu, data.timestamp);
          appendToChart('memory', data.scale.memory, data.timestamp);
        });
        _.forEach(deployment.peekScales(response.data) || [], function (data) {
          appendToChart('cpu', data.scale.cpu, data.timestamp);
          appendToChart('memory', data.scale.memory, data.timestamp);
        });
      }, 0);
    }
    peekEvents();
  });

  $scope.$on('$destroy', function () {
    charts.destroy();
  });

  $scope.$on('/events/stream', function (e, response) {
    var event = response.data;
    if ($ctrl.deployment && _.includes(event.tags, 'deployments:' + $ctrl.deployment.name)) {
      if (_.includes(event.tags, 'synchronization')) {
        $vamp.await(function () {
          $vamp.peek(path);
        }).catch(function () {
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

  function peekEvents() {
    $vamp.peek('/events', JSON.stringify({
      tags: ['deployments:' + $ctrl.deployment.name, 'deployment', 'health'],
      timestamp: {gte: 'now-1m'}
    }));
  }

  function updateCharts() {
    var definitions = [
      {canvasId: 'health', type: TimeSeriesCharts.healthChart},
      {canvasId: 'memory', type: TimeSeriesCharts.chart},
      {canvasId: 'cpu', type: TimeSeriesCharts.chart, chartOptions: {labels: {precision: 1}}}
    ];

    charts.define(definitions);

    _.forEach(definitions, function (definition) {
      appendToChart(definition.canvasId);
    });
  }

  function chartUpdate(event) {
    if (_.includes(event.tags, 'deployment') && _.includes(event.tags, 'health')) {
      appendToChart('health', 100 * Number(event.value), event.timestamp);
    }
  }

  function appendToChart(id, value, timestamp) {
    timestamp = timestamp || Date.now();
    timestamp = Number.isInteger(timestamp) ? timestamp : new Date(timestamp).getTime();
    charts.append(id, timestamp, value, $ctrl.last);
  }
}
