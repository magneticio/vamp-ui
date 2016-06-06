(function() {
  'use strict';

  angular
    .module('revampUi')
    .directive('readAllTable', ReadAllTable);

  /** @ngInject */
  function ReadAllTable() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/readAllTable/readAllTable.html',
      scope: {
          resource: '@',
          parameters: '='
      },
      controller: ReadAllTableController,
      controllerAs: 'vm',
      bindToController: true,
      link: function(scope, element, attrs) {
        if(attrs.resource) {
          scope.resource = attrs.resource;
        }
      
      }
    };

    return directive;

    /** @ngInject */
    function ReadAllTableController($http, $interval) {

      var vm = this;
      vm.edit = edit;




      var baseUrl = 'http://192.168.99.100:8080/api/v1/';
      getResults(vm.resource);

      function edit(dataPoint) {
        alert('dataPoint');
      }

      function getResults(resource) {
        $http.get(baseUrl + resource).then(function(response) {
          vm.data = response.data;
          console.log(vm.data);
        }, function(response){
          console.log(response);
        });
      }

      $interval(function() {
        var lol = vm.data;
        lol.push({name: 'random', gateways: {lol:{}}, clusters: {lol: {}}});

        vm.data = lol;
      }, 30000);
    
    }
  }

})();
