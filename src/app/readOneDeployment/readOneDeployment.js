/* global _*/
function readOneDeploymentController(Api, $stateParams, $state, EventStreamHandler, $interval, $filter, DataManager) {
  var self = this;
  var deploymentsResource = DataManager.resource('deployments');
  self.data = deploymentsResource.readOne($stateParams.id);
  self.chart = {};
  self.currentHealth = undefined;

  self.editInstances = {};
  self.editCpu = {};
  self.editMemory = {};

  self.initialNumberOfCpus = {};
  self.initialSizeOfMemory = {};
  self.initialNumberOfInstances = {};

  self.editNumberOfInstances = editNumberOfInstances;
  self.editNumberOfCpus = editNumberOfCpus;
  self.editSizeOfMemory = editSizeOfMemory;

  self.saveNumberOfInstances = saveNumberOfInstances;
  self.saveNumberOfCpus = saveNumberOfCpus;
  self.saveSizeOfMemory = saveSizeOfMemory;

  self.editCancel = editCancel;

  self.memoryToNumber = memoryToNumber;

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

  function editNumberOfInstances(serviceName, number) {
    console.log('whaaat');
    polling = false;
    self.editInstances[serviceName] = true;
    self.initialNumberOfInstances[serviceName]  = angular.copy(number);
  }

  function editNumberOfCpus(serviceName, number) {
    polling = false;
    self.editCpu[serviceName] = true;
    self.initialNumberOfCpus[serviceName] = angular.copy(number);
  }

  function editSizeOfMemory(serviceName, number) {
    polling = false;
    self.editMemory[serviceName] = true;
    self.initialSizeOfMemory[serviceName] = angular.copy(number);
  }

  function saveNumberOfInstances(serviceName, serviceScale, number) {
    self.editInstances[serviceName] = false;
    serviceScale.instances = number;
    deploymentsResource.update($stateParams.id, self.data);
    deploymentsResource.stopPolling();
    polling = true;
  }

  function saveNumberOfCpus(serviceName, serviceScale, number) {
    self.editCpu[serviceName]  = false;
    serviceScale.cpu = number;
    deploymentsResource.update($stateParams.id, self.data);
    deploymentsResource.stopPolling();
    polling = true;
  }

  function saveSizeOfMemory(serviceName, serviceScale, number) {
    self.editMemory[serviceName]  = false;
    serviceScale.memory = number;
    deploymentsResource.update($stateParams.id, self.data);
    deploymentsResource.stopPolling();
    polling = true;
  }

  function editCancel() {
    polling = true;
  }

  function refreshDeployment() {
    Api.read('deployments', $stateParams.id).then(deploymentLoaded, deploymentCouldNotBeLoaded);
  }

  function deploymentLoaded(deployment) {
    console.log('Ja updated');
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

  function memoryToNumber(memoryString) {
    return memoryString ? parseInt(memoryString.substring(0, memoryString.length - 2), 10) : undefined;
  }

  // Tryout
  self.chart.labels = [];
  self.chart.data = [[]];
  var noOfBars = 20;
  for (var i = 0; i < 20; i++) {

    self.chart.labels.push('');
    self.chart.data[0].push(undefined);
  }

  self.chart.series = ['Series A'];

  self.chart.colors = ['#15D9B2'];
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

  Api.readAll('events', {tag: 'deployments:' + $stateParams.id}).then(eventsLoaded);

  function eventsLoaded(response) {
    for (var i = response.data.length - 1; i >= 0; i--) {
      eventFired(response.data[i]);
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

