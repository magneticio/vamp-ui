(function() {
  'use strict';

  angular
    .module('revampUi')
    .controller('ReadOneBlueprint', ReadOneBlueprint);

  /** @ngInject */
  function ReadOneBlueprint($state, $stateParams, Artifacts, Poller) {
    console.info( 'Initiated ReadOneBlueprint' );

    var vm = this;

    


    Poller(pollResource);

    function pollResource() {
      Artifacts.read('blueprints', $stateParams.id).then(success, function(){})
    }

    function success(data) {
        vm.data = data;
    }

  }
})();
