function readOneDeploymentController(Api, $stateParams, $state, EventStreamHandler, $interval) {
  var noOfPoints = 250;

  var self = this;
  self.data = {};
  self.chart = {};
  self.currentHealth = 0;
  self.healthChart = createChartData();


  var deploymentId = $stateParams.id;

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
      data: [tempData],
    }
  }


  $interval(
    function () {

      if (self.healthChart.data[0].length > noOfPoints) {
        self.healthChart.labels.shift();
        self.healthChart.data[0].shift();
      }

      self.healthChart.labels.push('');
      self.healthChart.data[0].push(self.currentHealth);
    },
    40
  );


  function refreshDeployment() {
    Api.read('deployments', deploymentId).then(deploymentLoaded, deploymentCouldNotBeLoaded);
  }

  $interval(
    function () {
      refreshDeployment()
    },
    3000
  );

  function deploymentLoaded(deployment) {
    self.data = deployment.data;
  }

  function deploymentCouldNotBeLoaded() {
    $state.go('readAllDeployments');
  }

  EventStreamHandler.getStream('deployments:' + deploymentId, eventFired);
  var maximum = 20;

  self.chart.data = [[]];
  self.chart.labels = [];
  self.chart.options = {
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
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false,
        ticks: {
          max: 20,
          min: 0,
          stepSize: 5
        }
      }],
      gridLines: {
        display: false
      }
    },
    tooltips: {
      enabled: false
    }
  };

  var lastEvent = {
    value: 0
  };

  // Update the dataset at 25FPS for a smoothly-animating chart
  $interval(function () {
    getLastEvent();
  }, 100);

  function getLastEvent() {
    if (self.chart.data[0].length) {
      self.chart.labels = self.chart.labels.slice(1);
      self.chart.data[0] = self.chart.data[0].slice(1);
    }

    self.chart.labels.push('');
    self.chart.data[0].push(lastEvent.value * 100);

  }



  getResetData();
  function getResetData () {
    while (self.chart.data[0].length < maximum) {
      self.chart.labels.push('');
      self.chart.data[0].push(0);
    }
  }

  function getRandomValue (data) {
    var l = data.length, previous = l ? data[l - 1] : 50;
    var y = previous + Math.random() * 10 - 5;
    return y < 0 ? 0 : y > 100 ? 100 : y;
  }


  function eventFired(data) {
    console.log('whahhahaha', data);
    if (_.includes(data.tags, 'health')) {
      self.currentHealth = data.value * 100;
    }
  }


  $interval(function () {

  }, 3000);
}

angular
  .module('app')
  .component('readOneDeployment', {
    templateUrl: 'app/readOneDeployment/readOneDeployment.html',
    controller: readOneDeploymentController
  });

