function readAllBlueprintsController(Api, toastr, NgTableParams, $interval, $uibModal) {
  var self = this;
  self.openDeleteModal = openDeleteModal;
  self.openDeployModal = openDeployModal;
  
  self.tableParams = new NgTableParams({}, {getData: getData});


  function getData() {
    return Api.readAll('blueprints').then(function (data) {
      return data;
    });
  }


  function refresh() {
    self.tableParams.reload();
  }

  function openDeployModal(blueprint) {
    var theBlueprint = blueprint;

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'app/deployBlueprintModal/deployBlueprintModal.html',
      controller: 'deployBlueprintModal',
      size: 'sm',
      resolve: {
        blueprint: function(){return theBlueprint;},
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
        id: function(){return theBlueprintId;},
        title: function(){return 'Are you sure?';},
        text: function(){return 'You are about to delete [' + theBlueprintId + ']. Confirm the deletion.';}
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


  $interval(refresh, 5000);
}

angular
  .module('app')
  .component('readAllBlueprints', {
    templateUrl: 'app/readAllBlueprints/readAllBlueprints.html',
    controller: readAllBlueprintsController
  });

