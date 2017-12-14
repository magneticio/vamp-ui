angular.module('vamp-ui')
  .controller('instanceController', InstanceController);

function InstanceController($scope, $http, $interval, $element, $stateParams, clusterData, serviceData, $vamp) {
  var $ctrl = this;

  $ctrl.kind = $stateParams.kind;
  $ctrl.name = $stateParams.name;
  $ctrl.cluster = clusterData.name = $stateParams.cluster;
  $ctrl.serviceName = $stateParams.service;
  $ctrl.instanceName = $stateParams.instance;

  $ctrl.instance = _.find(serviceData.instances, {
    name: $ctrl.instanceName
  });
  $ctrl.url = '';
  if ($vamp.baseUrl) {
    $ctrl.url = window.location.protocol + '//' + $vamp.baseUrl;
  }
  if ($vamp.getRequestNamespace()) {
    $ctrl.url += $vamp.getRequestNamespace() + '/';
  } else if ($vamp.getConnectionNamespace()) {
    $ctrl.url += $vamp.getConnectionNamespace() + '/';
  }

  $ctrl.isFollowLog = true;
  $ctrl.stdout = '';
  $ctrl.stderr = '';
  $ctrl.canAccessLogs = false;

  // Configuration values and endpoints
  var mesosUrl;
  var logEndpoints;
  var slave;
  var stopInterval;
  var stdoutOffset = 0;
  var stderrOffset = 0;
  var logsChunkLength = 1024;

  // Retrieve config from VAMP API to check for either dcos url or mesos url
  $vamp.get('/mesosconfig', {
    type: 'applied',
    flatten: true
  }, 'JSON')
    .then(function (response) {
      var mesos = response.data;
      var mesosHost = mesos.substring(mesos.lastIndexOf('/') + 1, mesos.lastIndexOf(':'));
      var mesosPort = mesos.substring(mesos.lastIndexOf(':') + 1);
      initLogEndpoints(mesosHost, mesosPort);
      init();
    })
    .catch(function () {
      $http.get($ctrl.url + 'proxy/host/leader.mesos/port/5050/').then(function () {
        initLogEndpoints('leader.mesos', '5050');
        init();
      }, function () {
        $http.get($ctrl.url + 'proxy/host/localhost/port/5050/').then(function () {
          initLogEndpoints('localhost', '5050');
          init();
        });
      });
    });

  function initLogEndpoints(mesosHost, mesosPort) {
    mesosUrl = {
      host: mesosHost,
      port: mesosPort
    };
    // Based on urls the logEndpoints object gets instantiated
    logEndpoints = {
      masterState: $ctrl.url + 'proxy/host/' + mesosUrl.host + '/port/' + mesosUrl.port + '/master/state.json',
      slaveDebug: function (slave) {
        return $ctrl.url + 'proxy/host/' + getHost(slave) + '/port/' + getPort(slave) + '/files/debug';
      }
    };
  }

  function stdout(slave, logLocation) {
    $http
      .get($ctrl.url + 'proxy/host/' + getHost(slave) + '/port/' + getPort(slave) + '/files/read?path=' + logLocation + '/stdout&offset=' + stdoutOffset + '&length=' + logsChunkLength)
      .then(function (res) {
        var responseLength = res.data.data.length;
        if (responseLength) {
          $ctrl.stdout += res.data.data;
          stdoutOffset += responseLength;
          scrollToBottom();
        }
      });
  }

  function stderr(slave, logLocation) {
    $http
      .get($ctrl.url + 'proxy/host/' + getHost(slave) + '/port/' + getPort(slave) + '/files/read?path=' + logLocation + '/stderr&offset=' + stderrOffset + '&length=' + logsChunkLength)
      .then(function (res) {
        var responseLength = res.data.data.length;
        if (responseLength) {
          $ctrl.stderr += res.data.data;
          stderrOffset += responseLength;
          scrollToBottom();
        }
      });
  }

  // Retrieves host endpoint from slave pid string
  function getHost(slave) {
    return slave.hostname;
  }

  // Retrieves port from slave pid string
  function getPort(slave) {
    return slave.pid.substring(slave.pid.lastIndexOf(':') + 1);
  }

  // Starts retrieving the log files gets called AFTER retrieving data
  function init() {
    if (logEndpoints) {
      $http.get(logEndpoints.masterState)
        .then(function (res) {
          var marathonFramework = _.find(res.data.frameworks, {
            name: 'marathon'
          });
          var task = _.find(marathonFramework.tasks, {
            id: $stateParams.instance
          });
          slave = _.find(res.data.slaves, {
            id: task.slave_id
          });

          return $http.get(logEndpoints.slaveDebug(slave));
        })
        .then(function (res) {
          $ctrl.canAccessLogs = true;

          var logLocation = _.find(_.values(res.data), function (val) {
            return val.indexOf($stateParams.instance) !== -1;
          });

          if (logLocation.indexOf('/var') === -1) {
            logLocation = "/var" + logLocation;
          }

          stdout(slave, logLocation);

          stderr(slave, logLocation);

          stopInterval = $interval(function () {
            stdout(slave, logLocation);

            stderr(slave, logLocation);
          }, 1000);
        });
    }
  }

  $ctrl.toggleFollowOnOff = function () {
    scrollToBottom();
  };

  function scrollToBottom() {
    if ($ctrl.isFollowLog) {
      var scrolledContainer = $($element).find('div.active pre');

      if (scrolledContainer) {
        scrolledContainer.scrollTop(scrolledContainer.prop('scrollHeight'));
      }
    }
  }

  $scope.$on('$destroy', function () {
    if (stopInterval) {
      $interval.cancel(stopInterval);
      stopInterval = null;
    }
  });
}
