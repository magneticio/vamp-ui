function readAllDeploymentsController(Api, toastr, NgTableParams, $interval, $uibModal) {
  var self = this;
  self.openDeleteModal = openDeleteModal;

  self.tableParams = new NgTableParams({}, {getData: getData});


  function getData() {
    return Api.readAll('deployments').then(function (data) {
      return data;
    });
  }


  function refresh() {
    self.tableParams.reload();
  }

  function openDeleteModal(deploymentId) {
    var theDeploymentId = deploymentId;

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'app/deleteResourceModal/deleteResourceModal.html',
      controller: 'deleteResourceModal',
      size: 'sm',
      resolve: {
        id: function(){return theDeploymentId;},
        title: function(){return 'Are you sure?';},
        text: function(){return 'You are about to updeploy [' + theDeploymentId + ']. Confirm the undeployment.';},
        buttonText: function(){return 'Undeploy'}
      }
    });


    modalInstance.result.then(function (id) {
      Api.read('deployments', id, {'as_blueprint': true}).then(deploymentExportedAsBlueprint, deploymentDeletedFailed);



      function deploymentExportedAsBlueprint(data) {
        Api.delete('deployments', theDeploymentId, data).then(deploymentDeleted, deploymentDeletedFailed);
      }

      function deploymentDeleted() {
        toastr.success(id + ' has been undeployed.', 'Deployement undeployed');
      }

      function deploymentDeletedFailed(error) {
        toastr.error('Deployment ' + id + ' could not be undeployed. ' + error , 'Deployment was not undeployed');
      }
    });
  }


  $interval(refresh, 5000);
}

angular
  .module('app')
  .component('readAllDeployments', {
    templateUrl: 'app/readAllDeployments/readAllDeployments.html',
    controller: readAllDeploymentsController
  });

