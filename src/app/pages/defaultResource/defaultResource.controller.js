(function() {
  'use strict';

  angular
    .module('revampUi')
    .controller('DefaultResourceController', DefaultResourceController);

  /** @ngInject */
  function DefaultResourceController($state, $stateParams, Artifacts) {
    var vm = this;
    vm.data = {};
    vm.resourceName = $stateParams.resource;
    vm.editButtonPressed = editButtonPressed;

    Artifacts.readAll(vm.resourceName).then(success, function(){});

    function success(data) {
      vm.data = data;
    }

    function editButtonPressed(id) {
      $state.go('root.update', {resource: vm.resourceName, id: id});
    }

  }
})();
