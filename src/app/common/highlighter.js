angular.module('app').directive('highlighter', function ($timeout) {
  return {
    restrict: 'A',
    scope: {
      model: '=highlighter'
    },
    link: function (scope, element) {
      scope.$watch('model', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          element.addClass('highlight');
          $timeout(function () {
            element.removeClass('highlight');
          }, 5000);
        }
      });
    }
  };
});
