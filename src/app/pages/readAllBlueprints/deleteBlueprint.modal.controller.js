'use strict';

angular.module('inspinia')
  .controller('DeleteBlueprintModalController', function ($uibModalInstance, $timeout
, Api, id) {
    var vm = this;
    vm.id = id;
    vm.deleteIt = deleteIt;
    vm.cancel = cancel;

    vm.busyDeletingBlueprint = false;

    function deleteIt(id) {
      vm.busyDeletingBlueprint = true;
      Api.delete('blueprints', {id: id}).then(blueprintDeleted);
    }

    function blueprintDeleted() {

      //The timeout is there to make sure Elasticsearch on the backend has flushed the list;
      $timeout(function(){
      vm.busyDeletingBlueprint = false;
      $uibModalInstance.close();
      }, 2000);
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  });
