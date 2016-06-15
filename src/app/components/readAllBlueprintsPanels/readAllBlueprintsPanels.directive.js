(function() {
  'use strict';

  angular
    .module('revampUi')
    .directive('readAllBlueprintsPanels', ReadAllBlueprintsPanels);

  /** @ngInject */
  function ReadAllBlueprintsPanels() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/readAllBlueprintsPanels/readAllBlueprintsPanels.html',
      scope: {
          data: '='
      },
      controller: ReadAllBlueprintsPanelsController,
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
    function ReadAllBlueprintsPanelsController($scope, $interval, Artifacts) {

      var vm = this;

      $scope.$watch('vm.data', dataChanged, true);

      function dataChanged(changedData) {

        if(changedData && !_.isEmpty(changedData)) {
          changedData.forEach(function(dataPoint) {
            
            dataPoint.viewData = {
              letter: dataPoint.name.charAt(0),
              name: dataPoint.name,
              clusters: dataPoint.clusters
            };



          });
        }
      }
    }
  }

})();
