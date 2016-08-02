function createGatewayController(Api, $state, toastr) {
  var self = this;
  self.data = {};
  self.creatingGateway = false;
  self.create = create;

  self.canBeParsed = true;

  function create(gatewayData) {
    self.creatingGateway = true;
    Api.create('gateways', gatewayData).then(gatewayCreated, gatewayNotCreated)
  }

  function gatewayCreated(response) { var data = response.data;
    self.creatingGateway = false;
    toastr.success(data.name,'Created Gateway');
    $state.go('readAllGateways');
  }

  function gatewayNotCreated(error) {
    toastr.error(error, 'Could not create Gateway');
    self.creatingGateway = false;
  }

}

angular
  .module('app')
  .component('createGateway', {
    templateUrl: 'app/createGateway/createGateway.html',
    controller: createGatewayController
  });

