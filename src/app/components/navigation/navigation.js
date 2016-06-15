(function() {
  'use strict';

  angular
    .module('revampUi')
    .controller('NavigationController', NavigationController);

  function NavigationController ( artifactsConfig , $state ) {
    var vm = this;

    vm.items = [];

    console.log( artifactsConfig );

    angular.forEach(artifactsConfig, function ( artifactEnabled , artifactName ) {
      if ( artifactEnabled ) {
        var menuItem = {};

        menuItem.name   = artifactName;
        menuItem.state  = 'root.all';
        menuItem.params = { resource: artifactName };

        if ($state.get('root.' + artifactName)) {
          console.info( 'Found routeConfig for' , artifactName );
          menuItem.state  = 'root.' + artifactName;
          menuItem.params = {};
        }

        vm.items.push(menuItem);
      }
    });
  }

})();
