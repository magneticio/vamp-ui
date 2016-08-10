/* global _*/
function readOneDeploymentController(Api, $stateParams, $state, EventStreamHandler, $interval, DataManager) {
  var noOfPoints = 250;

  var self = this;
  var gatewaysResource = DataManager.resource('deployments');
  self.data = gatewaysResource.readOne($stateParams.id);
  self.chart = {};
  self.currentHealth = 0;
  self.healthChart = createChartData();

  self.editNumberOfInstances = editNumberOfInstances;
  self.editNumberOfCpus = editNumberOfCpus;
  self.editSizeOfMemory = editSizeOfMemory;

  self.saveNumberOfInstances = saveNumberOfInstances;
  self.saveNumberOfCpus = saveNumberOfCpus;
  self.saveSizeOfMemory = saveSizeOfMemory;

  function editNumberOfInstances(number) {
    self.editInstances = true;
    self.initialNumberOfInstances = angular.copy(number);
  }

  function editNumberOfCpus(number) {
    self.editCpu = true;
    self.initialNumberOfCpus = angular.copy(number);
  }

  function editSizeOfMemory(number) {
    self.editMemory = true;
    self.initialSizeOfMemory = angular.copy(number);
  }

  function saveNumberOfInstances(serviceScale, number) {
    self.editInstances = false;
    serviceScale.instances = number;
    gatewaysResource.update($stateParams.id, self.data);
  }

  function saveNumberOfCpus(serviceScale, number) {
    self.editCpu = false;
    serviceScale.cpu = number;
    gatewaysResource.update($stateParams.id, self.data);
  }

  function saveSizeOfMemory(serviceScale, number) {
    self.editMemory = false;
    serviceScale.memory = number;
    gatewaysResource.update($stateParams.id, self.data);
  }

  var deploymentId = $stateParams.id;

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

  refreshDeployment();
  var intervalId = $interval(
    function () {
      refreshDeployment();
    },
    3000
  );
  gatewaysResource.registerInterval(intervalId);

  function deploymentLoaded(deployment) {
    self.data = deployment.data;
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
}

angular
  .module('app')
  .component('readOneDeployment', {
    templateUrl: 'app/readOneDeployment/readOneDeployment.html',
    controller: readOneDeploymentController
  });

