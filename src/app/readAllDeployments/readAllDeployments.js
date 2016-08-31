function readAllDeploymentsController(Api, toastr, DataManager, $mixpanel, $uibModal) {
  /* eslint camelcase: ["error", {properties: "never"}]*/
  var self = this;
  self.openDeleteModal = openDeleteModal;

  self.deployments = [];

  var deploymentsResource = DataManager.resource('deployments');

  deploymentsResource.subscribe(deploymentReloaded).readAll().startPolling();

  function deploymentReloaded(data) {
    addMetaData(data);

    self.deployments = data;
  }

  function addMetaData(data) {
    console.log(data);
    data.forEach(function (deployment) {
      deployment.totalInstances = 0;
      deployment.totalCpu = 0;
      deployment.totalMemory = 0;

      for (var clusterName in deployment.clusters) {
        var cluster = deployment.clusters[clusterName];
        cluster.services.forEach(function (service) {
          var scale = service.scale;
          console.log(parseInt(scale.memory, 10));
          deployment.totalInstances += scale.instances;
          deployment.totalCpu += scale.instances * scale.cpu;
          deployment.totalMemory += scale.instances * parseInt(scale.memory, 10);
        });
      }
    });
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
        $mixpanel.track('Deployment undeployed');
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

