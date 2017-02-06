angular.module('app').directive('overlayManager', [function () {
  return {
    restrict: 'E',
    controller: function ($scope, $rootScope, $element, overlayService) {
      var $manager = this;

      $scope.$watch(
        function () {
          return overlayService.isActive;
        },
        function (newVal, oldVal) {
          if (newVal !== oldVal) {
            $manager.active = newVal;
            $manager.overlay = overlayService.activeOverlay;
          }
        });

      $manager.active = overlayService.isActive;
      $manager.overlay = overlayService.activeOverlay;
    },
    controllerAs: '$manager',
    templateUrl: 'app/common/templates/overlayManager.html'
  };
}]);
