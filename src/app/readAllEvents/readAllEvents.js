function readAllEventsController(Events) {
  /* eslint camelcase: ["error", {properties: "never"}]*/
  var self = this;
  self.events = [];
  self.showPanel = false;
  self.closeMe = closeMe;
  self.toggle = toggle;

  function toggle() {
    self.showPanel = ! self.showPanel;
  }

  function closeMe() {
    self.showPanel = false;
  }

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

