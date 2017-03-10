/* global Environment */

angular.module('app')
  .controller('instanceController', InstanceController);

function InstanceController($scope, $http, $interval, $element, $state, $stateParams, clusterData, serviceData) {
  var $ctrl = this;

  $ctrl.kind = $stateParams.kind;
  $ctrl.name = $stateParams.name;
  $ctrl.cluster = clusterData.name = $stateParams.cluster;
  $ctrl.serviceName = $stateParams.service;
  $ctrl.instanceName = $stateParams.instance;

  $ctrl.instance = _.find(serviceData.instances, {name: $ctrl.instanceName});

  var host = $ctrl.host = 'http://' + Environment.prototype.origin().substring(0, Environment.prototype.origin().indexOf(':'));
  $ctrl.isFollowLog = true;
  $ctrl.stdout = [];
  $ctrl.stderr = [];

  var stopInterval;

  function init() {
    $http.get(host + ':5050/master/state.json')
      .then(function (res) {
        var marathonFramework = _.find(res.data.frameworks, {name: 'marathon'});
        var task = _.find(marathonFramework.tasks, {id: $stateParams.instance});
        var slave = _.find(res.data.slaves, {id: task.slave_id});

        host = host + ":" + slave.pid.substring(slave.pid.lastIndexOf(':') + 1);
        return $http.get(host + '/files/debug');
      })
      .then(function (res) {
        var logLocation = _.find(_.values(res.data), function (val) {
          return val.indexOf($stateParams.instance) !== -1;
        });

        var stdoutUrl = host + '/files/read?path=/var' + logLocation + '/stdout&offset=0';
        $http.get(stdoutUrl).then(function (res) {
          $ctrl.stdout = res.data.data;
          scrollToBottom();
        });

        var url = host + '/files/read?path=/var' + logLocation + '/stderr&offset=0';
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

  function scrollToBottom() {
    if ($ctrl.isFollowLog) {
      var scrolledContainer = $($element).find('.panel-body');
      scrolledContainer.scrollTop(scrolledContainer.prop('scrollHeight'));
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
