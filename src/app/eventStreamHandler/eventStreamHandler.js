function EventStreamHandler($http, Environment) {
  var enviroment = Environment;
}

EventStreamHandler.prototype.getStream = function (tag, eventFiredCallback) {
  var source = new EventSource(Environment.prototype.getApiBaseUrl() + 'events/stream?tag=' + tag);

  source.onopen = function() {
    console.log('Stream started');
  }

  source.addEventListener('event', eventFired);

  function eventFired(event) {
    eventFiredCallback(JSON.parse(event.data));
  }

};

angular
  .module('app')
  .service('EventStreamHandler', EventStreamHandler);

