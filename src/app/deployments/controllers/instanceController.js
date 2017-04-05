angular.module('vamp-ui')
  .controller('instanceController', InstanceController);

function InstanceController($scope, $http, $location, $interval, $element, $state, $stateParams, clusterData, serviceData, $vamp) {
  var $ctrl = this;

  $ctrl.kind = $stateParams.kind;
  $ctrl.name = $stateParams.name;
  $ctrl.cluster = clusterData.name = $stateParams.cluster;
  $ctrl.serviceName = $stateParams.service;
  $ctrl.instanceName = $stateParams.instance;

  $ctrl.instance = _.find(serviceData.instances, {name: $ctrl.instanceName});
  $ctrl.origin = $vamp.origin;

  $ctrl.isFollowLog = true;
  $ctrl.stdout = [];
  $ctrl.stderr = [];
  $ctrl.canAccessLogs = false;

  // Configuration values and endpoints
  var dcosUrl;
  var mesosUrl;
  var logEndpoints;
  var slave;
  var stopInterval;

  // Retrieve config from VAMP API to check for either dcos url or mesos url
  $vamp.await(function () {
    $vamp.peek('configuration', '', {type: 'applied', flatten: true}, 'JSON');
  }).then(function (response) {
    var data = response.data || '';

    if (data['vamp.container-driver.dcos.url']) {
      dcosUrl = data['vamp.container-driver.dcos.url'];
    } else if (data['vamp.container-driver.mesos.url']) {
      var mesos = data['vamp.container-driver.mesos.url'];
      var mesosHost = mesos.substring(mesos.lastIndexOf('/') + 1, mesos.lastIndexOf(':'));
      var mesosPort = mesos.substring(mesos.lastIndexOf(':') + 1);
      mesosUrl = {host: mesosHost, port: mesosPort};
    }

    // Based on urls the logEndpoints object gets instantiated
    if (dcosUrl) {
      logEndpoints = {
        masterState: 'http://' + dcosUrl + '/mesos/master/state.json',
        slaveDebug: function (slave) {
          return 'http://' + dcosUrl + '/agent/' + slave.id + '/files/debug';
        },
        stdout: function (slaveId, logLocation) {
          return 'http://' + dcosUrl + '/agent/' + slave.id + '/files/read?offset=0&path=' + logLocation + '/stdout';
        },
        stderr: function (slaveId, logLocation) {
          return 'http://' + dcosUrl + '/agent/' + slave.id + '/files/read?offset=0&path=' + logLocation + '/stderr';
        }
      };
    } else if (mesosUrl) {
      logEndpoints = {
        masterState: 'http://' + $ctrl.origin + 'proxy/host/' + mesosUrl.host + '/port/' + mesosUrl.port + '/master/state.json',
        slaveDebug: function (slave) {
          return 'http://' + $ctrl.origin + 'proxy/host/' + getHost(slave) + '/port/' + getPort(slave) + '/files/debug';
        },
        stdout: function (slave, logLocation) {
          return 'http://' + $ctrl.origin + 'proxy/host/' + getHost(slave) + '/port/' + getPort(slave) + '/files/read?offset=0&path=/var/' + logLocation + '/stdout';
        },
        stderr: function (slave, logLocation) {
          return 'http://' + $ctrl.origin + 'proxy/host/' + getHost(slave) + '/port/' + getPort(slave) + '/files/read?offset=0&path=/var/' + logLocation + '/stderr';
        }
      };
    }

    init();
  });

  // Retrieves host endpoint from slave pid string
  function getHost(slave) {
    return slave.pid.substring(slave.pid.lastIndexOf('@') + 1, slave.pid.lastIndexOf(':'));
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
          var marathonFramework = _.find(res.data.frameworks, {name: 'marathon'});
          var task = _.find(marathonFramework.tasks, {id: $stateParams.instance});
          slave = _.find(res.data.slaves, {id: task.slave_id});

          return $http.get(logEndpoints.slaveDebug(slave));
        })
        .then(function (res) {
          $ctrl.canAccessLogs = true;

          var logLocation = _.find(_.values(res.data), function (val) {
            return val.indexOf($stateParams.instance) !== -1;
          });

          var stdoutUrl = logEndpoints.stdout(slave, logLocation);

          $http.get(stdoutUrl).then(function (res) {
            $ctrl.stdout = res.data.data;
            scrollToBottom();
          });

          var url = logEndpoints.stderr(slave, logLocation);

          $http.get(url).then(function (res) {
            $ctrl.stderr = res.data.data;
            scrollToBottom();
          });

          stopInterval = $interval(function () {
            $http.get(stdoutUrl).then(function (res) {
              if (res.data.data !== $ctrl.stdout) {
                $ctrl.stdout = res.data.data;
                scrollToBottom();
              }
            });

            $http.get(url).then(function (res) {
              $ctrl.stderr = res.data.data;
              scrollToBottom();
            });
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
