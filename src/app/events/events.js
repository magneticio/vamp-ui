angular.module('app').component('events', {
  bindings: {
    obj: '<',
    prim: '<'
  },
  templateUrl: 'app/events/events.html',
  controller: EventController
});

function EventController($scope, vamp) {
  $scope.events = [];
  $scope.show = false;

  $scope.toggle = function () {
    $scope.show = !$scope.show;
  };

  function start() {
    $scope.events.length = 0;
    vamp.peek('/events');
    vamp.peek('/events/stream');
  }

  if (vamp.connected()) {
    start();
  }

  $scope.$on('vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      start();
    }
  });

  function onEvent(event) {
    var maxLength = 50;

    var combined = _.filter(event.tags, function (tag) {
      return tag.indexOf(':') !== -1;
    });

    var single = _.filter(event.tags, function (tag) {
      return tag !== event.type && !_.find(combined, function (c) {
        return c.indexOf(tag + ':') !== -1 || c === tag;
      });
    });

    $scope.events.push({
      type: event.type,
      value: event.value,
      timestamp: event.timestamp,
      tags: _.concat(combined, single)
    });

    while ($scope.events.length > maxLength) {
      $scope.events.shift();
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
