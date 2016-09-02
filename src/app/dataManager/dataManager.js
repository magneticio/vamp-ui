/* global _, sprintf*/
function DataManager(Api, $interval, toastr, $rootScope) {
  var self = this;
  self.resource = resource;
  self.resources = {};

  function error(message) {
    toastr.error(message, "Action failed");
  }

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
    self.intervals = [];

    self.dataUpdated = function () {
    };
    self.intervalId = -1;

    self.poll = function () {
      Api.readAll(resourceName).then(resourcePolled);

      function resourcePolled(response) {
        self.entries = response.data;
        self.dataUpdated(self.entries);
      }

      return self;
    };

    self.startPolling = function () {
      self.intervalId = $interval(self.poll, self.pollingTime);
      return self;
    };

    self.stopPolling = function () {
      $interval.cancel(self.intervalId);
      return self;
    };

    self.subscribe = function (dataUpdated) {
      self.dataUpdated = dataUpdated;
      return self;
    };

    self.unsubscribe = function () {
      self.dataUpdated = function () {
      };
      return self;
    };

    self.readAll = function () {
      if (self.entries.length > 0) {
        self.dataUpdated(self.entries);
      } else {
        self.poll();
      }
      return this;
    };

    self.readOne = function (id) {
      return _.find(self.entries, {name: id});
    };

    self.registerInterval = function (intervalId) {
      self.intervals.push(intervalId);
    };

    self.create = function (data, onSuccess) {
      self.stopPolling();
      Api.create(resourceName, data).then(resourceCreated, error);

      function resourceCreated() {
        if (_.find(self.entries, {name: data.name})) {
          _.remove(self.entries, {
            name: data.name
          });
        }
        self.entries.push(data);
        toastr.success(sprintf('%s created with id: [%s]', resourceName, data.name), 'Created');
        self.dataUpdated(self.entries);
        onSuccess && onSuccess(data);
      }

      self.startPolling();
      return this;
    };

    self.update = function (id, data, updateWithResponse, onUpdate) {
      self.stopPolling();

      Api.update(resourceName, id, data, onUpdate).then(resourceUpdated, error);

      function resourceUpdated(response) {
        _.remove(self.entries, {
          name: id
        });

        if (updateWithResponse) {
          self.entries.push(response.data.name ? response.data : response.data[response.data.length - 1][0]);
        } else {
          self.entries.push(data);
        }

        toastr.success(sprintf('[%s] updated from %s', id, resourceName), 'Updated');
        self.dataUpdated(self.entries);
        onUpdate && onUpdate(data);
      }

      self.startPolling();
      return this;
    };

    self.remove = function (id, data) {
      self.stopPolling();

      Api.delete(resourceName, id, data).then(resourceDeleted, error);

      function resourceDeleted() {
        _.remove(self.entries, {
          name: id
        });
        toastr.success(sprintf('[%s] deleted from %s', id, resourceName), 'Deleted');
        self.dataUpdated(self.entries);
      }

      self.startPolling();
      return this;
    };
  }

  // If a state changes it means a other page was opened. It should stop all polling.
  $rootScope.$on('$stateChangeStart',
    function () {
      for (var resourceName in self.resources) {
        if (resourceName) {
          self.resources[resourceName].stopPolling();
          self.resources[resourceName].intervals.forEach(function (interval) {
            $interval.cancel(interval);
          });
        }
      }
    });
}

angular
  .module('app')
  .service('DataManager', DataManager);
