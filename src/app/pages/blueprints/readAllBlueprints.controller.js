(function() {
  'use strict';

  angular
    .module('revampUi')
    .controller('ReadAllBlueprints', ReadAllBlueprints);

  /** @ngInject */
  function ReadAllBlueprints($state, $stateParams, Artifacts) {
    console.info( 'Initiated ReadAllBlueprints' );

    var vm = this;

    Artifacts.readAll('blueprints').then(success, function(){});

    function success(data) {
        vm.data = data;
    }

  }
})();
