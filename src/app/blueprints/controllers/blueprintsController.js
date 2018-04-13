function blueprintsController($scope, $state, $stateParams, artifactsMetadata, $vamp, $uibModal, $authorization) {
  var $ctrl = this;

  $ctrl.blueprints = [];
  $ctrl.config = artifactsMetadata;
  var path = '/blueprints';

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
    $vamp.delete(path + '/' + blueprint.name, angular.toJson(blueprint)).then(function () {
      $vamp.emit(path);
    });
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

  $scope.$on(path, function (e, response) {
    $scope.artifactsLoaded = true;
    angular.copy(_.orderBy(response.data, 'name'), $ctrl.blueprints);
  });

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'blueprints')) {
      $vamp.emit(path);
    }
  });

  $vamp.emit(path);
}

blueprintsController.$inject = ['$scope', '$state', '$stateParams', 'artifactsMetadata', '$vamp', '$uibModal', '$authorization'];
angular.module('vamp-ui').controller('blueprintsController', blueprintsController);
