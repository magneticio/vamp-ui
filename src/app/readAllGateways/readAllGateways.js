function readAllGatewaysController() {
  this.text = 'My brand new component!';
}

angular
  .module('app')
  .component('readAllGateways', {
    templateUrl: 'app/readAllGateways/readAllGateways.html',
    controller: readAllGatewaysController
  });

