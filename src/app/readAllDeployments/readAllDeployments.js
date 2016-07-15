function readAllDeploymentsController() {
  this.text = 'My brand new component!';
}

angular
  .module('app')
  .component('readAllDeployments', {
    templateUrl: 'app/readAllDeployments/readAllDeployments.html',
    controller: readAllDeploymentsController
  });

