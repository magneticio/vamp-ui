function readAllEventsController(Events) {
  /* eslint camelcase: ["error", {properties: "never"}]*/
  var self = this;
  self.events = [];

  Events.setEventsUpdated(eventsUpdated);

  function eventsUpdated(events) {
    self.events = events;
  }
}

angular
  .module('app')
  .component('readAllEvents', {
    templateUrl: 'app/readAllEvents/readAllEvents.html',
    controller: readAllEventsController
  });

