function readAllBlueprintsController(Api, toastr, NgTableParams, $interval, $uibModal) {
  var self = this;
  self.openDeleteModal = openDeleteModal;
  self.openDeployModal = openDeployModal;





  self.tableParams = new NgTableParams({page:1, count: 1}, {counts: [],getData: getData});

  function getData(params) {
    return Api.readAll('blueprints', {page: params.page(),per_page: 1}).then(function (response) {

    console.log(response.headers());

      params.total(2);

      return response.data;
    });
  }

  $interval(refresh, 5000);
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
        text: function(){return 'You are about to delete [' + theBlueprintId + ']. Confirm the deletion.';},
        buttonText: function() {return 'DELETE'}
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

