/* global Environment*/
function EventStreamHandler() {
  this.streams = [];
}

EventStreamHandler.prototype.getStream = function (tag, eventFiredCallback) {
  var url = Environment.prototype.getApiBaseUrl() + 'events/stream';
  if (tag) {
    url = Environment.prototype.getApiBaseUrl() + 'events/stream?tag=' + tag;
  }

  var source = new EventSource(url);

  // Close all the streams
  if (tag) {
    this.streams.forEach(function(stream) {
      stream.close();
    });
    this.streams.push(source);
  }

  source.addEventListener('event', eventFired);

  function eventFired(event) {
    eventFiredCallback(JSON.parse(event.data));
  }
};

angular
  .module('app')
  .service('EventStreamHandler', EventStreamHandler);

