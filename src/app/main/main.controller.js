(function() {
  'use strict';

  angular
    .module('revampUi')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($http, $stateParams) {
    var vm = this;


    var baseUrl = 'http://192.168.99.100:8080/api/v1/';


    var resources = {
      deployments: {
        actions: ['create', 'readAll', 'read', 'update', 'delete'],
        parameters: {
          readAll: {
            name: function(object) {
              return object.name;
            },
            gateway: function(object) {
              return Object.keys(object.gateways).join(', ');
            },
            clusters: function(object) {
              return Object.keys(object.clusters).join(', ');
            }
          }
        }
      }
    }




    var resourceParameters = resources[$stateParams.resource || 'deployments'];
    console.log(resourceParameters);
    if(resourceParameters) {
      vm.params = resourceParameters.parameters.readAll;
      vm.resource = $stateParams.resource;
    } else {
      console.error('The resource ['+[$stateParams.resource]+'] has not been defined in the config file. Please add it.');
    }




    vm.test = 'test';
  }
})();
