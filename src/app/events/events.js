function Events(EventStreamHandler, $interval, Api) {
  var self = this;
  self.events = [];
  self.setEventsUpdated = setEventsUpdated;
  self.start = start;
  var eventsUpdated = undefined;
  var entriesOnScreen = 50;
  var eventCache = [];
  //
  Api.readAll('events', {page: 0, per_page: entriesOnScreen}).then(eventsRead);

  function eventsRead(response) {
    response.data.forEach(function(anEvent) {
      eventFired(anEvent);
    });
  }

  EventStreamHandler.getStream(undefined, eventFired);

  function eventFired(data) {
    eventCache.push(data);
  }

  function cacheToScope() {
    var tempEvents = self.events.concat(eventCache);
    while (tempEvents.length > entriesOnScreen) {
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

