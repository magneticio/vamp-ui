(function() {
  'use strict';

  angular
    .module('revampUi')
    .controller('EditDefaultResourceController', EditDefaultResourceController);

  /** @ngInject */
  function EditDefaultResourceController($http, $stateParams, Artifacts) {
    var vm = this;
    vm.update = update;
    vm.singularResource = $stateParams.resource.slice(0, -1);

    console.log($stateParams);

    Artifacts.read($stateParams.resource, $stateParams.id).then(success, function(){});

    function success(data) {
      vm.name = data.name;
      vm.sourceCode = buildYaml(data);
    }

    function buildYaml(data) {
      return YAML.stringify(data, 8);
    }

    function update(data) {
      var jsonData = YAML.parse(data);
      Artifacts.update($stateParams.resource, $stateParams.id, jsonData).then(editSuccess, editError);

      function editSuccess(data) {
        console.log(data);
      }

      function editError(data) {
        console.log(error);
      }
    }
  
  }
})();
