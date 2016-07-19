function readOneDeploymentController(Api, $stateParams, $state) {
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

}

angular
  .module('app')
  .component('readOneDeployment', {
    templateUrl: 'app/readOneDeployment/readOneDeployment.html',
    controller: readOneDeploymentController
  });

