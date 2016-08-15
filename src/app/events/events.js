function Events(EventStreamHandler, $interval) {
  var self = this;
  self.events = [];
  self.setEventsUpdated = setEventsUpdated;
  self.start = start;
  var eventsUpdated = undefined;

  var eventCache = [];

  EventStreamHandler.getStream(undefined, eventFired);

  function eventFired(data) {
    eventCache.push(data);
  }

  function cacheToScope() {
    var tempEvents = self.events.concat(eventCache);
    while (tempEvents.length > 50) {
      tempEvents.shift();
    }
    self.events = tempEvents;
    eventCache = [];
    console.log()
    eventsUpdated(self.events);
  }

  function setEventsUpdated(eventsUpdatedFunction) {
    eventsUpdated = eventsUpdatedFunction;
    cacheToScope();
  }

  function start() {
    $interval(function () {
      cacheToScope();
    }, 1000);
  }
}

angular
  .module('app')
  .service('Events', Events);

