function DataManager() {
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

  function DataResource() {
    var self = this;
    self.entries = [];
    self.pollingTime = 5000;
    self.intervals = [];

    self.dataUpdated = function () {
    };

    self.poll = function () {
      return self;
    };

    self.startPolling = function () {
      return self;
    };

    self.stopPolling = function () {
      return self;
    };

    self.subscribe = function () {
      return self;
    };

    self.unsubscribe = function () {
      return self;
    };

    self.readAll = function () {
      return this;
    };

    self.readOne = function (id) {
      return _.find(self.entries, {name: id});
    };

    self.registerInterval = function () {
    };

    self.create = function () {
      return this;
    };

    self.update = function () {
      return this;
    };

    self.remove = function () {
      return this;
    };
  }
}

angular
  .module('app')
  .service('DataManager', DataManager);
