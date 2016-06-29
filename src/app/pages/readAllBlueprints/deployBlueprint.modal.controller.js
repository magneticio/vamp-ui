'use strict';

angular.module('inspinia')
  .controller('DeployBlueprintModalController', function ($uibModalInstance, $timeout
, Api, data) {
    var vm = this;
    vm.data = data;
    vm.name = data.name;
    vm.newName = angular.copy(data.name);
    vm.busyDeployingBlueprint = false;
    vm.deployBlueprint = deployBlueprint;
    vm.cancel = cancel;


    function deployBlueprint(name, data) {
      vm.busyDeployingBlueprint = true;
      console.log(data);
      Api.update('deployments', name, data).then(blueprintDeployed, error);

      function blueprintDeployed(data) {
        $timeout(function() {
          vm.busyDeployingBlueprint = false;
        }, 2000);
      }

      function error() {
        console.log('it erroooord');
      }
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    // vm.id = id;
    // vm.deployIt = deployIt;


    // vm.busyDeployingBlueprint = false;

    // function deployIt(data) {
    //   vm.busyDeployingBlueprint = true;

    //   // Api.delete('blueprints', {id: id}).then(blueprintDeleted);
    // }

    // function blueprintDeployed() {

    //   //The timeout is there to make sure Elasticsearch on the backend has flushed the list;
    //   $timeout(function(){
    //     vm.busyDeployingBlueprint = false;
    //     $uibModalInstance.close();
    //   }, 2000);
    // }

    // function cancel() {
    //   $uibModalInstance.dismiss('cancel');
    // }

  });
