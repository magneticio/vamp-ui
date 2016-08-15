function readAllBlueprintsController($state, $uibModal, DataManager, Modal) {
  /* eslint camelcase: ["error", {properties: "never"}]*/

  var self = this;
  self.openDeleteModal = openDeleteModal;
  self.openDeployModal = openDeployModal;
  self.openMergeDeploymentModal = openMergeDeploymentModal;
  self.openSliceDeploymentModal = openSliceDeploymentModal;
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
      deploymentsResource.update(data.deploymentName, data.blueprint, true);
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

  function openMergeDeploymentModal(blueprint) {
    deploymentsResource.subscribe(deploymentsLoaded).readAll();

    function deploymentsLoaded(data) {
      deploymentsResource.unsubscribe();
      var resolves = {
        blueprint: blueprint,
        deployments: _.sortBy(data, 'name'),
        title: 'Merge blueprint [' + blueprint.name + ']',
        text: 'Which deployment should [' + blueprint.name + '] be merged with?',
        buttonText: 'Merge'
      };

      var modalInstance = $uibModal.open(Modal.create('mergeDeploymentModal', resolves));

      modalInstance.result.then(function (data) {
        deploymentsResource.update(data.deployment.name, data.blueprint, true);
        $state.go('readAllDeployments');
      });
    }
  }

  function openSliceDeploymentModal(blueprint) {
    deploymentsResource.subscribe(deploymentsLoaded).readAll();

    function deploymentsLoaded(deployments) {
      deploymentsResource.unsubscribe();

      var possibleDeployments = [];
      deployments.forEach(function (deployment) {
        console.log(deployment);

        for (var clusterName in deployment.clusters) {
          blueprint.clusters[clusterName] ? areAllClustersThere = true : areAllClustersThere = false;
        }

        areAllClustersThere ? possibleDeployments.push(deployment) : '';
      });

      var resolves = {
        blueprint: blueprint,
        deployments: _.sortBy(possibleDeployments, 'name'),
        title: 'Remove blueprint [' + blueprint.name + '] from deployment',
        text: 'Which deployment should [' + blueprint.name + '] be removed off?',
        buttonText: 'Remove'
      };

      var modalInstance = $uibModal.open(Modal.create('sliceDeploymentModal', resolves));

      modalInstance.result.then(function (data) {
        deploymentsResource.remove(data.deployment.name, data.blueprint);
      });
    }
  }
}

angular
  .module('app')
  .component('readAllBlueprints', {
    templateUrl: 'app/readAllBlueprints/readAllBlueprints.html',
    controller: readAllBlueprintsController
  });

