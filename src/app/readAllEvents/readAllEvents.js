function readAllEventsController(EventStreamHandler, $interval) {
  /* eslint camelcase: ["error", {properties: "never"}]*/

  var self = this;
  self.events = [];

  var eventCache = [];

  EventStreamHandler.getStream(undefined, eventFired);

  function eventFired(data) {
    eventCache.push(data);
  }

  function cacheToScope() {
    var tempEvents = self.events.concat(eventCache);
    while (tempEvents.length > 25) {
      tempEvents.shift();
    }
    self.events = tempEvents;
    eventCache = [];
  }

  $interval(function(){cacheToScope()}, 1000);
}

angular
  .module('app')
  .component('readAllEvents', {
    templateUrl: 'app/readAllEvents/readAllEvents.html',
    controller: readAllEventsController
  });

