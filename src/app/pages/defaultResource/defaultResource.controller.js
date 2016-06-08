(function() {
  'use strict';

  angular
    .module('revampUi')
    .controller('DefaultResourceController', DefaultResourceController);

  /** @ngInject */
  function DefaultResourceController($http, $stateParams) {
    var vm = this;


    var baseUrl = 'http://192.168.99.100:8080/api/v1/';
    
    vm.resource = $stateParams.resource;

    vm.test = 'test';
  }
})();
