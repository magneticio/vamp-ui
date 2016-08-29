function readAllBlueprintsController($state, $uibModal, DataManager, Modal, $mixpanel) {
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

    $mixpanel.track('Blueprint deploy button clicked');

    modalInstance.result.then(function (data) {
      deploymentsResource.update(data.deploymentName, data.blueprint, true);
      $mixpanel.track('Blueprint deployed');
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

    $mixpanel.track('Blueprint delete button clicked');

    modalInstance.result.then(function (id) {
      blueprintsResource.remove(id);
      $mixpanel.track('Blueprint deleted');
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

      $mixpanel.track('Merge-to deployment button clicked');

      modalInstance.result.then(function (data) {
        deploymentsResource.update(data.deployment.name, data.blueprint, true);
        $mixpanel.track('Blueprint merged to deployment');
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
          areAllClustersThere = blueprint.clusters[clusterName];
        }

        if (areAllClustersThere) {
          possibleDeployments.push(deployment);
        }
      });

      var resolves = {
        blueprint: blueprint,
        deployments: _.sortBy(possibleDeployments, 'name'),
        title: 'Remove blueprint [' + blueprint.name + '] from deployment',
        text: 'Which deployment should [' + blueprint.name + '] be removed off?',
        buttonText: 'Remove'
      };

      var modalInstance = $uibModal.open(Modal.create('sliceDeploymentModal', resolves));

      $mixpanel.track('Remove-from deployment button clicked');

      modalInstance.result.then(function (data) {
        deploymentsResource.remove(data.deployment.name, data.blueprint);
        $mixpanel.track('Blueprint removed from deployment');
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

