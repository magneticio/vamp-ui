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
    function ReadAllTableController($http, $interval, Artifacts) {

      var vm = this;
      vm.editActive = false;
      vm.headers = {};
      vm.dataRows = {};

      Artifacts.readAll(vm.resource).then(transformResult,function(test){});

      function transformResult(data) {
        vm.headers = createHeaders(data);
        vm.dataRows = createDataRows(data);
        console.log(vm.dataRows);
      };

      function createHeaders(data) {
        var headers = {};
        
        var headerNames = Object.keys(data[0]);
        
        headerNames.forEach(function(headerName) {
          headers[headerName] = {
            name: headerName,
            visible: true
          }
        });

        return headers;
      }

      function createDataRows(data) {
        var transformedDataRows = [];

        data.forEach(function(dataRow) {
          var transformedDataRow = {};
          
          for(var key in dataRow) {
            var columnContent = dataRow[key];
            transformedDataRow[key] = parseObject(typeof columnContent, columnContent);
          }
          
          transformedDataRows.push(transformedDataRow);
        });
        
        return transformedDataRows;
      }

      function parseObject(type, anObject) {
        console.log(type);
        switch (type) {
          case "number":
          case "string":
            return anObject;
            break;
          case "boolean":
            return boolean ? 'Waar' : 'Onwaar';
            break;
          case "object":
            if(_.isObject(anObject[Object.keys(anObject)[0]])) {
              return Object.keys(anObject).join(', ');
            } else {
              var keyValuePairs = [];

              for(var key in anObject) {
                var valueText = anObject[key] ? anObject[key] : '';
                keyValuePairs.push(key + ': ' + valueText);
              }

              return keyValuePairs.join(', ');
            }
            break;
          case "undefined":
            return;
            break;
        }
      }
    }
  }

})();
