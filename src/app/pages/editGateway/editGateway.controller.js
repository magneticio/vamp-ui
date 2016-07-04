'use strict';

angular.module('inspinia')
  .controller('EditGatewayController', function (Api, $state, $timeout, $stateParams) {
    var vm = this;
    vm.id = $stateParams.id;
    vm.busyEditingGateway = false;
    vm.successMessage = undefined;
    vm.errorMessage = undefined;
    vm.editGateway = editGateway;

    Api.read('gateways', $stateParams.id).then(gatewayRead, gatewayReadError);

    function gatewayRead(data) {
        vm.gatewayData = data;
        vm.sourceCode = YAML.stringify(data, 5);
    }

    function gatewayReadError(error) {
        console.log(error);
    }
    
    vm.editorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      mode: 'yaml'
    };

    function editGateway(id, sourceCode) {
      vm.busyEditingGateway = true;
      Api.update('gateways', id, YAML.parse(sourceCode)).then(success, error); 
    }

    function success(data) {
      //The timeout is there to make sure Elasticsearch on the backend has flushed the list;
      $timeout(function(){
        vm.errorMessage = undefined;
        vm.successMessage = 'Gateway has been edited and saved.'
        vm.busyEditingGateway = false;
        // $state.go('index.gateways');
      }, 2000);
    }

    function error(message) {
      vm.errorMessage = message;
      vm.busyEditingGateway = false;
    }


  });
