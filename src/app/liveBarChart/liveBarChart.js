function liveBarChartController($scope, $timeout) {
  var self = this;
  self.bars = [];
  console.log(self.base + ':newHealthValue');
  self.innerPadding = 0;
  self.overflowMargin = -self.barWidth - 8 + 'px';
  self.paddingRight = 0;
  self.animate = true;

  function Bar(label, value) {
    this.label = label;
    this.value = value;
    this.height = value * 100 + '%';
    this.width = self.barWidth + 'px';
  }

  $scope.$on(self.base + ':newHealthValue', function (event, data) {
    $timeout(function () {
      self.animate = false;
    }, 100);

    $timeout(function () {
      self.paddingRight = 0;
      self.bars.push(new Bar(data.timestamp, Math.random()));
    }, 200);

    $timeout(function () {
      self.animate = true;
    }, 2000);

    $timeout(function () {
      self.paddingRight = self.barWidth + 4 + 'px';
    }, 3000);
  });
}

angular
  .module('app')
  .component('liveBarChart', {
    templateUrl: 'app/liveBarChart/liveBarChart.html',
    controller: liveBarChartController,
    bindings: {
      base: '@',
      barWidth: '<'
    }
  });

