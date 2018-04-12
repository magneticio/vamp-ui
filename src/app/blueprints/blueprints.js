angular.module('vamp-ui')
  .controller('BlueprintsController', BlueprintsController)
  .controller('DeployBlueprintController', DeployBlueprintController)
  .controller('UpdateDeploymentController', UpdateDeploymentController)
  .factory('$vampBlueprint', ['$rootScope', '$vamp', function ($rootScope, $vamp) {
    return new BlueprintService($rootScope, $vamp);
  }]);

/** @ngInject */
function BlueprintsController($scope, artifactsMetadata, $vampBlueprint, $controller, $uibModal, $state) {
  var $ctrl = this;
  $controller('BaseArtifactsController', {$ctrl: $ctrl, $scope: $scope, artifactsMetadata: artifactsMetadata});

  $ctrl.upload = function () {
    $uibModal.open({
      animation: true,
      backdrop: 'static',
      controller: 'importBlueprintControler',
      templateUrl: 'app/blueprints/templates/importBlueprint.html',
      resolve: {}
    }).result.then(function (data) {
      $state.go('.add', {importData: data.blueprint});
    });
  };
}

/** @ngInject */
function DeployBlueprintController($scope, $uibModalInstance, blueprint, availability) {
  $scope.blueprint = blueprint;
  $scope.availability = availability;
  $scope.name = angular.copy(blueprint.name);

  $scope.ok = function () {
    $uibModalInstance.close({name: $scope.name});
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

/** @ngInject */
function UpdateDeploymentController($scope, $uibModalInstance, blueprint, deployments, title, text, buttonText, buttonClass) {
  $scope.blueprint = blueprint;
  $scope.title = title;
  $scope.text = text;
  $scope.buttonText = buttonText;
  $scope.buttonClass = buttonClass;
  $scope.deployments = deployments;
  $scope.chosenDeployment = deployments[0];

  $scope.deploymentChosen = function (deployment) {
    $scope.chosenDeployment = deployment;
  };

  $scope.ok = function () {
    $uibModalInstance.close({deployment: $scope.chosenDeployment});
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

function BlueprintService($rootScope, $vamp) {
  var deployments = [];

  var get = _.throttle(function () {
    $vamp.emit('/deployments');
  }, 1000, {
    leading: true,
    trailing: false
  });

  get();

  $rootScope.$on('/deployments', function (e, response) {
    if (response.statusText === 'OK') {
      deployments = _.sortBy(response.data, ['name']);
      $rootScope.$broadcast('deployments');
    }
  });

  this.mergeWithDeployments = function (list) {
    list.length = 0;

    _.forEach(_.sortBy(deployments, ['name']), function (deployment) {
      list.unshift(deployment);
    });
  };

  this.removeFromDeployments = function (list, blueprint) {
    list.length = 0;

    var filtered = _.filter(deployments, function (deployment) {
      return _.find(blueprint.clusters, function (bc, name) {
        var dc = deployment.clusters[name];
        if (_.isEmpty(dc)) {
          return false;
        }
        return _.find(bc.services, function (bs) {
          return _.find(dc.services, function (ds) {
            var b1 = bs.breed.name || bs.breed.reference;
            var b2 = ds.breed.name || ds.breed.reference;
            return b1 === b2;
          });
        });
      });
    });

    _.forEach(_.sortBy(filtered, ['name']), function (deployment) {
      list.unshift(deployment);
    });
  };

  $rootScope.$on('/events/stream', function (e, response) {
    if ((_.includes(response.data.tags, 'deployments') && _.includes(response.data.tags, 'archive')) || _.includes(response.data.tags, 'synchronization')) {
      get();
    }
  });
}
