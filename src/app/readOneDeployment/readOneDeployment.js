/* global _*/
function readOneDeploymentController(Api, $stateParams, $state, EventStreamHandler, $interval, ngProgressFactory) {
  var noOfPoints = 250;

  var self = this;
  self.data = undefined;
  self.chart = {};
  self.currentHealth = 0;
  self.healthChart = createChartData();

  var deploymentId = $stateParams.id;

  var firstLoad = true;
  if (firstLoad) {
    self.progressbar = ngProgressFactory.createInstance();
    self.progressbar.start();
  }
  self.barChartOptions = {
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: true,
        ticks: {
          beginAtZero: true,
          max: 100,
          min: 0
        }
      }],
      gridLines: {
        display: false
      }
    }
  };

  function createChartData() {
    var tempData = [];
    var tempLabels = [];

    for (var i = 0; i < noOfPoints; i++) {
      tempLabels.push('');
      tempData.push(0);
    }

    return {
      labels: tempLabels,
      series: ['serie'],
      data: [tempData]
    };
  }

  $interval(
    function () {
      if (self.healthChart.data[0].length > noOfPoints) {
        self.healthChart.labels.shift();
        self.healthChart.data[0].shift();
      }

      self.healthChart.labels.push('');
      self.healthChart.data[0].push(self.currentHealth);
    },
    40
  );

  function refreshDeployment() {
    Api.read('deployments', deploymentId).then(deploymentLoaded, deploymentCouldNotBeLoaded);
  }

  $interval(
    function () {
      refreshDeployment();
    },
    10000
  );

  function deploymentLoaded(deployment) {
    self.data = deployment.data;
    if (firstLoad) {
      self.progressbar.complete();
      firstLoad = false;
    }
  }

  function deploymentCouldNotBeLoaded() {
    $state.go('readAllDeployments');
  }

  EventStreamHandler.getStream('deployments:' + deploymentId, eventFired);

  function eventFired(data) {
    if (_.includes(data.tags, 'health')) {
      self.currentHealth = data.value * 100;
    }
  }

  $interval(function () {

  }, 3000);
}

angular
  .module('app')
  .component('readOneDeployment', {
    templateUrl: 'app/readOneDeployment/readOneDeployment.html',
    controller: readOneDeploymentController
  });

