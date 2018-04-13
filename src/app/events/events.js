/* global Ui */
angular.module('vamp-ui').component('events', {
  templateUrl: 'app/events/events.html',
  controller: EventController
});

function EventController($rootScope, $scope, $vamp, $interval, uiStatesFactory, overlayService) {
  var $ctrl = this;

  var maxLength = 50;

  this.events = [];
  this.show = false;

  this.filters = {
    health: Ui.config.eventsHealth,
    metrics: Ui.config.eventsMetrics,
    allocation: Ui.config.eventsAllocation
  };

  this.toggle = function ($event) {
    if (!$event || !$event.ignore) {
      $ctrl.show = !$ctrl.show;
      uiStatesFactory.setFooterViewState($ctrl.show);
    }
  };

  $scope.filter = function ($event, type) {
    if (!type) {
      return;
    }
    $event.stopPropagation();

    if ($ctrl.filters[type]) {
      $($event.target).find('input[type=checkbox]').prop('checked', true);
    } else {
      var filtered = _.filter($ctrl.events, function (event) {
        return event.type !== type;
      });
      $ctrl.events.length = 0;
      _.forEach(filtered, function (event) {
        $ctrl.events.unshift(event);
      });

      $($event.target).find('input[type=checkbox]').prop('checked', false);
    }

    Ui.save({
      eventsHealth: $ctrl.filters.health,
      eventsMetrics: $ctrl.filters.metrics,
      eventsAllocation: $ctrl.filters.allocation
    }, $rootScope);
  };

  function start() {
    $ctrl.events.length = 0;
    $vamp.emit('/events');
    // websocket
    // $vamp.emit('/events/stream');
  }

  start();

  function onEvent(event) {
    if ($ctrl.filters[event.type] === false) {
      return;
    }

    var combined = _.filter(event.tags, function (tag) {
      return tag.indexOf(':') !== -1;
    });

    var single = _.filter(event.tags, function (tag) {
      var found = _.find(combined, function (c) {
        return c.indexOf(tag + ':') !== -1 || c === tag;
      });
      return tag !== event.type && !found;
    });

    $ctrl.events.push({
      type: event.type,
      value: event.value,
      timestamp: event.timestamp,
      tags: _.concat(combined, single)
    });

    while ($ctrl.events.length > maxLength) {
      $ctrl.events.shift();
    }
  }

  $scope.$on('/events', function (e, response) {
    _.forEach(response.data, function (event) {
      onEvent(event);
    });
  });

  $scope.$on('/events/stream', function (e, response) {
    onEvent(response.data);
  });

  $scope.$on('$vamp:namespace', function () {
    start();
  });

  // jvm metrics

  var polling;

  $ctrl.connected = false;

  function info() {
    $vamp.emit('/info', '', {on: 'jvm'});
  }

  function startPolling() {
    info();
    if (!polling) {
      polling = $interval(info, 15000);
    }
    $ctrl.connected = true;
  }

  function stopPolling() {
    $ctrl.connected = false;
    $interval.cancel(polling);
    polling = undefined;
  }

  startPolling();

  $scope.$on('/info', function (event, data) {
    if (data.content === 'JSON' && data.data.jvm) {
      var info = data.data;
      $ctrl.jvm = {
        systemLoad: info.jvm.operating_system.system_load_average,
        heapCurrent: info.jvm.memory.heap.used / (1024 * 1024),
        heapMax: info.jvm.memory.heap.max / (1024 * 1024)
      };
    }
  });

  $scope.$on('$destroy', function () {
    stopPolling();
  });
}
