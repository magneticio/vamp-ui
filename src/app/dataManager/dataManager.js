/* global _*/
function DataManager(Api, $interval) {
  var self = this;
  self.resource = resource;
  self.resources = {};

  function resource(resourceName) {
    var theResource = {};

    if (self.resources[resourceName]) {
      theResource = self.resources[resourceName];
    } else {
      theResource = self.resources[resourceName] = new DataResource(resourceName);
    }

    return theResource;
  }

  function DataResource(resourceName) {
    var self = this;
    self.entries = [];
    self.pollingTime = 5000;
    self.dataUpdated = function () {};
    self.intervalId = -1;

    self.poll = function () {
      Api.readAll(resourceName).then(resourcePolled);

      function resourcePolled(response) {
        self.entries = response.data;
        self.dataUpdated(self.entries);
      }
    };

    self.startPolling = function () {
      self.intervalId = $interval(self.poll, self.pollingTime);
    };

    self.stopPolling = function () {
      $interval.cancel(self.intervalId);
    };

    self.subscribe = function (dataUpdated) {
      self.dataUpdated = dataUpdated;
    };

    self.create = function (data) {
      self.entries.push(data);
      self.dataUpdated(self.entries);
    };

    self.update = function (id, data) {

    };

    self.remove = function (id, data) {
      _.remove(self.entries, {
        name: id
      });
    };
  }
}

angular
  .module('app')
  .service('DataManager', DataManager);
