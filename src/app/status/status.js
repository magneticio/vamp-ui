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
          if (value > 0.99) {
            colors = {
              r: 21,
              g: 217,
              b: 178
            };
          } else if (value <= 0.99 && value > 0) {
            colors = {
              r: 243,
              g: 156,
              b: 18
            };
          } else {
            colors = {
              r: 231,
              g: 76,
              b: 60
            };
          }
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

