angular.module('app')
  .controller('serviceController', ServiceController);

function ServiceController($scope, $timeout, $state, $stateParams, $uibModal, artifactData, clusterData, serviceData, $vamp, $vampDeployment, alert, toastr) {
  var $ctrl = this;

  $ctrl.kind = $stateParams.kind;
  $ctrl.name = $stateParams.name;
  $ctrl.cluster = clusterData.name = $stateParams.cluster;
  $ctrl.serviceName = $stateParams.service;

  $ctrl.service = serviceData;
  $ctrl.health = null;
  if ($ctrl.service.health) {
    $ctrl.service.health.unknown = $ctrl.service.health.running - $ctrl.service.health.unhealthy - $ctrl.service.health.healthy;
  }

  var path = '/deployments/' + $stateParams.name;

  $ctrl.editScale = function () {
    $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'editScale',
      resolve: {
        deployment: function () {
          return artifactData;
        },
        cluster: function () {
          return clusterData;
        },
        service: function () {
          return $ctrl.service;
        }
      }
    }).result.then(function (scale) {
      $vamp.await(function () {
        $vamp.put(path + '/clusters/' + clusterData.name + '/services/' + $ctrl.service.breed.name + '/scale', angular.toJson(scale));
      }).then(function () {
        toastr.success('Scale for service \'' + $ctrl.service.breed.name + '\' has been successfully updated.');
      }).catch(function (response) {
        toastr.error(response.data.message, 'Update of scale for service \'' + $ctrl.service.breed.name + '\' failed.');
      });
    });
  };

  $scope.$on(path, function (e, response) {
    if (response.status === 'ERROR') {
      return;
    }

    var services = $vampDeployment.services(response.data);

    var s = _.find(services, ['breed.name', $ctrl.serviceName]);
    $ctrl.service = angular.copy(s);
    if ($ctrl.service.health) {
      $ctrl.service.health.unknown = $ctrl.service.health.running - $ctrl.service.health.unhealthy - $ctrl.service.health.healthy;
    }

    peekEvents();
  });

  $scope.$on('/events', function (e, response) {
    $timeout(function () {
      _.forEach(response.data, function (event) {
        handleEvent(event);
      });
    }, 0);
  });

  $scope.$on('/events/stream', function (e, response) {
    var event = response.data;
    handleEvent(event);
  });

  function handleEvent(event) {
    if (_.includes(event.tags, 'deployments:' + $ctrl.name)) {
      if (_.includes(event.tags, 'synchronization') || _.includes(event.tags, 'archive')) {
        $vamp.await(function () {
          $vamp.peek(path);
          toastr.success('Service \'' + $ctrl.serviceName + '\' has been updated in the background.');
        }).catch(function () {
          alert.show('Warning', '\'' + $ctrl.name + '\' has been deleted in background. Do you want to leave or stay on this page?', 'Leave', 'Stay', function () {
            $state.go('artifacts');
          });
        });
      } else if (_.includes(event.tags, 'health')) {
        $ctrl.health = 100 * Number(event.value);
      }
    } else {
      var scaleUpdate = _.find(event.tags, function (tag) {
        return tag.indexOf('deployment-service-scales:' + $ctrl.name + '/' + $ctrl.cluster + '/' + $ctrl.serviceName) === 0;
      });
      if (scaleUpdate) {
        $vamp.peek(path);
        toastr.warning('Service \'' + $ctrl.serviceName + '\' update has started in the background.');
      }
    }
  }

  function peekEvents() {
    var nameTag = 'deployments:' + $ctrl.name;
    var requests = [
          {tags: [nameTag, 'service', 'services:' + $ctrl.service.breed.name], timestamp: {gte: 'now-1m'}},
          {tags: [nameTag, 'service', 'health', 'services:' + $ctrl.service.breed.name], timestamp: {gte: 'now-1m'}}
    ];

    _.forEach(requests, function (request) {
      $vamp.peek('/events', JSON.stringify(request));
    });
  }

  peekEvents();
}
