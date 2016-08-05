function barChart($interval, $timeout) {
  return {
    restrict: 'E',
    template: '<div class="bars-container"></div>',
    scope: {
      data: '='
    },
    link: function (scope, element, attrs) {
      var theElement = angular.element(element[0]);
      theElement.css('position', 'relative');

      var barsContainerElement = document.getElementsByClassName('bars-container');
      var barsContainer = angular.element(barsContainerElement);
      theElement.append(barsContainer);

      //Constants
      var noOfBars = 40;
      var barMargin = 1;

      //END of constants
      var elementHeight = barsContainer[0].clientHeight;
      var elementWidth = barsContainer[0].clientWidth;


      console.log(elementHeight + ' , ' + elementWidth);

      var barWidth = (elementWidth / noOfBars) - (barMargin * 2);

      $interval(function () {
        moveEverythingToTheLeft();
        createNewBar(Math.random());
      }, 1000);


      function createNewBar(value) {
        moveEverythingToTheLeft();

        $timeout(function () {
          var bar = angular.element('<div class="bar"></div>');
          bar.css('position', 'absolute');
          bar.css('height', (value * 100) + '%');
          bar.css('bottom', 0);
          bar.css('width', barWidth);
          bar.css('right', 0);
          var generatedColor = generateColor(value);


          bar.css('background-color', 'rgb(' + generatedColor.r + ',' + generatedColor.g + ',' + generatedColor.b + ')');
          barsContainer.append(bar);

        }, 500);

        if (barsContainer.children().length > noOfBars) {
          removeFirstBarAdded();
        }
      }

      function moveEverythingToTheLeft() {
        angular.forEach(barsContainer.children(), function (value, key) {
          var toBeMovedElement = angular.element(value);
          toBeMovedElement.css('right', parseInt(toBeMovedElement.css('right')) + barWidth + (barMargin * 2));
        });
      }

      function removeFirstBarAdded() {
        var timeUntilRemove = 500;
        $timeout(function () {
          barsContainer.children()[0].remove();
        }, timeUntilRemove);
      }

      function generateColor(value) {
        var n = 100 - (value * 100);
        return {
          r: Math.floor((255 * n) / 100),
          g: Math.floor((255 * (100 - n)) / 100),
          b: 0
        }
      }

      console.log(theElement.children());

    },
    controller: function () {
    },
    controllerAs: 'ctrl'
  };
}

angular
  .module('app')
  .directive('barChart', barChart);

