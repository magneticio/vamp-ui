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

  $ctrl.onView = function (blueprint) {
    $state.go('.one', {
      name: blueprint.name
    });
  };

  $ctrl.delete = function (blueprint) {
    $vamp.delete(path + '/' + blueprint.name, angular.toJson(blueprint)).then(function () {
      get();
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

  // $scope event listenters

  $scope.$on('$vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      get();
    }
  });

  $scope.$on(path, function (e, response) {
    $scope.artifactsLoaded = true;
    angular.copy(_.orderBy(response.data, 'name'), $ctrl.blueprints);
  });

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'blueprints')) {
      get();
    }
  });

  function get() {
    $vamp.get(path);
  }

  get();
}

blueprintsController.$inject = ['$scope', '$state', '$stateParams', 'artifactsMetadata', '$vamp', '$uibModal', '$authorization'];
angular.module('vamp-ui').controller('blueprintsController', blueprintsController);
