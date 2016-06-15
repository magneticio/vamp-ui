(function() {
  'use strict';

  angular
    .module('revampUi')
    .directive('readOneBlueprint', ReadOneBlueprint);

  /** @ngInject */
  function ReadOneBlueprint() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/readOneBlueprint/readOneBlueprint.html',
      scope: {
          data: '='
      },
      controller: ReadOneBlueprintController,
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
    function ReadOneBlueprintController($scope, $interval, Artifacts) {

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
