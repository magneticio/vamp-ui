function deploymentsController($controller, $scope, $state, $stateParams, artifactsMetadata, $vamp, $vampDeployment) {
  var $ctrl = this;
  $controller('PaginationController', {$ctrl: $ctrl, $vamp: $vamp, $scope: $scope, artifactsMetadata: artifactsMetadata, $stateParams: $stateParams});

  var _deployments = [];
  $ctrl.deployments = [];
  $ctrl.config = artifactsMetadata;
  $ctrl.path = '/deployments';

  $ctrl.add = function () {
    $state.go('.add');
  };

  $ctrl.onView = function (deployment) {
    $state.go('.one', {
      name: deployment.name
    });
  };

  $ctrl.delete = function (deployment) {
    var index = _.findIndex(_deployments, {
      name: deployment.name
    });
    return $vamp.delete($ctrl.path + '/' + _deployments[index].name, angular.toJson(_deployments[index]));
  };

  $scope.$on($ctrl.path, function (e, response) {
    $scope.artifactsLoaded = true;
    $ctrl.parseHeaders(response);
    angular.copy(_.orderBy(response.data, 'name'), _deployments);
    angular.copy(_deployments, $ctrl.deployments);
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
      $ctrl.refresh();
    }
  });

  $ctrl.refresh();

  function getScale(deployment) {
    return $vampDeployment.scale(deployment);
  }

  function getStatus(deployment) {
    return $vampDeployment.deploymentStatus(deployment);
  }
}

deploymentsController.$inject = ['$controller', '$scope', '$state', '$stateParams', 'artifactsMetadata', '$vamp', '$vampDeployment'];
angular.module('vamp-ui').controller('deploymentsController', deploymentsController);
