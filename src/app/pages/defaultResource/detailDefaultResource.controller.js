(function() {
  'use strict';

  angular
    .module('revampUi')
    .controller('DetailDefaultResourceController', DetailDefaultResourceController);

  /** @ngInject */
  function DetailDefaultResourceController($http, $stateParams, Artifacts) {
    var vm = this;
    vm.name = $stateParams.id;
    vm.resourceName = $stateParams.resource;
    vm.singularResource = vm.resourceName.slice(0, -1);

    if( $stateParams.resource && $stateParams.id ) {
      Artifacts.read($stateParams.resource, $stateParams.id, {getAs: 'YAML'}).then(success, function(){});
    }

    function success(data) {
      vm.content = data;
    }
  }
})();
