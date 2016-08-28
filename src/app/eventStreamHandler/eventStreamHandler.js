/* global Environment*/
function EventStreamHandler() {
  var self = this;
  self.events = {};
  self.everyEventCallback;
  var url = Environment.prototype.getApiBaseUrl() + 'events/stream';
  this.source = new EventSource(url);
  this.source.addEventListener('health', eventFired);
  this.source.addEventListener('metrics', eventFired);
  function eventFired (event) {
    var parsedData = JSON.parse(event.data);

    var tags = parsedData.tags;
    tags.forEach(function(tag) {
      self.events && self.events[tag] &&  self.events[tag](parsedData);
    });
    self.everyEventCallback && self.everyEventCallback(parsedData);
  }
}

EventStreamHandler.prototype.getStream = function (tag, eventFiredCallback) {
  if(tag) {
    this.events[tag] = eventFiredCallback;
  } else {
    this.everyEventCallback = eventFiredCallback;
  }

};

angular
  .module('app')
  .service('EventStreamHandler', EventStreamHandler);

