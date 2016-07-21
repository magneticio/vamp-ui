function EventStreamHandler($http) {

}

EventStreamHandler.prototype.getStream = function (tag, eventFiredCallback) {
  var source = new EventSource('http://192.168.99.100:8080/api/v1/events/stream?tag=' + tag);

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

