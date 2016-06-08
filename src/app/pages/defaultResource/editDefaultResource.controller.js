(function() {
  'use strict';

  angular
    .module('revampUi')
    .controller('EditDefaultResourceController', EditDefaultResourceController);

  /** @ngInject */
  function EditDefaultResourceController($http, $stateParams) {
    var vm = this;
    vm.resource = $stateParams.resource;
    


    var baseUrl = 'http://192.168.99.100:8080/api/v1/';
    
    vm.resource = $stateParams.resource;

    vm.test = 'test';
  }
})();
