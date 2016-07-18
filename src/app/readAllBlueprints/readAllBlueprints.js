function readAllBlueprintsController(Api, NgTableParams, $interval, $uibModal) {
  var self = this;
  self.openDeleteModal = openDeleteModal;

  function getData(params) {
    return Api.readAll('blueprints').then(function (data) {
      return data;
    });
  }

  self.tableParams = new NgTableParams({}, {getData: getData});

  function refresh() {
    self.tableParams.reload();
  }

  function openDeleteModal(blueprintId) {
    var theBlueprintId = blueprintId;

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'app/deleteBlueprint/deleteBlueprint.html',
      controller: 'deleteBlueprint',
      size: 'sm',
      resolve: {
        blueprintId: function(){return theBlueprintId}
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

