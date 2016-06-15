(function() {
  'use strict';

  angular
    .module('revampUi')
    .controller('DefaultResourceController', DefaultResourceController);

  /** @ngInject */
  function DefaultResourceController($state, $stateParams, Artifacts, Poller) {
    console.info( 'Initiated DefaultResourceController' );

    var vm = this;

    vm.data = {};
    vm.resourceName = $stateParams.resource;
    vm.editButtonPressed = editButtonPressed;

    Poller( pollResource );

    function pollResource() {
      Artifacts.readAll(vm.resourceName).then(success, function(){})
    }

    function success(data) {
      vm.data = data;
    }

    function editButtonPressed(id) {
      $state.go('root.all.update', {resource: vm.resourceName, id: id});
    }

  }
})();
