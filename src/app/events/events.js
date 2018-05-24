/* global Ui */
angular.module('vamp-ui').component('events', {
  templateUrl: 'app/events/events.html',
  controller: EventController
});

function EventController($rootScope, $scope, $vamp, $vampWebsocket, $interval, uiStatesFactory) {
  var $ctrl = this;

  var maxLength = 50;

  this.events = [];
  this.show = false;

  this.filters = {
    health: Ui.config.eventsHealth,
    metrics: Ui.config.eventsMetrics,
    capacity: Ui.config.eventsCapacity,
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
      eventsCapacity: $ctrl.filters.capacity,
      eventsAllocation: $ctrl.filters.allocation
    }, $rootScope);
  };

  function onEvent(event, publish) {
    if ($ctrl.filters[event.type] === false) {
      return;
    }

    var exists = _.find($ctrl.events, function (e) {
      return e.id === event.id;
    });

    if (!exists) {
      var e = {
        id: event.id,
        type: event.type,
        value: event.value,
        timestamp: event.timestamp,
        tags: event.tags
      };
      $ctrl.events.push(e);
      if (publish) {
        $vamp.notify('/events/stream', {
          statusText: 'OK',
          data: e
        });
      }
      while ($ctrl.events.length > maxLength) {
        $ctrl.events.shift();
      }
    }
  }

  $scope.$on('/events', function (e, response) {
    _.forEach(response.data, function (event) {
      onEvent(event, true);
    });
  });

  $scope.$on('/events/stream', function (e, response) {
    onEvent(response.data);
  });

  $scope.$on('$vamp:namespace', function () {
    $ctrl.events.length = 0;
    startReceivingEvents();
  });

  var eventPolling;
  var eventPollingInterval;

  function getEvents() {
    $vamp.emit('/events');
  }

  function startEventPolling() {
    $interval.cancel(eventPolling);
    eventPolling = $interval(getEvents, eventPollingInterval * 1000);
    getEvents();
  }

  function stopEventPolling() {
    $interval.cancel(eventPolling);
    eventPolling = undefined;
  }

  function startReceivingEvents() {
    if (eventPollingInterval === Ui.config.eventPolling) {
      return;
    }
    eventPollingInterval = Ui.config.eventPolling;
    if (eventPollingInterval > 0) {
      startEventPolling();
    } else if (eventPollingInterval === 0) {
      stopEventPolling();
      if (!$vampWebsocket.connected()) {
        $vampWebsocket.connect();
      }
    }
  }

  $rootScope.$on('$vamp:websocket', function (event, connection) {
    if (connection === 'opened') {
      $vampWebsocket.emit('/events/stream');
    }
  });

  function stopReceivingEvents() {
    stopEventPolling();
    $vampWebsocket.disconnect();
  }

  startReceivingEvents();

  // jvm metrics

  var jvmPolling;
  var jvmPollingInterval;

  function info() {
    $vamp.emit('/info', {on: 'jvm'});
  }

  function startJvmPolling() {
    if (jvmPollingInterval === Ui.config.jvmMetricsPolling) {
      return;
    }
    $interval.cancel(jvmPolling);
    jvmPollingInterval = Ui.config.jvmMetricsPolling;
    jvmPolling = $interval(info, jvmPollingInterval * 1000);
    info();
  }

  function stopJvmPolling() {
    $interval.cancel(jvmPolling);
    jvmPolling = undefined;
  }

  $scope.$on('/info', function (event, response) {
    try {
      var info = response.data;
      $ctrl.jvm = {
        systemLoad: info.jvm.operating_system.system_load_average,
        heapCurrent: info.jvm.memory.heap.used / (1024 * 1024),
        heapMax: info.jvm.memory.heap.max / (1024 * 1024)
      };
    } catch (e) {
    }
  });

  $scope.$on('$destroy', function () {
    stopJvmPolling();
    stopReceivingEvents();
  });

  startJvmPolling();

  $scope.$on('/vamp/settings/update', function () {
    startJvmPolling();
    startReceivingEvents();
  });
}
