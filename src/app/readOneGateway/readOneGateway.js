function readOneGatewayController(Api, $interval, $stateParams, EventStreamHandler, $filter) {
  var currentHealth = 0;
  var currentRate = 0;
  var currentResponseTime = 0;

  var noOfPoints = 250;

  var self = this;
  self.data = {};
  self.weights = {};

  self.healthChart = createChartData();
  self.rateChart = createChartData();
  self.responseChart = createChartData();

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
      currentHealth = data.value;
      console.log('health: ', data);
    }

    if(_.includes(data.tags, 'metrics:rate')) {
      currentRate = data.value;
      console.log('Rate: ', data);
    }

    if(_.includes(data.tags, 'metrics:responseTime')) {
      currentResponseTime = data.value;
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
      // self.healthChart.data[0].push(currentHealth);

      if(self.rateChart.data[0].length > noOfPoints) {
        self.rateChart.labels.shift();
        self.rateChart.data[0].shift();
      }

      self.rateChart.labels.push('');
      self.rateChart.data[0].push(currentRate);

      if(self.responseChart.data[0].length > noOfPoints) {
        self.responseChart.labels.shift();
        self.responseChart.data[0].shift();
      }

      self.responseChart.labels.push('');
      self.responseChart.data[0].push(currentResponseTime);

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
}

angular
  .module('app')
  .component('readOneGateway', {
    templateUrl: 'app/readOneGateway/readOneGateway.html',
    controller: readOneGatewayController
  });

