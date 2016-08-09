function readAllBlueprintsController($state, $uibModal, DataManager, Modal) {
  /* eslint camelcase: ["error", {properties: "never"}]*/

  var self = this;
  self.openDeleteModal = openDeleteModal;
  self.openDeployModal = openDeployModal;

  self.blueprints = [];

  var blueprintsResource = DataManager.resource('blueprints');
  var deploymentsResource = DataManager.resource('deployments');

  blueprintsResource.subscribe(blueprintReloaded).readAll().startPolling();

  function blueprintReloaded(data) {
    self.blueprints = data;
  }

  function openDeployModal(blueprint) {
    var resolves = {
      blueprint: blueprint
    };

    var modalInstance = $uibModal.open(Modal.create('deployBlueprintModal', resolves));

    modalInstance.result.then(function (data) {
      deploymentsResource.update(data.deploymentName, data.blueprint);
      $state.go('readAllDeployments');
    });
  }

  function openDeleteModal(blueprintId) {
    var resolves = {
      id: blueprintId,
      title: 'Are you sure?',
      text: 'You are about to delete [' + blueprintId + ']. Confirm the deletion.',
      buttonText: 'DELETE'
    };

    var modalInstance = $uibModal.open(Modal.create('deleteResourceModal', resolves));

    modalInstance.result.then(function (id) {
      blueprintsResource.remove(id);
    });
  }
}

angular
  .module('app')
  .component('readAllBlueprints', {
    templateUrl: 'app/readAllBlueprints/readAllBlueprints.html',
    controller: readAllBlueprintsController
  });

