/* global _*/
function readOneGatewayController(Api, $interval, $stateParams, $filter, toastr, EventStreamHandler, $uibModal, $state, DataManager) {
















































  var noOfPoints = 250;

  var self = this;
  var gatewaysResource = DataManager.resource('gateways');
  self.weights = {};

  self.currentHealth = 0;
  self.currentRate = 0;
  self.currentResponseTime = 0;

  self.healthChart = createChartData();
  self.rateChart = createChartData();
  self.responseChart = createChartData();

  self.editWeights = editWeights;
  self.getValueFromPercentage = getValueFromPercentage;
  self.updateGateway = updateGateway;

  self.editConditionStrength = editConditionStrength;
  self.saveConditionWeightChange = saveConditionWeightChange;


  self.routeHealthStats = {};

  self.BarChart = {
    data: [1, 2, 3, 4],
    options: {
      width: 150,
      height: 150
    }
  };


  self.getObjectSize = function (theObject) {
    return Object.keys(theObject).length;
  }

  self.sliderOptions = {
    floor: 0,
    ceil: 100,
    showSelectionBar: true,
    translate: function (value) {
      console.log(value);
      return value + '%';
    }
  };

  function saveConditionWeightChange(routeName, conditionStrength) {
    self.data.routes[routeName].condition_strength = conditionStrength + '%';
    updateGateway();
  }

  function updateGateway() {
    Api.update('gateways', self.data.name, self.data).then(gatewayUpdated, gatewayUpdatedFailed);
  }

  function gatewayUpdated() {
    toastr.success('Gateway ' + self.data.name + ' has been updated with the new values.');
  }

  function gatewayUpdatedFailed(error) {
    toastr.error(error.message, 'Gateway ' + self.data.name + 'could not be updated');
  }

  var allowRefresh = true;

  self.barChartOptions = {
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: true,
        ticks: {
          beginAtZero: true,
          max: 100,
          min: 0
        }
      }],
      gridLines: {
        display: false
      }
    }
  };

  self.chartOptions = {
    animation: {
      duration: 0
    },
    elements: {
      line: {
        borderWidth: 0.5
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
  var gatewayId = $stateParams.id;

  function createChartData() {
    var tempData = [];
    var tempLabels = [];

    for (var i = 0; i < noOfPoints; i++) {
      tempLabels.push('');
      tempData.push(0);
    }

    return {
      labels: tempLabels,
      series: ['serie'],
      data: [tempData]
    };
  }

  refreshGateway();
  function refreshGateway() {
    if (allowRefresh) {
      Api.read('gateways', gatewayId).then(gatewayLoaded, gatewayCouldNotBeLoaded);
    }


  }

  //S etting up the health chart
  self.healthChart.labels = [];
  self.healthChart.data = [[]];
  for (var i = 0; i < 20; i++) {

    self.healthChart.labels.push('');
    self.healthChart.data[0].push(undefined);
  }

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

  function addHealthStat(label, value) {
    self.healthChart.labels.shift();
    self.healthChart.labels.push(label);

    self.healthChart.data[0].shift();
    self.healthChart.data[0].push(value);
  }

  Api.readAll('events', {tag: 'gateways:' + $stateParams.id}).then(eventsLoaded);

  function eventsLoaded(response) {
    for (var i = response.data.length - 1; i >= 0; i--) {
      eventFired(response.data[i]);
    }
  }

  EventStreamHandler.getStream('gateways:' + gatewayId, eventFired);
  
  function eventFired(data) {
    if (_.includes(data.tags, 'health')) {
      self.currentHealth = data.value * 100;
      self.parsedData = $filter('date')(data.timestamp, "mm:ss");
      addHealthStat(self.parsedData, self.currentHealth);
    }

    if (_.includes(data.tags, 'metrics:rate')) {
      self.currentRate = data.value;
    }

    if (_.includes(data.tags, 'metrics:responseTime')) {
      self.currentResponseTime = data.value;
    }
  }

  var intervalId = $interval(
    function () {
      refreshGateway();
    },
    5000
  );
  gatewaysResource.registerInterval(intervalId);

  $interval(
    function () {
      if (self.rateChart.data[0].length > noOfPoints) {
        self.rateChart.labels.shift();
        self.rateChart.data[0].shift();
      }

      self.rateChart.labels.push('');
      self.rateChart.data[0].push(self.currentRate);

      if (self.responseChart.data[0].length > noOfPoints) {
        self.responseChart.labels.shift();
        self.responseChart.data[0].shift();
      }

      self.responseChart.labels.push('');
      self.responseChart.data[0].push(self.currentResponseTime);
    },
    40
  );

  function gatewayLoaded(gateway) {
    self.data = gateway.data;
    for (var routeName in self.data.routes) {
      if (routeName) {
        self.weights[routeName] = getValueFromPercentage(self.data.routes[routeName].weight);
      }
    }
  }

  function gatewayCouldNotBeLoaded() {
    $state.go('readAllGateways');
  }

  function getValueFromPercentage(percentage) {
    var withoutPercentage = percentage.substring(0, percentage.length - 1);
    return parseInt(withoutPercentage, 10);
  }

  function editWeights() {
    var weights = {};
    for (var routeName in self.data.routes) {
      if (routeName) {
        weights[routeName] = getValueFromPercentage(self.data.routes[routeName].weight);
      }
    }

    openEditWeightsModal(weights);
  }

  self.conditionStrengths = {};
  function editConditionStrength(routeName, weightPercentage) {
    console.log(routeName);
    console.log(getValueFromPercentage(weightPercentage));
    self.conditionStrengths[routeName] = getValueFromPercentage(weightPercentage);
  }

  function openEditWeightsModal(weights) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'app/editWeightsModal/editWeightsModal.html',
      controller: 'editWeightsModal',
      size: 'md',
      resolve: {
        weightValues: function () {
          return weights;
        }
      }
    });

    modalInstance.result.then(function (weightValues) {
      for (var routeName in weightValues) {
        if (routeName) {
          var weightValue = weightValues[routeName];
          self.data.routes[routeName].weight = weightValue + '%';
        }
      }

      Api.update('gateways', self.data.name, self.data).then(gatewayWeightsAdjusted, gatewayWeightsAdjustedFailed);

      function gatewayWeightsAdjusted() {
        toastr.success('Gateway ' + self.data.name + ' route weights have been adjusted', 'Route weights adjusted');
      }

      function gatewayWeightsAdjustedFailed() {
        toastr.error('Gateway route weights could not be adjusted', 'Route weights not adjusted');
      }
    });
  }
}

angular
  .module('app')
  .component('readOneGateway', {
    templateUrl: 'app/readOneGateway/readOneGateway.html',
    controller: readOneGatewayController
  });

