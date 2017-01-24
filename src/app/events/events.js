angular.module('app').component('events', {
  templateUrl: 'app/events/events.html',
  controller: EventController
});

function EventController($scope, $vamp, uiStatesFactory) {
  var $ctrl = this;

  var maxLength = 50;

  this.events = [];
  this.show = false;

  this.filters = {};

  this.toggle = function ($event) {
    if (!$event || !$event.ignore) {
      $ctrl.show = !$ctrl.show;
      uiStatesFactory.setFooterViewState($ctrl.show ? 'expanded' : 'collapsed');
    }
  };

  $scope.filter = function ($event, type) {
    if (!type) {
      return;
    }
    $event.stopPropagation();
    $ctrl.filters[type] = !$ctrl.filters[type];

    if ($ctrl.filters[type]) {
      var filtered = _.filter($ctrl.events, function (event) {
        return event.type !== type;
      });
      $ctrl.events.length = 0;
      _.forEach(filtered, function (event) {
        $ctrl.events.unshift(event);
      });
    }
  };

  function start() {
    $ctrl.events.length = 0;
    $vamp.peek('/events');
    $vamp.peek('/events/stream');
  }

  if ($vamp.connected()) {
    start();
  }

  $scope.$on('$vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      start();
    }
  });

  function onEvent(event) {
    if ($ctrl.filters[event.type]) {
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
}
