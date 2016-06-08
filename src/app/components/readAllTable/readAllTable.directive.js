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
          resource: '@'      
      },
      transclude: {
        'actions': '?actions',
        'datapoints': '?datapoints'
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
          
          //Gets all keys from the object
          var headers = Object.keys(response.data[0]);
          //Remove lookupname because it's not needed to show
          vm.headers = _.without(headers, 'lookup_name', 'environment_variables');

          vm.data = [];

          response.data.forEach(function(dataPoint) {
            
            var dataRow = {
              original: dataPoint,
              reduced: {}
            };

            vm.headers.forEach(function(header) {
              var dataPointColumn = dataPoint[header];

              //If the dataPointColumn is a string it should just show it's content
              if(_.isString(dataPointColumn)) {
                dataRow.reduced[header] = dataPointColumn;
                return;
              }

              //If the dataPointColumn is a object it has more than one value and it
              //should be treated differently
              if(_.isObject(dataPointColumn)) {
                
                //If the first value is an object we assume all of them are objects
                //and we have to show a list of only the keys
                if(_.isObject(dataPointColumn[Object.keys(dataPointColumn)[0]])) {
                  dataRow.reduced[header] = Object.keys(dataPointColumn).join(', ');
                  return;
                } 

                //If the first value is an string we assume that the rest are strings too.
                //Now we can build key values
                if(_.isString(dataPointColumn[Object.keys(dataPointColumn)[0]])) {
                  var keyValuePairs = []
                  for(var key in dataPointColumn) {
                    keyValuePairs.push(key + ': ' + dataPointColumn[key]);
                  }

                  dataRow.reduced[header] = keyValuePairs.join(', ');
                  return;
                }
              }

              dataRow.reduced[header] = 'Not known';
           
            });

            vm.data.push(dataRow);
          });
        }, function(response){
          console.log(response);
        });
      }
    }
  }

})();
