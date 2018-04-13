function blueprintsController($controller, $scope, $state, $stateParams, artifactsMetadata, $vamp, $uibModal, $authorization) {
  var $ctrl = this;
  $controller('PaginationController', {$ctrl: $ctrl, $vamp: $vamp, $scope: $scope, artifactsMetadata: artifactsMetadata, $stateParams: $stateParams});

  $ctrl.blueprints = [];
  $ctrl.config = artifactsMetadata;
  $ctrl.path = '/blueprints';

  $ctrl.readOnly = function () {
    return $authorization.readOnly('blueprints');
  };

  $ctrl.add = function () {
    $state.go('.add');
  };

  $ctrl.addForm = function () {
    $state.go('.add-form');
  };

  $ctrl.onView = function (blueprint) {
    $state.go('.one.source-form.view', {
      name: blueprint.name
    });
  };

  $ctrl.delete = function (blueprint) {
    return $vamp.delete($ctrl.path + '/' + blueprint.name, angular.toJson(blueprint));
  };

  $ctrl.upload = function () {
    $uibModal.open({
      animation: true,
      backdrop: 'static',
      controller: 'importBlueprintControler',
      templateUrl: 'app/blueprints/templates/importBlueprint.html',
      resolve: {
      }
    }).result.then(function (data) {
      $state.go('.add', {importData: data.blueprint});
    });
  };

  $scope.$on($ctrl.path, function (e, response) {
    $scope.artifactsLoaded = true;
    $ctrl.parseHeaders(response);
    angular.copy(_.orderBy(response.data, 'name'), $ctrl.blueprints);
  });

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'blueprints')) {
      $ctrl.refresh();
    }
  });

  $ctrl.refresh();
}

blueprintsController.$inject = ['$controller', '$scope', '$state', '$stateParams', 'artifactsMetadata', '$vamp', '$uibModal', '$authorization'];
angular.module('vamp-ui').controller('blueprintsController', blueprintsController);
