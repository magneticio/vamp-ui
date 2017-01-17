angular.module('app').component('log', {
  templateUrl: 'app/system/log.html',
  controller: LogController
});

function LogController($scope, $vamp) {
  var $ctrl = this;

  $ctrl.logs = [];
  var level = 'INFO';

  $ctrl.level = function (l) {
    if (l && l !== level) {
      level = l;
      $ctrl.peek();
    }
    return level;
  };

  $scope.$on('$vamp:connection', function (event, connection) {
    if (connection === 'opened') {
      $ctrl.peek();
    }
  });

  $scope.$on('/logs', function (e, response) {
    if (response.content === 'JSON') {
      $ctrl.logs.push({
        timestamp: response.data.timestamp,
        level: response.data.level,
        logger: response.data.logger,
        message: response.data.message
      });
    }
  });

  $ctrl.peek = function () {
    $vamp.peek('/logs', '', {logger: 'io.vamp', level: $ctrl.level()});
  };

  $ctrl.peek();
}
