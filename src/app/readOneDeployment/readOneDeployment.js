/* global _*/
function readOneDeploymentController(Api, $stateParams, $state, EventStreamHandler, $interval, $filter, DataManager) {
  var self = this;
  var deploymentsResource = DataManager.resource('deployments');
  self.data = deploymentsResource.readOne($stateParams.id);
  self.chart = {};
  self.currentHealth = undefined;

  self.editNumberOfInstances = editNumberOfInstances;
  self.editNumberOfCpus = editNumberOfCpus;
  self.editSizeOfMemory = editSizeOfMemory;

  self.saveNumberOfInstances = saveNumberOfInstances;
  self.saveNumberOfCpus = saveNumberOfCpus;
  self.saveSizeOfMemory = saveSizeOfMemory;

  var polling = true;

  refreshDeployment();
  var intervalId = $interval(
    function () {
      if (polling) {
        refreshDeployment();
      }
    },
    3000
  );

  deploymentsResource.registerInterval(intervalId);

  function editNumberOfInstances(number) {
    polling = false;
    self.editInstances = true;
    self.initialNumberOfInstances = angular.copy(number);
  }

  function editNumberOfCpus(number) {
    polling = false;
    self.editCpu = true;
    self.initialNumberOfCpus = angular.copy(number);
  }

  function editSizeOfMemory(number) {
    polling = false;
    self.editMemory = true;
    self.initialSizeOfMemory = angular.copy(number);
  }

  function saveNumberOfInstances(serviceScale, number) {
    self.editInstances = false;
    serviceScale.instances = number;
    deploymentsResource.update($stateParams.id, self.data);
  }

  function saveNumberOfCpus(serviceScale, number) {
    self.editCpu = false;
    serviceScale.cpu = number;
    deploymentsResource.update($stateParams.id, self.data);
  }

  function saveSizeOfMemory(serviceScale, number) {
    self.editMemory = false;
    serviceScale.memory = number;
    deploymentsResource.update($stateParams.id, self.data);
  }

  function refreshDeployment() {
    Api.read('deployments', $stateParams.id).then(deploymentLoaded, deploymentCouldNotBeLoaded);
  }

  function deploymentLoaded(deployment) {
    self.data = deployment.data;
  }

  function deploymentCouldNotBeLoaded() {
    $state.go('readAllDeployments');
  }

  EventStreamHandler.getStream('deployments:' + $stateParams.id, eventFired);

  function eventFired(data) {
    if (_.includes(data.tags, 'health')) {
      self.currentHealth = data.value * 100;
      self.parsedData = $filter('date')(data.timestamp, "mm:ss");

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

