function readOneDeploymentController(Api, $stateParams, $state, EventStreamHandler, $interval) {
  var self = this;
  self.data = {};
  self.chart = {};
  self.currentHealthValue = 0;


  var deploymentId = $stateParams.id;


  function refreshDeployment() {
    Api.read('deployments', deploymentId).then(deploymentLoaded, deploymentCouldNotBeLoaded);
  }

  $interval(
    function() { refreshDeployment() },
    3000
  );

  function deploymentLoaded(deployment) {
    self.data = deployment.data;
  }

  function deploymentCouldNotBeLoaded() {
    $state.go('readAllDeployments');
  }

  EventStreamHandler.getStream('deployments:' + deploymentId, eventFired);

  function eventFired(data) {
    //$scope.$broadcast('deployments:' + deploymentId + ':newHealthValue', data);
    self.currentHealthValue = Math.random() * 100;
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

