function deploymentsController($scope, $state, $stateParams, artifactsMetadata, $vamp, $vampDeployment) {
  var $ctrl = this;

  $ctrl.deployments = [];
  $ctrl.config = artifactsMetadata;
  var path = '/deployments';

  $ctrl.add = function () {
    $state.go('.add');
  };

  $ctrl.onView = function (condition) {
    $state.go('.one', {
      name: condition.name
    });
  };

  $ctrl.delete = function (condition) {
    $vamp.remove(path + '/' + condition.name, angular.toJson(condition));
  };

  // $scope event listenters

  $scope.$on('$vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      peek();
    }
  });

  $scope.$on(path, function (e, response) {
    angular.copy(_.orderBy(response.data, 'name'), $ctrl.deployments);
    angular.forEach($ctrl.deployments, function (ar) {
      ar.scale = getScale(ar);
      ar.status = getStatus(ar);
    });
  });

  $scope.$on('/events/stream', function (e, response) {
    if ((_.includes(response.data.tags, 'archive') ||
          _.includes(response.data.tags, 'deployed') ||
          _.includes(response.data.tags, 'undeployed') ||
         _.includes(response.data.tags, 'synchronization')) || _.includes(response.data.tags, 'deployments')) {
      peek();
    }
  });

  function peek() {
    $vamp.peek(path);
  }

  peek();

  function getScale(deployment) {
    return $vampDeployment.scale(deployment);
  }

  function getStatus(deployment) {
    return $vampDeployment.deploymentStatus(deployment);
  }
}

deploymentsController.$inject = ['$scope', '$state', '$stateParams', 'artifactsMetadata', '$vamp', '$vampDeployment'];
angular.module('vamp-ui').controller('deploymentsController', deploymentsController);
