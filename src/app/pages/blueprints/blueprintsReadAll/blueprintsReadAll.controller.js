(function () {
  'use strict';

  angular.module('BlurAdmin.pages.blueprints.readAll')
    .controller('BlueprintsReadAllController', BlueprintsReadAll);

  /** @ngInject */
  function BlueprintsReadAll(Api, $scope, $uibModal) {
    var vm = this;
    vm.list = [];
    vm.deleteBlueprint = deleteBlueprint;
    vm.deployBlueprint = deployBlueprint;

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

    function deployBlueprint(id) {
      //First of all get the bluprint with an id
      Api.read('blueprints', id).then(blueprintRead, error);

      function blueprintRead(data) {

        //Config of the blueprint modal
        var blueprintModalConfig = {
          templateUrl: 'app/pages/readAllBlueprints/deployBlueprint.modal.html',
          controller: 'DeployBlueprintModalController as deployBlueprint',
          resolve: {
            data: function() {
              return data;
            }
          }
        }

        //Open the modal
        var blueprintModalInstance = $uibModal.open(blueprintModalConfig);
      }
    }



    function error() {
      console.log('ERROR IS HERE');
    }

    function deleteBlueprint(id) {
        var modalInstance = $uibModal.open({
        templateUrl: 'app/pages/blueprints/blueprintsDelete/blueprintsDelete.modal.html',
        controller: 'BlueprintsDeleteModalController as deleteBlueprint',
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

  }
})();