function updateGatewayController() {
  this.text = 'My brand new component!';
}

angular
  .module('app')
  .component('updateGateway', {
    templateUrl: 'app/updateGateway/updateGateway.html',
    controller: updateGatewayController
  });

