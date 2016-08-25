/* global _*/
function readOneGatewayController(Api, $interval, $stateParams, $filter, toastr, EventStreamHandler, $uibModal, $state, DataManager) {
  var self = this;

  self.gateway = {};

  self.responseTimeFlowingValues = {
    values: new CappedArray(360),
    labels: new CappedArray(360)
  };

  self.rateFlowingValues = {
    values: new CappedArray(360),
    labels: new CappedArray(360)
  };

  Api.read('gateways', $stateParams.id).then(resourceLoaded);

  function resourceLoaded(response) {
    // Get the data and generate the metadata
    var gateway = response.data;
    addMetaData(gateway);
    self.gateway = gateway;

    //Add stream handlers
    EventStreamHandler.getStream(newHealthStatEvent, ['gateways', 'gateways:' + gateway.name, 'health']);
    EventStreamHandler.getStream(newResponseTimeEvent, ['gateways', 'gateways:' + gateway.name, 'metrics', 'metrics:responseTime']);
    EventStreamHandler.getStream(newRateEvent, ['gateways', 'gateways:' + gateway.name, 'metrics', 'metrics:rate']);

    //Define modals
    var routeWeights = {};
    for (var routeName in self.gateway.routes) {
      routeWeights[routeName] = parseInt(self.gateway.routes[routeName].weight);
    }

    var weightsModal = new Modal('editWeightsModal', function() {alert('test')}, {weightValues: routeWeights});
    weightsModal.open();
  }

  function addMetaData(gateway) {
    // get health stats
    gateway._$stats = {
      health: {
        data: new CappedArray(20),
        labels: new CappedArray(20)
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
      }

      function SparklineStats(size) {
        var self = this;
        self.values = new CappedArray(size);

        self.callback = function (event) {
          self.values.push(event.value);
        };
      }

      EventStreamHandler.getStream(route._$stats.health.callback, ['gateways', 'gateways:' + routeName, 'health']);
      EventStreamHandler.getStream(route._$stats.responseTime.callback, ['gateways', 'gateways:' + routeName, 'metrics', 'metrics:responseTime']);
      EventStreamHandler.getStream(route._$stats.rate.callback, ['gateways', 'gateways:' + routeName, 'metrics', 'metrics:rate']);
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
  
  // This will update the data for the repsonsetime and rate chart 25 times per second for a flowing look;
  $interval(function () {
   if (self.gateway._$stats) {
     var currentResponseTimeValue = self.gateway._$stats.responseTime.data.getLast();
     var currentRateValue = self.gateway._$stats.rate.data.getLast();

     self.responseTimeFlowingValues.values.push(currentResponseTimeValue);
     self.responseTimeFlowingValues.labels.push('');

     self.rateFlowingValues.values.push(currentRateValue);
     self.rateFlowingValues.labels.push('');
   }
  }, 25);





  self.openWeightsModal = function() {
  
  }

  //CONST

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


  self.test = function (test) {
    alert('test');
  }

  self.getObjectLength = function (obj) {
    var length = -1;

    if (obj) {
      length = Object.keys(obj).length;
    }

    return length;
  }

   //modal.open();


  function Modal(templateName, resultCallback, resolves) {
    var self = this;

    self.modalData = {
      animation: true,
      controller: templateName,
      templateUrl: 'app/' + templateName + '/' + templateName + '.html',
      size: 'md',
      resolve: {}
    };

    console.log(self.modalData);

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




  // function openEditWeightsModal(weights) {
    //   var modalInstance = $uibModal.open({
    //     animation: true,
    //     templateUrl: 'app/editWeightsModal/editWeightsModal.html',
    //     controller: 'editWeightsModal',
    //     size: 'md',
    //     resolve: {
    //       weightValues: function () {
    //         return weights;
    //       }
    //     }
    //   });
    //
    //   modalInstance.result.then(function (weightValues) {
    //     for (var routeName in weightValues) {
    //       if (routeName) {
    //         var weightValue = weightValues[routeName];
    //         self.data.routes[routeName].weight = weightValue + '%';
    //       }
    //     }
    //
    //     Api.update('gateways', self.data.name, self.data).then(gatewayWeightsAdjusted, gatewayWeightsAdjustedFailed);
    //
    //     function gatewayWeightsAdjusted() {
    //       toastr.success('Gateway ' + self.data.name + ' route weights have been adjusted', 'Route weights adjusted');
    //     }
    //
    //     function gatewayWeightsAdjustedFailed() {
    //       toastr.error('Gateway route weights could not be adjusted', 'Route weights not adjusted');
    //     }
    //   });

  //
  //
  //
  //
  //
  //
  //
  // var noOfPoints = 250;
  //
  // var self = this;
  // var gatewaysResource = DataManager.resource('gateways');
  // self.weights = {};
  //
  // self.currentHealth = 0;
  // self.currentRate = 0;
  // self.currentResponseTime = 0;
  //
  // self.healthChart = createChartData();
  // self.rateChart = createChartData();
  // self.responseChart = createChartData();
  //
  // self.editWeights = editWeights;
  // self.getValueFromPercentage = getValueFromPercentage;
  // self.updateGateway = updateGateway;
  //
  // self.editConditionStrength = editConditionStrength;
  // self.saveConditionWeightChange = saveConditionWeightChange;
  //
  //
  // self.routeHealthStats = {};
  //
  // self.BarChart = {
  //   data: [1, 2, 3, 4],
  //   options: {
  //     width: 150,
  //     height: 150
  //   }
  // };
  //
  //
  // self.getObjectSize = function (theObject) {
  //   return Object.keys(theObject).length;
  // }
  //
  // self.sliderOptions = {
  //   floor: 0,
  //   ceil: 100,
  //   showSelectionBar: true,
  //   translate: function (value) {
  //     console.log(value);
  //     return value + '%';
  //   }
  // };
  //
  // function saveConditionWeightChange(routeName, conditionStrength) {
  //   self.data.routes[routeName].condition_strength = conditionStrength + '%';
  //   updateGateway();
  // }
  //
  //
  //
  // function gatewayUpdated() {
  //   toastr.success('Gateway ' + self.data.name + ' has been updated with the new values.');
  // }
  //
  // function gatewayUpdatedFailed(error) {
  //   toastr.error(error.message, 'Gateway ' + self.data.name + 'could not be updated');
  // }
  //
  // var allowRefresh = true;
  //
  // self.barChartOptions = {
  //   scales: {
  //     xAxes: [{
  //       display: false
  //     }],
  //     yAxes: [{
  //       display: true,
  //       ticks: {
  //         beginAtZero: true,
  //         max: 100,
  //         min: 0
  //       }
  //     }],
  //     gridLines: {
  //       display: false
  //     }
  //   }
  // };
  //
  // self.chartOptions = {
  //   animation: {
  //     duration: 0
  //   },
  //   elements: {
  //     line: {
  //       borderWidth: 0.5
  //     },
  //     point: {
  //       radius: 0
  //     }
  //   },
  //   scales: {
  //     xAxes: [{
  //       display: false
  //     }],
  //     yAxes: [{
  //       display: true,
  //       ticks: {
  //         beginAtZero: true,
  //         suggestedMax: 3
  //       }
  //     }],
  //     gridLines: {
  //       display: false
  //     }
  //   }
  // };
  // var gatewayId = $stateParams.id;
  //
  // function createChartData() {
  //   var tempData = [];
  //   var tempLabels = [];
  //
  //   for (var i = 0; i < noOfPoints; i++) {
  //     tempLabels.push('');
  //     tempData.push(0);
  //   }
  //
  //   return {
  //     labels: tempLabels,
  //     series: ['serie'],
  //     data: [tempData]
  //   };
  // }
  //
  // refreshGateway();
  // function refreshGateway() {
  //   if (allowRefresh) {
  //     Api.read('gateways', gatewayId).then(gatewayLoaded, gatewayCouldNotBeLoaded);
  //   }
  //
  //
  // }
  //
  // //S etting up the health chart
  // self.healthChart.labels = [];
  // self.healthChart.data = [[]];
  // for (var i = 0; i < 20; i++) {
  //
  //   self.healthChart.labels.push('');
  //   self.healthChart.data[0].push(undefined);
  // }
  //
  // self.healthChart.series = ['Series A'];
  //
  // self.healthChart.colors = ['#00FF00'];
  // self.healthChart.options = {
  //   animation: false,
  //   scales: {
  //     yAxes: [{
  //       display: true,
  //       ticks: {
  //         beginAtZero: true,
  //         max: 100,
  //         min: 0
  //       }
  //     }]
  //   }
  // };
  //
  // function addHealthStat(label, value) {
  //   self.healthChart.labels.shift();
  //   self.healthChart.labels.push(label);
  //
  //   self.healthChart.data[0].shift();
  //   self.healthChart.data[0].push(value);
  // }
  //
  // Api.readAll('events', {tag: 'gateways:' + $stateParams.id}).then(eventsLoaded);
  //
  // function eventsLoaded(response) {
  //   for (var i = response.data.length - 1; i >= 0; i--) {
  //     eventFired(response.data[i]);
  //   }
  // }
  //
  // EventStreamHandler.getStream('gateways:' + gatewayId, eventFired);
  //
  // function eventFired(data) {
  //   if (_.includes(data.tags, 'health')) {
  //     self.currentHealth = data.value * 100;
  //     self.parsedData = $filter('date')(data.timestamp, "mm:ss");
  //     addHealthStat(self.parsedData, self.currentHealth);
  //   }
  //
  //   if (_.includes(data.tags, 'metrics:rate')) {
  //     self.currentRate = data.value;
  //   }
  //
  //   if (_.includes(data.tags, 'metrics:responseTime')) {
  //     self.currentResponseTime = data.value;
  //   }
  // }
  //
  // var intervalId = $interval(
  //   function () {
  //     refreshGateway();
  //   },
  //   5000
  // );
  // gatewaysResource.registerInterval(intervalId);
  //
  // $interval(
  //   function () {
  //     if (self.rateChart.data[0].length > noOfPoints) {
  //       self.rateChart.labels.shift();
  //       self.rateChart.data[0].shift();
  //     }
  //
  //     self.rateChart.labels.push('');
  //     self.rateChart.data[0].push(self.currentRate);
  //
  //     if (self.responseChart.data[0].length > noOfPoints) {
  //       self.responseChart.labels.shift();
  //       self.responseChart.data[0].shift();
  //     }
  //
  //     self.responseChart.labels.push('');
  //     self.responseChart.data[0].push(self.currentResponseTime);
  //   },
  //   40
  // );
  //
  // function gatewayLoaded(gateway) {
  //   self.data = gateway.data;
  //   for (var routeName in self.data.routes) {
  //     if (routeName) {
  //       self.weights[routeName] = getValueFromPercentage(self.data.routes[routeName].weight);
  //     }
  //   }
  // }
  //
  // function gatewayCouldNotBeLoaded() {
  //   $state.go('readAllGateways');
  // }
  //
  // function getValueFromPercentage(percentage) {
  //   var withoutPercentage = percentage.substring(0, percentage.length - 1);
  //   return parseInt(withoutPercentage, 10);
  // }
  //
  // function editWeights() {
  //   var weights = {};
  //   for (var routeName in self.data.routes) {
  //     if (routeName) {
  //       weights[routeName] = getValueFromPercentage(self.data.routes[routeName].weight);
  //     }
  //   }
  //
  //   openEditWeightsModal(weights);
  // }
  //
  // self.conditionStrengths = {};
  // function editConditionStrength(routeName, weightPercentage) {
  //   console.log(routeName);
  //   console.log(getValueFromPercentage(weightPercentage));
  //   self.conditionStrengths[routeName] = getValueFromPercentage(weightPercentage);
  // }
  //
  // function openEditWeightsModal(weights) {
  //   var modalInstance = $uibModal.open({
  //     animation: true,
  //     templateUrl: 'app/editWeightsModal/editWeightsModal.html',
  //     controller: 'editWeightsModal',
  //     size: 'md',
  //     resolve: {
  //       weightValues: function () {
  //         return weights;
  //       }
  //     }
  //   });
  //
  //   modalInstance.result.then(function (weightValues) {
  //     for (var routeName in weightValues) {
  //       if (routeName) {
  //         var weightValue = weightValues[routeName];
  //         self.data.routes[routeName].weight = weightValue + '%';
  //       }
  //     }
  //
  //     Api.update('gateways', self.data.name, self.data).then(gatewayWeightsAdjusted, gatewayWeightsAdjustedFailed);
  //
  //     function gatewayWeightsAdjusted() {
  //       toastr.success('Gateway ' + self.data.name + ' route weights have been adjusted', 'Route weights adjusted');
  //     }
  //
  //     function gatewayWeightsAdjustedFailed() {
  //       toastr.error('Gateway route weights could not be adjusted', 'Route weights not adjusted');
  //     }
  //   });
  // }
}

angular
  .module('app')
  .component('readOneGateway', {
    templateUrl: 'app/readOneGateway/readOneGateway.html',
    controller: readOneGatewayController
  });

