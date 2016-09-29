function readOneGatewayController(Api, $interval, $stateParams, $filter, $http, toastr, EventStreamHandler, $uibModal, $mixpanel, IntervalManager) {
  var weightsModal;
  var self = this;
  self.gateway = {};

  refreshGateway();
  IntervalManager.addInterval($interval(refreshGateway, 5000));

  function refreshGateway() {
    Api.read('gateways', $stateParams.id).then(resourceLoaded);
  }

  self.currentRate = 0;
  self.rateData = [[0]];
  self.rateLabels = [''];

  self.currentResponseTime = 0;
  self.responseTimeData = [[0]];
  self.responseTimeLabels = [''];

  function getFromRest() {
    // tags, callback) {
    // var url = Environment.prototype.endpoint();
    // url += 'events?';
    // var tagsParams = [];
    // tags.forEach(function (tag) {
    //   tagsParams.push('tag=' + tag);
    // });
    //
    // url += tagsParams.join('&');
    //
    // $http.get(url).then(function (response) {
    //   var sortedData = _.sortBy(response.data, 'timestamp');
    //   callback(sortedData);
    // });
  }

  getFromRest(['gateway', 'gateways', 'gateways:' + $stateParams.id, 'metrics', 'metrics:responseTime'], function (response) {
    var tempData = [];
    var tempLabels = [];

    response.forEach(function (data) {
      tempData.push(data.value);
      tempLabels.push('');
    });

    self.responseTimeData[0] = tempData;
    self.responseTimeLabels = tempLabels;
  });

  getFromRest(['gateway', 'gateways', 'gateways:' + $stateParams.id, 'metrics', 'metrics:rate'], function (response) {
    var tempData = [];
    var tempLabels = [];

    response.forEach(function (data) {
      tempData.push(data.value);
      tempLabels.push('');
    });

    self.rateData[0] = tempData;
    self.rateLabels = tempLabels;
  });

  function resourceLoaded(response) {
    // Get the data and generate the metadata
    var gateway = response.data;
    addMetaData(gateway);
    self.gateway = gateway;

    // Add stream handlers
    EventStreamHandler.getStream(newHealthStatEvent, ['gateway', 'gateways', 'gateways:' + gateway.name, 'health']);
    EventStreamHandler.getStream(newResponseTimeEvent, ['gateway', 'gateways', 'gateways:' + gateway.name, 'metrics', 'metrics:responseTime']);
    EventStreamHandler.getStream(newRateEvent, ['gateway', 'gateways', 'gateways:' + gateway.name, 'metrics', 'metrics:rate']);
    // Define modals
    var routeWeights = {};
    for (var routeName in self.gateway.routes) {
      if (routeName) {
        routeWeights[routeName] = parseInt(self.gateway.routes[routeName].weight, 10);
      }
    }

    weightsModal = new Modal('editWeightsModal', routeWeightsAdjusted, {weightValues: routeWeights});
  }

  function removeMetaData(data) {
    for (var attribute in data) {
      if (typeof data[attribute] === 'object') {
        removeMetaData(data[attribute]);
      }

      if (attribute.substring(0, 2) === '_$') {
        delete data[attribute];
      }
    }

    return data;
  }

  function updateGateway(gatewayData) {
    var pureData = removeMetaData(angular.copy(gatewayData));

    Api.update('gateways', gatewayData.name, pureData).then(gatewayUpdated);

    function gatewayUpdated() {
      toastr.success('Weights of routes of gateway' + self.gateway.name + ' updated');
    }
  }

  function routeWeightsAdjusted(routeWeights) {
    // Adjust the weights in the scope
    for (var routeName in routeWeights) {
      var routeWeight = routeWeights[routeName];
      self.gateway.routes[routeName].weight = routeWeight + '%';
    }
    updateGateway(self.gateway);
    $mixpanel.track('Weights of routes of gateway edited');
  }

  self.conditionsChanged = function (routeName, newConditions) {
    if (newConditions === '') {
      self.gateway.routes[routeName].condition = null;
    } else {
      self.gateway.routes[routeName].condition = {condition: newConditions};
    }
    updateGateway(self.gateway);
    $mixpanel.track('Condition of route of gateway edited');
  };

  self.conditionsWeightChanged = function (routeName, newWeight) {
    self.gateway.routes[routeName].condition_strength = newWeight + '%';
    updateGateway(self.gateway);
    $mixpanel.track('Condition weigth of route of gateway edited');
  };

  function SparklineStats(size) {
    var self = this;
    self.values = new CappedArray(size);

    self.callback = function (event) {
      self.values.push(event.value);
    };
  }

  function addMetaData(gateway) {
    // get health stats
    gateway._$stats = {
      health: {
        data: new CappedArray(20, true),
        labels: new CappedArray(20, true)
      },
      responseTime: {
        data: new CappedArray(20),
        labels: new CappedArray(20)
      },
      rate: {
        data: new CappedArray(20),
        labels: new CappedArray(20)
      }
    };

    for (var routeName in gateway.routes) {
      var route = gateway.routes[routeName];
      route._$stats = {
        health: new SparklineStats(6),
        responseTime: new SparklineStats(20),
        rate: new SparklineStats(20)
      };

      EventStreamHandler.getStream(route._$stats.health.callback, ['gateways', 'gateways:' + gateway.name, 'health', 'routes', 'routes:' + routeName]);
      EventStreamHandler.getStream(route._$stats.responseTime.callback, ['gateways', 'gateways:' + gateway.name, 'metrics', 'metrics:responseTime', 'route', 'routes', 'routes:' + routeName]);
      EventStreamHandler.getStream(route._$stats.rate.callback, ['gateways', 'gateways:' + gateway.name, 'metrics', 'metrics:rate', 'routes', 'route', 'routes:' + routeName]);
    }
  }
  function newHealthStatEvent(event) {
    self.gateway._$stats.health.data.push(event.value * 100);
    self.gateway._$stats.health.labels.push($filter('date')(event.timestamp, "mm:ss"));
  }

  function newResponseTimeEvent(event) {
    self.gateway._$stats.responseTime.data.push(event.value);
    self.gateway._$stats.responseTime.labels.push(event.timestamp);
  }

  function newRateEvent(event) {
    self.gateway._$stats.rate.data.push(event.value);
    self.gateway._$stats.rate.labels.push(event.timestamp);
  }

  self.openWeightsModal = function () {
    weightsModal.open();
  };
  $interval(function () {
    getLiveData();
  }, 5000);

  function getLiveData() {
    if (self.rateData[0].length > 30) {
      self.rateLabels = self.rateLabels.slice(1);
      self.rateData[0] = self.rateData[0].slice(1);
    }

    self.rateLabels.push('');
    self.rateData[0].push(self.gateway._$stats.rate.data.getLast());
    self.currentRate = self.gateway._$stats.rate.data.getLast();

    if (self.responseTimeData[0].length > 30) {
      self.responseTimeLabels = self.responseTimeLabels.slice(1);
      self.responseTimeData[0] = self.responseTimeData[0].slice(1);
    }

    self.responseTimeLabels.push('');
    self.responseTimeData[0].push(self.gateway._$stats.responseTime.data.getLast());
    self.currentResponseTime = self.gateway._$stats.responseTime.data.getLast();
  }

  // Chartconfig
  self.healthChart = {};
  self.healthChart.series = ['Series A'];

  self.healthChart.colors = ['#00FF00'];
  self.healthChart.options = {
    animation: false,
    scales: {
      yAxes: [{
        display: true,
        ticks: {
          beginAtZero: true,
          max: 100,
          min: 0
        }
      }]
    }
  };

  self.chartOptions = {
    animation: {
      duration: 0
    },
    elements: {
      line: {
        borderWidth: 0.5,
        tension: 0.1
      },
      point: {
        radius: 0
      }
    },
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: true,
        ticks: {
          beginAtZero: true,
          suggestedMax: 3
        }
      }],
      gridLines: {
        display: false
      }
    }
  };

  self.getObjectLength = function (obj) {
    var length = -1;

    if (obj) {
      length = Object.keys(obj).length;
    }

    return length;
  };

  function Modal(templateName, resultCallback, resolves) {
    var self = this;

    self.modalData = {
      animation: true,
      controller: templateName,
      templateUrl: 'app/' + templateName + '/' + templateName + '.html',
      size: 'md',
      resolve: {}
    };

    if (resolves) {
      for (var attribute in resolves) {
        self.modalData.resolve[attribute] = function () {
          return resolves[attribute];
        };
      }
    }

    self.open = function () {
      self.instance = $uibModal.open(self.modalData);
      self.instance.result.then(resultCallback);
    };
  }
}

angular
  .module('app')
  .component('readOneGateway', {
    templateUrl: 'app/readOneGateway/readOneGateway.html',
    controller: readOneGatewayController
  });

