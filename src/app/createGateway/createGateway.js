function createGatewayController(Api, $state, toastr, $mixpanel) {
  var self = this;

  self.data = {};
  self.creatingGateway = false;
  self.create = create;
  self.canBeParsed = true;

  $mixpanel.track('Create gateway button clicked');

  function create(gatewayData) {
    self.creatingGateway = true;
    Api.create('gateways', gatewayData).then(gatewayCreated, gatewayNotCreated);
  }

  function gatewayCreated(response) {
    var data = response.data;
    self.creatingGateway = false;
    toastr.success(data.name, 'Created Gateway');
    $mixpanel.track('Gateway created');
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

