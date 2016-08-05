function status() {
  return {
    restrict: 'E',
    template: '<div class="status"></div>',
    scope: {
      value: '=',
    },
    link: function (scope, element, attrs) {
      var theElement = angular.element(element.children()[0]);

      scope.$watch('value', function (newValue) {
        var generatedColor = generateColor(newValue);
        theElement.css('background-color', 'rgb(' + generatedColor.r + ',' + generatedColor.g + ',' + generatedColor.b + ')');
      });

      function generateColor(value) {
        var n = 100 - (value * 100);
        return {
          r: Math.floor((255 * n) / 100),
          g: Math.floor((255 * (100 - n)) / 100),
          b: 0
        }
      }
    },
    controller: function () {
    },
    controllerAs: 'ctrl'
  };
}

angular
  .module('app')
  .directive('status', status);

