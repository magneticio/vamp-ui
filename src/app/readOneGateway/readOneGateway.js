function readOneGatewayController(Api, $interval, $stateParams, toastr, EventStreamHandler, $uibModal) {
  var noOfPoints = 250;

  var self = this;
  self.data = {};
  self.weights = {};

  self.currentHealth = 0;
  self.currentRate = 0;
  self.currentResponseTime = 0;

  self.healthChart = createChartData();
  self.rateChart = createChartData();
  self.responseChart = createChartData();

  self.editWeights = editWeights;
  self.getValueFromPercentage = getValueFromPercentage;

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
    }
  }


  function refreshDeployment() {
    Api.read('gateways', gatewayId).then(gatewayLoaded, gatewayCouldNotBeLoaded);
  }

  EventStreamHandler.getStream('gateways:' + gatewayId, eventFired);

  function eventFired(data) {

    if(_.includes(data.tags, 'health')) {
      self.currentHealth = data.value;
      console.log('health: ', data);
    }

    if(_.includes(data.tags, 'metrics:rate')) {
      self.currentRate = data.value;
      console.log('Rate: ', data);
    }

    if(_.includes(data.tags, 'metrics:responseTime')) {
      self.currentResponseTime = data.value;
      console.log('Response Time: ', data);
    }

  }

  $interval(
    function() { refreshDeployment() },
    3000
  );

  $interval(
    function() {


      // self.healthChart.labels.push('test');
      // self.healthChart.data[0].push(self.currentHealth);

      if(self.rateChart.data[0].length > noOfPoints) {
        self.rateChart.labels.shift();
        self.rateChart.data[0].shift();
      }

      self.rateChart.labels.push('');
      self.rateChart.data[0].push(self.currentRate);

      if(self.responseChart.data[0].length > noOfPoints) {
        self.responseChart.labels.shift();
        self.responseChart.data[0].shift();
      }

      self.responseChart.labels.push('');
      self.responseChart.data[0].push(self.currentResponseTime);

    },
    40
  );


  function gatewayLoaded(gateway) {
    self.data = gateway;

    for (var routeName in self.data.routes) {
      self.weights[routeName] = getValueFromPercentage(self.data.routes[routeName].weight);
    }
  }

  function gatewayCouldNotBeLoaded() {
    $state.go('readAllGateways');
  }

  function getValueFromPercentage(percentage) {
    var withoutPercentage = percentage.substring(0, percentage.length - 1);
    return parseInt(withoutPercentage);
  }

  function editWeights() {
    var weights = {};
    for(var routeName in self.data.routes) {
      weights[routeName] = getValueFromPercentage(self.data.routes[routeName].weight);
    }

    openEditWeightsModal(weights);
  }

  function openEditWeightsModal(weights) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'app/editWeightsModal/editWeightsModal.html',
      controller: 'editWeightsModal',
      size: 'md',
      resolve: {
        weightValues: function() {
          return weights;
        }
      }
    });


    modalInstance.result.then(function (weightValues) {

      for(routeName in weightValues) {
        var weightValue = weightValues[routeName];
        self.data.routes[routeName].weight = weightValue + '%';
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

