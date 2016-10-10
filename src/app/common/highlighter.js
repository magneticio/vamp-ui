angular.module('app').directive('highlighter', function ($timeout) {
  return {
    restrict: 'A',
    scope: {
      model: '=highlighter'
    },
    link: function ($scope, $element) {
      $scope.$watch('model', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          $element.removeClass('highlight');
          $timeout(function () {
            $element.addClass('highlight');
          }, 0);
          $timeout(function () {
            if ($scope.model === newValue) {
              $element.removeClass('highlight');
            }
          }, 5000);
        }
      });
    }
  };
});
