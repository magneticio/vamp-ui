'use strict';

angular.module('inspinia')
  .controller('CreateGatewayController', function (Api, $state, $timeout) {
    var vm = this;
    vm.list = [];
    vm.sourceCode = '#Place your gateway here';
    vm.createGateway = createGateway;
    vm.busyCreatingGateway = false;
    vm.errorMessage = undefined;
    vm.successMessage = undefined;

    vm.editorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      mode: 'yaml'
    };

    // Api.readOne('gateway').then(success, error);

    function createGateway(data) {
      vm.busyCreatingGateway = true;
      var parsedData = YAML.parse(data);

      Api.create('gateways', data).then(success, error); 
    }

    function success(data) {
      //The timeout is there to make sure Elasticsearch on the backend has flushed the list;
      $timeout(function(){
        vm.errorMessage = undefined;
        vm.successMessage = 'Gateway has been created.'
        vm.busyCreatingGateway = false;
        $state.go('index.gateways');
      }, 2000);
    }

    function error(message) {
      vm.errorMessage = message;
      vm.busyCreatingGateway = false;
    }


  });
