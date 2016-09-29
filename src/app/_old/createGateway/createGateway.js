function createGatewayController(Api, $state, toastr, $mixpanel) {
  var self = this;

  self.canBeParsed = true;
  self.data = {};
  self.create = create;

  $mixpanel.track('Create gateway button clicked');

  function create(gatewayData) {
    Api.create('gateways', gatewayData).then(gatewayCreated, gatewayNotCreated);
  }

  function gatewayCreated(response) {
    var data = response.data;
    toastr.success(data.name, 'Created Gateway');
    $mixpanel.track('Gateway created');
    $state.go('readAllGateways');
  }

  function gatewayNotCreated(error) {
    toastr.error(error, 'Could not create Gateway');
  }
}

angular
  .module('app')
  .component('createGateway', {
    templateUrl: 'app/createGateway/createGateway.html',
    controller: createGatewayController
  });

