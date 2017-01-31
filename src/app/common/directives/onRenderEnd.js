angular.module('app')
  .directive('onRenderEnd', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function () {
            scope.$eval(attr.onRenderEnd);
          });
        }
      }
    };
  });
