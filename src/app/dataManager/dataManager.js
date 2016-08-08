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

  function DataResource(resourceName) {
    var self = this;
    self.entries = [];
    self.pollingTime = 5000;
    self.dataUpdated = function(){};

    self.subscribe = function (dataUpdated) {
      self.dataUpdated = dataUpdated;
    };

    self.create = function(data) {
      self.entries.push(data);
      self.dataUpdated(self.entries);
    };
  }
}

angular
  .module('app')
  .service('DataManager', DataManager);
