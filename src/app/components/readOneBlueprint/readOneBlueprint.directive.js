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
          blueprint: '='
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

      vm.aceOptions = {
        useWrapMode : true,
        showGutter: true,
        theme:'twilight',
        mode: 'yaml',
        firstLineNumber: 1
      }

      $scope.$watch('vm.blueprint', dataChanged, true);

      function dataChanged(changedData) {
        vm.yaml = changedData;
        console.log()
      }
    }
  }

})();
