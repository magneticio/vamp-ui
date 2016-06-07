(function() {
  'use strict';

  angular
    .module('revampUi')
    .controller('NavigationController', NavigationController);

  function NavigationController () {
    var vm = this;

    vm.items = [
      'deployments',
      'blueprints',
      'gateways'
    ];
  }

})();
