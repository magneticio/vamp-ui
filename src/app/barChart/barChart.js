function barChart($interval, $timeout) {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    link: function (scope, element, attrs) {
      var theElement = angular.element(element[0]);
      theElement.css('position', 'relative');

      barsContainer = angular.element('<div class="bars-container"></div>')
      theElement.append(barsContainer);

      //Constants
      var noOfBars = 12;
      var barMargin = 4;


      //END of constants
      var elementHeight = element[0].offsetHeight;
      var elementWidth = element[0].offsetWidth;

      console.log(elementHeight + ' , ' + elementWidth);

      var barWidth = (elementWidth / noOfBars) - (barMargin * 2);

      $interval(function() {
        moveEverythingToTheLeft();
        createNewBar(20);
      }, 1000);

      createNewBar(20);

      function createNewBar(value) {
        moveEverythingToTheLeft();

        $timeout(function() {
          var bar = angular.element('<div class="bar">bar</div>');
          bar.css('position', 'absolute');
          bar.css('top', 0);
          bar.css('bottom', 0);
          bar.css('width', barWidth);
          bar.css('right', 0);
          bar.css('background-color', 'red');
          theElement.append(bar);
        }, 500);

        if(theElement.children().length === noOfBars) {
          removeFirstBarAdded();
        }
      }

      function moveEverythingToTheLeft() {
        angular.forEach(theElement.children(), function(value, key) {
          var toBeMovedElement = angular.element(value);
          toBeMovedElement.css('right', parseInt(toBeMovedElement.css('right')) + barWidth + (barMargin * 2));
        });
      }

      function removeFirstBarAdded() {
        var timeUntilRemove = 500;
        $timeout(function() {
          theElement.children()[0].remove();
        }, timeUntilRemove);
      }



      // var framesPerSecond = 25;
      // var frameLength = 1000 / framesPerSecond;
      // var milliseconds = 3000;
      // var numberOfFrames = milliseconds / frameLength;
      // var moveDistanceTotal = barWidth;
      // var moveDistancePerFrame = moveDistanceTotal / numberOfFrames;


      //add new element on to the right



      //Move everything to the left


      //Remove the last element that was added




      console.log(theElement.children());

    },
    controller: function () {},
    controllerAs: 'ctrl'
  };
}

angular
  .module('app')
  .directive('barChart', barChart);

