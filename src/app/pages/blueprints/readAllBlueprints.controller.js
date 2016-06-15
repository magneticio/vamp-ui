(function() {
  'use strict';

  angular
    .module('revampUi')
    .controller('ReadAllBlueprints', ReadAllBlueprints);

  /** @ngInject */
  function ReadAllBlueprints($state, $stateParams, Artifacts, Poller) {
    console.info( 'Initiated ReadAllBlueprints' );

    var vm = this;

    Poller( pollResource );

    function pollResource() {
      Artifacts.readAll('blueprints').then(success, function(){})
    }

    function success(data) {
        vm.data = data;
    }

  }
})();
