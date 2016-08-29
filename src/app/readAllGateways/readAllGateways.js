function readAllGatewaysController(Modal, DataManager, $uibModal, $mixpanel) {
  /* eslint camelcase: ["error", {properties: "never"}]*/
  var self = this;
  self.openDeleteModal = openDeleteModal;

  self.gateways = [];

  var gatewaysResource = DataManager.resource('gateways');

  gatewaysResource.subscribe(gatewayReloaded).readAll().startPolling();

  function gatewayReloaded(data) {
    self.gateways = data;
  }

  function openDeleteModal(gatewayId) {
    var resolves = {
      id: gatewayId,
      title: 'Are you sure?',
      text: 'You are about to delete [' + gatewayId + ']. Confirm the deletion.',
      buttonText: 'DELETE'
    };

    var modalInstance = $uibModal.open(Modal.create('deleteResourceModal', resolves));
    $mixpanel.track('Delete gateway button clicked');

    modalInstance.result.then(function (id) {
      gatewaysResource.remove(id);
      $mixpanel.track('Gateway removed');
    });
  }
}

angular
  .module('app')
  .component('readAllGateways', {
    templateUrl: 'app/readAllGateways/readAllGateways.html',
    controller: readAllGatewaysController
  });

