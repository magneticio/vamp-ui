function readAllBlueprintsController(Api, toastr, $uibModal, DataManager) {
  /* eslint camelcase: ["error", {properties: "never"}]*/

  var self = this;
  self.openDeleteModal = openDeleteModal;
  self.openDeployModal = openDeployModal;

  self.blueprints = [];

  var blueprintsResource = DataManager.resource('blueprints');
  blueprintsResource.subscribe(blueprintReloaded);
  blueprintsResource.startPolling();

  function blueprintReloaded(data) {
    self.blueprints = data;
  }
  function openDeployModal(blueprint) {
    var theBlueprint = blueprint;

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'app/deployBlueprintModal/deployBlueprintModal.html',
      controller: 'deployBlueprintModal',
      size: 'sm',
      resolve: {
        blueprint: function () {
          return theBlueprint;
        }
      }
    });

    modalInstance.result.then(function () {

    });
  }

  function openDeleteModal(blueprintId) {
    var theBlueprintId = blueprintId;

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'app/deleteResourceModal/deleteResourceModal.html',
      controller: 'deleteResourceModal',
      size: 'sm',
      resolve: {
        id: function () {
          return theBlueprintId;
        },
        title: function () {
          return 'Are you sure?';
        },
        text: function () {
          return 'You are about to delete [' + theBlueprintId + ']. Confirm the deletion.';
        },
        buttonText: function () {
          return 'DELETE';
        }
      }
    });
    modalInstance.result.then(function (id) {
      Api.delete('blueprints', id).then(blueprintDeleted, blueprintDeletedFailed);

      function blueprintDeleted() {
        toastr.success(id + ' has been deleted.', 'Blueprint deleted');
      }

      function blueprintDeletedFailed() {
        toastr.error('Blueprint ' + id + ' could not be deleted', 'Blueprint not deleted');
      }
    });
  }
}

angular
  .module('app')
  .component('readAllBlueprints', {
    templateUrl: 'app/readAllBlueprints/readAllBlueprints.html',
    controller: readAllBlueprintsController
  });

