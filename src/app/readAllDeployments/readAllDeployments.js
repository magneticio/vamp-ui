function readAllDeploymentsController(Api, toastr, DataManager, $mixpanel, $uibModal) {
  /* eslint camelcase: ["error", {properties: "never"}]*/
  var self = this;
  self.openDeleteModal = openDeleteModal;

  self.deployments = [];

  var deploymentsResource = DataManager.resource('deployments');

  deploymentsResource.subscribe(deploymentReloaded).readAll().startPolling();

  function deploymentReloaded(data) {
    self.deployments = data;
  }

  function openDeleteModal(deploymentId) {
    var theDeploymentId = deploymentId;

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'app/deleteResourceModal/deleteResourceModal.html',
      controller: 'deleteResourceModal',
      size: 'sm',
      resolve: {
        id: function () {
          return theDeploymentId;
        },
        title: function () {
          return 'Are you sure?';
        },
        text: function () {
          return 'You are about to updeploy [' + theDeploymentId + ']. Confirm the undeployment.';
        },
        buttonText: function () {
          return 'Undeploy';
        }
      }
    });

    $mixpanel.track('Undeploy deployment button clicked.');

    modalInstance.result.then(function (id) {
      Api.read('deployments', id, {as_blueprint: true}).then(deploymentExportedAsBlueprint, deploymentDeletedFailed);

      function deploymentExportedAsBlueprint(response) {
        var data = response.data;
        Api.delete('deployments', theDeploymentId, data).then(deploymentDeleted, deploymentDeletedFailed);
      }

      function deploymentDeleted() {
        toastr.success(id + ' has been undeployed.', 'Deployement undeployed');
        $mixpane.track('Deployment undeployed');
      }

      function deploymentDeletedFailed(error) {
        toastr.error('Deployment ' + id + ' could not be undeployed. ' + error, 'Deployment was not undeployed');
      }
    });
  }
}

angular
  .module('app')
  .component('readAllDeployments', {
    templateUrl: 'app/readAllDeployments/readAllDeployments.html',
    controller: readAllDeploymentsController
  });

