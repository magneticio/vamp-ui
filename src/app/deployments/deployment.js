/* global TimeSeriesCharts */
angular.module('app').controller('DeploymentController', DeploymentController);

/** @ngInject */
function DeploymentController($scope, $stateParams, $interval, $timeout, $location, $vamp, alert, toastr, deployment) {
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
        $vamp.remove(path);
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

  // var addedClusters = [];

  // this.added = function (cluster) {
  //   return _.includes(addedClusters, cluster.lookup_name);
  // };

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
    // if ($ctrl.deployment) {
    //   addedClusters = _.difference(_.map(response.data.clusters, 'lookup_name'), _.map($ctrl.deployment.clusters, 'lookup_name'));
    // }
    $ctrl.deployment = response.data;
    $timeout(updateCharts, 0);
    $timeout(updateScale, 0);
    peekEvents();
  });

  $scope.$on('$destroy', function () {
    charts.destroy();
  });

  $scope.$on('/events/stream', function (e, response) {
    var event = response.data;
    if ($ctrl.deployment && _.includes(event.tags, 'deployments:' + $ctrl.deployment.name)) {
      chartUpdate(event);
    } else if (_.includes(response.data.tags, 'synchronization')) {
      $vamp.peek(path);
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

  // function save(deployment) {
  //   $vamp.await(function () {
  //     $vamp.put(path, JSON.stringify(deployment));
  //   }).catch(function (response) {
  //     toastr.error(response.data.message, 'Update of deployment \'' + $ctrl.deployment.name + '\' failed.');
  //   });
  // }

  $interval(updateScale, 5000);

  function updateScale() {
    if ($ctrl.deployment) {
      var scale = deployment.scale($ctrl.deployment);
      appendToChart('cpu', scale.cpu);
      appendToChart('memory', scale.memory);
    }
  }

  function peekEvents() {
    $vamp.peek('/events', JSON.stringify({tags: ['deployments:' + $ctrl.deployment.name, 'deployment', 'health']}));
  }

  function updateCharts() {
    var definitions = [
      {canvasId: 'health', chartOptions: {millisPerPixel: 100}},
      {canvasId: 'memory', chartOptions: {millisPerPixel: 100}},
      {canvasId: 'cpu', chartOptions: {millisPerPixel: 100, labels: {precision: 1}}}
    ];
    charts.define(definitions);
    var ts = new Date().getTime();
    _.forEach(definitions, function (definition) {
      charts.timeout(definition.canvasId, ts, 0, 10000).then(function () {
        $ctrl.last[definition.canvasId] = 'none';
      });
    });
  }

  function chartUpdate(event) {
    if (_.includes(event.tags, 'deployment') && _.includes(event.tags, 'health')) {
      appendToChart('health', 100 * Number(event.value), event.timestamp);
    }
  }

  function appendToChart(id, value, timestamp) {
    var ts = timestamp ? new Date(timestamp).getTime() : new Date().getTime();
    $ctrl.last[id] = value;
    charts.append(id, ts, value);
    charts.timeout(id, ts, 0, 10000).then(function () {
      $ctrl.last[id] = 'none';
    });
  }
}
