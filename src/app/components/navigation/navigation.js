(function() {
  'use strict';

  angular
    .module('revampUi')
    .controller('NavigationController', NavigationController);

  function NavigationController ( artifactsConfig ) {
    var vm = this;

    vm.items = [];

    console.log( artifactsConfig );

    angular.forEach(artifactsConfig, function ( artifactEnabled , artifactName ) {
      if ( artifactEnabled ) {
        vm.items.push( artifactName );
      }
    });
  }

})();
