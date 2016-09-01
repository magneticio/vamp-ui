/* global YAML*/
function updateGatewayController(Api, $state, toastr, $stateParams, $mixpanel) {
  var self = this;
  self.data = {};
  self.gatewayId = $stateParams.id;
  self.update = update;

  self.canBeParsed = true;

  Api.read('gateways', self.gatewayId).then(gatewayLoaded);

  $mixpanel.track('Update Gateways button clicked');
  function update(gatewayData) {
    Api.update('gateways', self.gatewayId, gatewayData).then(gatewayUpdated, gatewayNotUpdated);
  }

  function gatewayLoaded(response) {
    self.data = response.data;
    self.sourceCode = YAML.stringify(self.data, 20);
  }

  function gatewayUpdated() {
    toastr.success(self.gatewayId, 'Updated Gateway');
    $state.go('readAllGateways');
  }

  function gatewayNotUpdated(error) {
    toastr.error(error, 'Could not update Gateway');
  }
}

angular
  .module('app')
  .component('updateGateway', {
    templateUrl: 'app/updateGateway/updateGateway.html',
    controller: updateGatewayController
  });

