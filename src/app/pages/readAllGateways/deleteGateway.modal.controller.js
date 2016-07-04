'use strict';

angular.module('inspinia')
  .controller('DeleteGatewayModalController', function ($uibModalInstance, $timeout
, Api, id) {
    var vm = this;
    vm.id = id;
    vm.deleteIt = deleteIt;
    vm.cancel = cancel;

    vm.busyDeletingGateway = false;

    function deleteIt(id) {
      vm.busyDeletingGateway = true;
      Api.delete('gateways', id).then(blueprintDeleted);
    }

    function blueprintDeleted() {

      //The timeout is there to make sure Elasticsearch on the backend has flushed the list;
      $timeout(function(){
      vm.busyDeletingGateway = false;
      $uibModalInstance.close();
      }, 2000);
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  });
