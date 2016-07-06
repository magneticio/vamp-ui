'use strict';

angular.module('BlurAdmin')
  .controller('BlueprintsDeployModalController', function ($uibModalInstance, $timeout
, Api, data, $state, $interval) {
    var vm = this;
    vm.data = data;
    vm.name = data.name;
    vm.newName = angular.copy(data.name);
    vm.busyDeployingBlueprint = false;
    vm.deployBlueprint = deployBlueprint;
    vm.cancel = cancel;

    vm.errorMessage = undefined;



    function deployBlueprint(name, data) {
      vm.busyDeployingBlueprint = true;
      console.log(data);
      Api.update('deployments', name, data).then(blueprintDeployed, error);

      function blueprintDeployed(data) {
        $timeout(function() {
          vm.busyDeployingBlueprint = false;
          $state.go('index.deployments');
          $uibModalInstance.dismiss('cancel');
        }, 2000);
      }
    
      function error(data) {
        $timeout(function() {
          vm.errorMessage = data;
          vm.busyDeployingBlueprint = false;
        }, 1000);
    
      }

    }



    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  });
