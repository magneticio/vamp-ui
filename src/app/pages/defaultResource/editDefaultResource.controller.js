(function() {
  'use strict';

  angular
    .module('revampUi')
    .controller('EditDefaultResourceController', EditDefaultResourceController);

  /** @ngInject */
  function EditDefaultResourceController($http, $stateParams, Artifacts) {
    var vm = this;
    vm.name = $stateParams.id;
    vm.update = update;
    vm.singularResource = $stateParams.resource.slice(0, -1);

    if( $stateParams.resource && $stateParams.id ) {
      Artifacts.read( $stateParams.resource, $stateParams.id , {getAs: 'YAML'} ).then(success, function(){});
    }

    function success(data) {
      vm.sourceCode = data;
    }

    function update(data) {
      Artifacts.update( $stateParams.resource, $stateParams.id, data, {sendAs: 'YAML'}).then(editSuccess, editError);

      function editSuccess(data) {
        console.log(data);
      }

      function editError(data) {
        console.log(error);
      }
    }

  }
})();
