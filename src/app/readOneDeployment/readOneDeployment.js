function readOneDeploymentController(Api, $stateParams, $state, EventStreamHandler, $interval) {
  var self = this;
  self.data = {};
  self.chart = {};
  self.currentHealthValue = 0;


  var deploymentId = $stateParams.id;


  function refreshDeployment() {
    Api.read('deployments', deploymentId).then(deploymentLoaded, deploymentCouldNotBeLoaded);
  }

  $interval(
    function() { refreshDeployment() },
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
    //$scope.$broadcast('deployments:' + deploymentId + ':newHealthValue', data);
    console.log('EVENT FIRED');
    lastEvent = data;
  }



}

angular
  .module('app')
  .component('readOneDeployment', {
    templateUrl: 'app/readOneDeployment/readOneDeployment.html',
    controller: readOneDeploymentController
  });

