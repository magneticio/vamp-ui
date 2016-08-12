/* global Environment*/
function EventStreamHandler() {
}

EventStreamHandler.prototype.getStream = function (tag, eventFiredCallback) {
  var url = Environment.prototype.getApiBaseUrl() + 'events/stream';
  if (tag) {
    url = Environment.prototype.getApiBaseUrl() + 'events/stream?tag=' + tag;
  }

  var source = new EventSource(url);

  source.onopen = function () {
  };

  source.addEventListener('event', eventFired);

  function eventFired(event) {
    eventFiredCallback(JSON.parse(event.data));
  }
};

angular
  .module('app')
  .service('EventStreamHandler', EventStreamHandler);

