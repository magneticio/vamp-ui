function highlighter($timeout) {
  return {
    restrict: 'A',
    scope: {
      model: '=highlighter'
    },
    link: function (scope, element) {
      element.addClass('can-be-highlighted');
      scope.$watch('model', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          // apply class
          element.addClass('highlight');

          // auto remove after some delay
          $timeout(function () {
            element.removeClass('highlight');
          }, 5000);
        }
      });
    }
  };
}

angular
  .module('app')
  .directive('highlighter', highlighter);

