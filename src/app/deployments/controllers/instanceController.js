angular.module('vamp-ui')
  .controller('instanceController', InstanceController);

function InstanceController($scope, $http, $interval, $element, $state, $stateParams, clusterData, serviceData, $vamp) {
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

  var agent;
  var stopInterval;
  var mesos = 'http://' + $ctrl.origin + '/proxy/gateways/mesos';

  function init() {
    $vamp.get('/gateways/mesos')
      .then(function () {
        $http.get(mesos + '/master/state.json')
          .then(function (res) {
            var marathonFramework = _.find(res.data.frameworks, {name: 'marathon'});
            var task = _.find(marathonFramework.tasks, {id: $stateParams.instance});
            var slave = _.find(res.data.slaves, {id: task.slave_id});

            var host = slave.pid.substring(slave.pid.lastIndexOf('@') + 1, slave.pid.lastIndexOf(':'));
            var port = slave.pid.substring(slave.pid.lastIndexOf(':') + 1);

            agent = 'http://' + $ctrl.origin + '/proxy/host/' + host + '/port/' + port;

            return $http.get(agent + '/files/debug');
          })
          .then(function (res) {
            $ctrl.canAccessLogs = true;

            var logLocation = _.find(_.values(res.data), function (val) {
              return val.indexOf($stateParams.instance) !== -1;
            });

            var stdoutUrl = agent + '/files/read?path=/var' + logLocation + '/stdout&offset=0';

            $http.get(stdoutUrl).then(function (res) {
              $ctrl.stdout = res.data.data;
              scrollToBottom();
            });

            var url = agent + '/files/read?path=/var' + logLocation + '/stderr&offset=0';
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
      });
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

  init();
}
