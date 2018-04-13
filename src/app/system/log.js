/* global Environment */
angular.module('vamp-ui').controller('logController', LogController)
.factory('$vampLog', ['$log', '$rootScope', '$vamp', function ($log, $rootScope, $vamp) {
  return new VampLogService($log, $rootScope, $vamp);
}]).run(['$vampLog', function ($vampLog) {
  if (Environment.prototype.connect()) {
    $vampLog.init();
  }
}]);

function LogController($scope, $element, $vampLog) {
  var $ctrl = this;

  $ctrl.logs = [];
  $ctrl.filteredLogs = [];
  $ctrl.isFollowLog = true;
  $ctrl.filter = {error: false, info: false, debug: false, trace: false};

  if ($vampLog.level() === 'TRACE') {
    $ctrl.filter = {error: true, info: true, debug: true, trace: true};
  } else if ($vampLog.level() === 'DEBUG') {
    $ctrl.filter = {error: true, info: true, debug: true, trace: false};
  } else if ($vampLog.level() === 'INFO') {
    $ctrl.filter = {error: true, info: true, debug: false, trace: false};
  } else if ($vampLog.level() === 'ERROR') {
    $ctrl.filter = {error: true, info: false, debug: false, trace: false};
  }

  $ctrl.toggleFollowOnOff = function () {
    $ctrl.scrollToBottom();
  };

  $ctrl.filterUpdate = function () {
    if ($ctrl.filter.trace) {
      $vampLog.level('TRACE');
    } else if ($ctrl.filter.debug) {
      $vampLog.level('DEBUG');
    } else if ($ctrl.filter.info) {
      $vampLog.level('INFO');
    } else if ($ctrl.filter.error) {
      $vampLog.level('ERROR');
    }
    $ctrl.filterAll();
  };

  $ctrl.scrollToBottom = function () {
    if ($ctrl.isFollowLog) {
      var scrolledContainer = $($element).find('.panel-body');
      scrolledContainer.scrollTop(scrolledContainer.prop('scrollHeight'));
    }
  };

  $scope.$on('/log', function (e, response) {
    if (response.content === 'JSON') {
      $ctrl.push(response.data);
    }
  });

  $ctrl.push = function (data) {
    var log = {
      timestamp: data.timestamp,
      level: data.level,
      logger: data.logger,
      message: data.message
    };
    $ctrl.logs.push(log);
    $ctrl.pushFiltered(log);
  };

  $ctrl.pushFiltered = function (log) {
    if (!log.level || !$ctrl.filter[log.level.toLowerCase()]) {
      return;
    }
    $ctrl.filteredLogs.push(log);
  };

  $ctrl.filterAll = function () {
    $ctrl.filteredLogs.length = 0;
    for (var i = 0; i < $ctrl.logs.length; i++) {
      $ctrl.pushFiltered($ctrl.logs[i]);
    }
  };

  for (var i = 0; i < $vampLog.logs.length; i++) {
    $ctrl.push($vampLog.logs[i]);
  }

  $ctrl.clearLog = function () {
    $ctrl.logs = [];
    $ctrl.filteredLogs = [];
    $vampLog.clear();
  };
}

/** @ngInject */
function VampLogService($log, $rootScope, $vamp) {
  var $service = this;
  var $level = 'INFO';

  $service.logs = [];
  $service.initialized = false;

  this.level = function (level) {
    if (level && level !== $level) {
      $level = level;
      $service.peek();
    }
    return $level;
  };

  this.init = function () {
    $vamp.init();
    $service.initialized = true;
    $service.peek();
  };

  this.shutdown = function () {
    $service.initialized = false;
  };

  this.clear = function () {
    $service.logs = [];
  };

  $rootScope.$on('/log', function (e, response) {
    if (response.content === 'JSON') {
      $service.push(response.data);
    }
  });

  $rootScope.$on('$vamp:connection', function (event, connection) {
    if (connection === 'opened') {
      $service.peek();
    }
  });

  this.push = function (log) {
    $service.logs.push({
      timestamp: log.timestamp,
      level: log.level,
      logger: log.logger,
      message: log.message
    });
    while ($service.logs.length > 100) {
      $service.logs.shift();
    }
  };

  this.peek = function () {
    if (!$service.initialized) {
      return;
    }
    $log.debug('log level: ' + $level);
    $vamp.emit('/log', '', {logger: 'io.vamp', level: $level});
  };
}
