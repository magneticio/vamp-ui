function readAllBreedsController($state, $uibModal, DataManager, Modal) {
  /* eslint camelcase: ["error", {properties: "never"}]*/

  var self = this;
  self.openDeleteModal = openDeleteModal;
  self.openDeployModal = openDeployModal;

  self.breeds = [];

  var breedsResource = DataManager.resource('breeds');
  var deploymentsResource = DataManager.resource('deployments');

  breedsResource.subscribe(breedReloaded).readAll().startPolling();

  function breedReloaded(data) {
    self.breeds = data;
  }

  function openDeployModal(breed) {
    var resolves = {
      breed: breed
    };

    var modalInstance = $uibModal.open(Modal.create('deployBreedModal', resolves));

    modalInstance.result.then(function (data) {
      deploymentsResource.update(data.deploymentName, data.breed);
      $state.go('readAllDeployments');
    });
  }

  function openDeleteModal(breedId) {
    var resolves = {
      id: breedId,
      title: 'Are you sure?',
      text: 'You are about to delete [' + breedId + ']. Confirm the deletion.',
      buttonText: 'DELETE'
    };

    var modalInstance = $uibModal.open(Modal.create('deleteResourceModal', resolves));

    modalInstance.result.then(function (id) {
      breedsResource.remove(id);
    });
  }
}

angular
  .module('app')
  .component('readAllBreeds', {
    templateUrl: 'app/readAllBreeds/readAllBreeds.html',
    controller: readAllBreedsController
  });

