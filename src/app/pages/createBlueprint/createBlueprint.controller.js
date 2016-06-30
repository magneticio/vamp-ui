'use strict';

angular.module('inspinia')
  .controller('CreateBlueprintController', function (Api, $state, $timeout) {
    var vm = this;
    vm.list = [];
    vm.sourceCode = '#Place your blueprint here';
    vm.createBlueprint = createBlueprint;
    vm.busyCreatingBlueprint = false;
    vm.errorMessage = undefined;
    vm.successMessage = undefined;

    vm.editorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      mode: 'yaml'
    };

    // Api.readOne('blueprint').then(success, error);

    function createBlueprint(data) {
      vm.busyCreatingBlueprint = true;
      var parsedData = YAML.parse(data);

      Api.create('blueprints', data).then(success, error); 
    }

    function success(data) {
      //The timeout is there to make sure Elasticsearch on the backend has flushed the list;
      $timeout(function(){
        vm.errorMessage = undefined;
        vm.successMessage = 'Blueprint has been created.'
        vm.busyCreatingBlueprint = false;
        $state.go('index.blueprints');
      }, 2000);
    }

    function error(message) {
      vm.errorMessage = message;
      vm.busyCreatingBlueprint = false;
    }


  });
