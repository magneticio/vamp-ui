function IntervalManager($rootScope, $interval) {
  var self = this;
  self.addInterval = addInterval;

  self.intervals = [];

  function addInterval(intervalId) {
    self.intervals.push(intervalId);
  }

  $rootScope.$on('$stateChangeStart',
    function () {
      self.intervals.forEach(function (intervalId) {
        $interval.cancel(intervalId);
      });
    }
  );
}

angular
  .module('app')
  .service('IntervalManager', IntervalManager);

