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
      vm.editActive = false;




      var baseUrl = 'http://192.168.99.100:8080/api/v1/';
      getResults(vm.resource || 'deployments');

      function getResults(resource) {
        $http.get(baseUrl + resource).then(function(response) {
          // is response.data[0] the desired variable here? It seems like we
          // should get the YAML for each of the results instead of the first
          // also, we should use the Artifact resource here instead of a custom
          // $http call
          vm.yaml = YAML.stringify(response.data[0], 8);
          vm.data = response.data;
          console.log(vm.data);
        }, function(response){
          console.log(response);
        });
      }

      // $interval(function() {
      //   var lol = vm.data;
      //   lol.push({name: 'random', gateways: {lol:{}}, clusters: {lol: {}}});

      //   vm.data = lol;
      // }, 30000);

    }
  }

})();
