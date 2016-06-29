'use strict';

angular.module('inspinia')
  .controller('ReadAllBlueprintsController', function (Api, $uibModal, $scope) {

    var vm = this;
    vm.list = [];
    vm.deleteBlueprint = deleteBlueprint;
    vm.busyDeletingBlueprint = false;

    refreshBlueprints();
    setInterval(refreshBlueprints, 10000);


    function refreshBlueprints() {
      Api.readAll('blueprints').then(success, error);
    }

    function success(data) {
      vm.list = data;
    }

    function error(data) {
      console.log(error);
    }

    function deleteBlueprint(id) {
      vm.busyDeletingBlueprint = true;
      
      var modalInstance = $uibModal.open({
        templateUrl: 'app/pages/readAllBlueprints/deleteBlueprint.modal.html',
        controller: 'deleteBlueprintModalController as deleteBlueprint',
        resolve: {
          id: function () {
            return id;
          }
        }
      });

      //Refresh the list when the blueprint is removed.
      modalInstance.result.then(function() {
        console.log('test');
        refreshBlueprints();
      });
    }

  });
