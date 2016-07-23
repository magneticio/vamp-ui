function barChart() {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    link: function (scope, element, attrs) {
      var theElement = angular.element(element[0]);
      theElement.css('position', 'relative');
      //Constants
      var noOfBars = 12;
      var barMargin = 4;


      //END of constants
      var elementHeight = element[0].offsetHeight;
      var elementWidth = element[0].offsetWidth;

      console.log(elementHeight + ' , ' + elementWidth);

      for(var i = 0; i < noOfBars; i++) {
        var barWidth = (elementWidth / noOfBars) - (barMargin * 2);
        console.log('we are there', i);
        var bar = angular.element('<div class="bar">bar</div>');
        bar.css('position', 'absolute');
        bar.css('top', 0);
        bar.css('bottom', 0);
        bar.css('width', barWidth);
        bar.css('right', (barWidth + (barMargin*2)) * i);
        bar.css('background-color', 'red');

        theElement.append(bar);
      }


    },
    controller: function () {},
    controllerAs: 'ctrl'
  };
}

angular
  .module('app')
  .directive('barChart', barChart);

