/* global Environment */
function EventStreamHandler(Api, $http) {
  var self = this;
  self.$http = $http;
  // Constants;
  var allEventsCacheSize = 50;

  // All events are stored here
  var allEvents = new CappedArray(allEventsCacheSize);

  // Events of a certain combination of tags.
  self.cacheEvents = {};

  // If there are no events stored, fill it up from the backend
  if (allEvents.isEmpty()) {
    Api.readAll('events', {page: 0, per_page: allEventsCacheSize}).then(eventsRead);
  }

  function eventsRead(response) {
    response.data.forEach(function (event) {
      eventFired(event);
    });
  }

  // Get the events stream and attach a event listener
  var url = Environment.prototype.endpoint() + 'events/stream';
  this.source = new EventSource(url);

  this.source.addEventListener('health', eventFired);
  this.source.addEventListener('event', eventFired);
  this.source.addEventListener('metrics', eventFired);

  function eventFired(event) {
    var parsedData = event;

    if (typeof event.data === 'string') {
      parsedData = JSON.parse(event.data);
    }

    // First push the data on the global array
    allEvents.push(parsedData);
    if (self.allEventCallback) {
      self.allEventCallback(parsedData);
    }
    // Check if the combo of tags has an entry
    parsedData.tags.sort();
    var tagsComboId = parsedData.tags.join('/');
    if (self.cacheEvents[tagsComboId]) {
      self.cacheEvents[tagsComboId].values.push(parsedData);
      self.cacheEvents[tagsComboId].callback(parsedData);
    }
  }
}

EventStreamHandler.prototype.getStream = function (eventFiredCallback, tags) {
  var self = this;

  if (tags && Array.isArray(tags)) {
    tags.sort();
    var tagsComboId = tags.join('/');
    if (self.cacheEvents[tagsComboId]) {
      // The combination of tags exists. This means we can get the values and trigger the callback for it
      self.cacheEvents[tagsComboId].callback = eventFiredCallback;
      self.cacheEvents[tagsComboId].values.getAll().forEach(function (value) {
        eventFiredCallback(value);
      });
    } else {
      // Let's create the cache object
      self.cacheEvents[tagsComboId] = {
        callback: eventFiredCallback,
        values: new CappedArray(30)
      };

      // Now let's fill it up with data
      var url = Environment.prototype.endpoint();
      url += 'events?';
      var tagsParams = [];
      tags.forEach(function (tag) {
        tagsParams.push('tag=' + tag);
      });

      url += tagsParams.join('&');

      self.$http.get(url).then(function (response) {
        var sortedData = _.sortBy(response.data, 'timestamp');

        sortedData.forEach(function (dataPoint) {
          self.cacheEvents[tagsComboId].values.push(dataPoint);
          eventFiredCallback(dataPoint);
        });
      });
    }
  } else {
    self.allEventCallback = eventFiredCallback;
  }
};

angular
  .module('app')
  .service('EventStreamHandler', EventStreamHandler);
