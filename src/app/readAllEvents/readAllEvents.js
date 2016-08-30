function readAllEventsController(EventStreamHandler, $mixpanel) {
  /* eslint camelcase: ["error", {properties: "never"}]*/
  var self = this;
  self.events = new CappedArray(50);
  self.showPanel = false;
  self.closeMe = closeMe;
  self.toggle = toggle;

  function toggle() {
    self.showPanel = !self.showPanel;
    $mixpanel.track('Events panel toggled');
  }

  function closeMe() {
    self.showPanel = false;
  }

  EventStreamHandler.getStream(eventTriggered);

  function eventTriggered(data) {
    self.events.push(data);
  }
}

angular
  .module('app')
  .component('readAllEvents', {
    templateUrl: 'app/readAllEvents/readAllEvents.html',
    controller: readAllEventsController
  });

