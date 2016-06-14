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
          data: '=',
          resource: '=',
          editButtonPressed: '&'
      },
      controller: ReadAllTableController,
      controllerAs: 'vm',
      bindToController: true,
      // REVIEW: this seems superfluous since we're double-binding the
      //         resource variable above?
      // link: function(scope, element, attrs) {
      //   if(attrs.resource) {
      //     scope.resource = attrs.resource;
      //   }
      //
      // }
    };

    return directive;

    /** @ngInject */
    function ReadAllTableController($scope, $state, $interval, Artifacts) {

      var vm = this,
          detailRoute = 'root.detail',
          updateRoute = 'root.update';

      vm.headers = {};
      vm.dataRows = {};
      vm.editPressed = editPressed;

      if ($state.get('root.' + vm.resource.toLowerCase())) {
        console.info( 'Fount routeConfig for' , vm.resource );
        detailRoute = 'root.' + vm.resource.toLowerCase() + 'Detail';
        updateRoute = 'root.' + vm.resource.toLowerCase() + 'Update';
      }

      function editPressed(id) {
        vm.editButtonPressed({id:id});
      }


      $scope.$watch('vm.data', dataChanged, true);

      function dataChanged(changedData) {
        if(changedData && !_.isEmpty(changedData)) {
          vm.headers = createHeaders(changedData);
          vm.dataRows = createDataRows(changedData);
        }
      }

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
            return anObject ? 'true' : 'false';
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
