function readOneDeploymentController(Api, $stateParams, $state, EventStreamHandler, $interval, $scope) {
  var self = this;
  self.data = {};
  self.chart = {};
  self.currentHealthValue = 0;


  var deploymentId = $stateParams.id;

  Api.read('deployments', deploymentId).then(deploymentLoaded, deploymentCouldNotBeLoaded);

  function deploymentLoaded(deployment) {
    self.data = deployment;
  }

  function deploymentCouldNotBeLoaded() {
    $state.go('readAllDeployments');
  }

  EventStreamHandler.getStream('deployments:' + deploymentId, eventFired);

  function eventFired(data) {
    $scope.$broadcast('deployments:' + deploymentId + ':newHealthValue', data);
    self.currentHealthValue = data.value * 100;
  }



  $interval(function() {

  }, 3000);
}

angular
  .module('app')
  .component('readOneDeployment', {
    templateUrl: 'app/readOneDeployment/readOneDeployment.html',
    controller: readOneDeploymentController
  });

