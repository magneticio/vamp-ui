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
            
            //Count number of clusters
            dataPoint.numberOfClusters = 0;
            if(dataPoint.clusters) {
              dataPoint.numberOfClusters = Object.keys(dataPoint.clusters).length;
            }
            
            //Count number of Services
            dataPoint.numberOfServices = 0;
            for (var cluster in dataPoint.clusters) {
              dataPoint.numberOfServices += Object.keys(dataPoint.clusters[cluster]).length;
            }


            dataPoint.numberOfGateways = 0;
            if(dataPoint.gateways) {
              dataPoint.numberOfGateways = Object.keys(dataPoint.gateways).length;
            }
          });
        }
      }
    }
  }

})();
