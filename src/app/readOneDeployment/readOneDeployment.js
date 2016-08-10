/* global _*/
function readOneDeploymentController(Api, $stateParams, $state, EventStreamHandler, $interval, $filter, DataManager) {
  var noOfPoints = 250;

  var self = this;
  var gatewaysResource = DataManager.resource('deployments');
  self.data = gatewaysResource.readOne($stateParams.id);
  self.chart = {};
  self.currentHealth = undefined;

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

  function refreshDeployment() {
    Api.read('deployments', deploymentId).then(deploymentLoaded, deploymentCouldNotBeLoaded);
  }


  function deploymentLoaded(deployment) {
    self.data = deployment.data;
  }

  refreshDeployment();
  var intervalId = $interval(
    function () {
      refreshDeployment();
    },
    3000
  );
  gatewaysResource.registerInterval(intervalId);

  function deploymentCouldNotBeLoaded() {
    $state.go('readAllDeployments');
  }

  EventStreamHandler.getStream('deployments:' + deploymentId, eventFired);

  function eventFired(data) {
    if (_.includes(data.tags, 'health')) {
      self.currentHealth = data.value * 100;
      self.parsedData = $filter('date')(data.timestamp, "HH:mm:ss");

      addHealthStat(self.parsedData, self.currentHealth);
    }
  }

  // Tryout
  self.chart.labels = [];
  self.chart.data = [[]];
  for (var i = 0; i < 20; i++) {

    self.chart.labels.push('');
    self.chart.data[0].push(undefined);
  }

  self.chart.series = ['Series A'];

  self.chart.colors = ['#00FF00'];
  self.chart.options = {
    animation: false,
    scales: {
      yAxes: [{
        display: true,
        ticks: {
          beginAtZero: true,
          max: 100,
          min: 0
        }
      }]
    }
  }

  function addHealthStat(label, value) {
    self.chart.labels.shift();
    self.chart.labels.push(label);

    self.chart.data[0].shift();
    self.chart.data[0].push(value);
  }
}

angular
  .module('app')
  .component('readOneDeployment', {
    templateUrl: 'app/readOneDeployment/readOneDeployment.html',
    controller: readOneDeploymentController
  });

