function status() {
  return {
    restrict: 'E',
    template: '<div class="status"></div>',
    scope: {
      value: '='
    },
    link: function (scope, element) {
      var theElement = angular.element(element.children()[0]);
      scope.$watch('value', function (newValue) {
        var generatedColor = generateColor(newValue);
        theElement.css('background-color', 'rgb(' + generatedColor.r + ',' + generatedColor.g + ',' + generatedColor.b + ')');
      });

      function generateColor(value) {
        var colors;

        if (value) {
          var n = 100 - (value * 100);
          colors = {
            r: Math.floor((235 * n) / 100) + 20,
            g: Math.floor((220 * (100 - n)) / 100),
            b: value === 100 ? 180 : 180 - n
          };
        } else {
          colors = {
            r: 150,
            g: 150,
            b: 150
          };
        }

        return colors;
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

