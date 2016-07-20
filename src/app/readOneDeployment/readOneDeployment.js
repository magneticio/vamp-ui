function readOneDeploymentController(Api, $stateParams, $state, EventStreamHandler) {
  var self = this;
  self.data = {};

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
    console.info('[Event has been fired] ' + data);
  }
}

angular
  .module('app')
  .component('readOneDeployment', {
    templateUrl: 'app/readOneDeployment/readOneDeployment.html',
    controller: readOneDeploymentController
  });

