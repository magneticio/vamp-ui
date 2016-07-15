function createGatewayController() {
  this.text = 'My brand new component!';
}

angular
  .module('app')
  .component('createGateway', {
    templateUrl: 'app/createGateway/createGateway.html',
    controller: createGatewayController
  });

