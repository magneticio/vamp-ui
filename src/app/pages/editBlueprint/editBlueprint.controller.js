'use strict';

angular.module('inspinia')
  .controller('EditBlueprintController', function (Api, $state, $timeout, $stateParams) {
    var vm = this;
    vm.id = $stateParams.id;
    vm.busyEditingBlueprint = false;
    vm.successMessage = undefined;
    vm.errorMessage = undefined;
    vm.editBlueprint = editBlueprint;

    Api.read('blueprints', $stateParams.id).then(blueprintRead, blueprintReadError);

    function blueprintRead(data) {
        vm.blueprintData = data;
        vm.sourceCode = YAML.stringify(data, 5);
    }

    function blueprintReadError(error) {
        console.log(error);
    }
    
    vm.editorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      mode: 'yaml'
    };

    function editBlueprint(id, sourceCode) {
      vm.busyEditingBlueprint = true;
      Api.update('blueprints', id, YAML.parse(sourceCode)).then(success, error); 
    }

    function success(data) {
      //The timeout is there to make sure Elasticsearch on the backend has flushed the list;
      $timeout(function(){
        vm.errorMessage = undefined;
        vm.successMessage = 'Blueprint has been edited and saved.'
        vm.busyEditingBlueprint = false;
        // $state.go('index.blueprints');
      }, 2000);
    }

    function error(message) {
      vm.errorMessage = message;
      vm.busyEditingBlueprint = false;
    }


  });
