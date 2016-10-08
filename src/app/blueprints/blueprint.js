angular.module('app')
  .controller('BlueprintController', BlueprintController)
  .controller('DeployBlueprintController', DeployBlueprintController)
  .controller('UpdateDeploymentController', UpdateDeploymentController);

/** @ngInject */
function BlueprintController($scope, $location, $uibModal, toastr, vamp) {
  var $ctrl = this;
  this.blueprint = $scope.$parent.$parent.artifact;

  this.deployments = [{
    name: 'deployment1'
  }, {
    name: 'deployment2'
  }];

  this.mergeWith = function () {
    return $ctrl.deployments;
  };

  this.removeFrom = function () {
    return $ctrl.deployments;
  };

  this.deploy = function ($event) {
    $event.stopPropagation();

    $uibModal.open({
      animation: true,
      controller: 'DeployBlueprintController',
      templateUrl: 'app/blueprints/deployBlueprint.html',
      resolve: {
        blueprint: function () {
          return $ctrl.blueprint;
        }
      }
    }).result.then(function (data) {
      var deployment = data.deploymentName;

      vamp.await(function () {
        vamp.put('/deployments/' + deployment, angular.toJson($ctrl.blueprint));
      }).then(function () {
        showDeployment(deployment);
        toastr.success('\'' + $ctrl.blueprint.name + '\' has been successfully deployed as \'' + deployment + '\'.');
      }).catch(function (response) {
        if (response) {
          toastr.error(response.data.message, 'Deployment failed.');
        } else {
          toastr.error('Server timeout.', 'Deployment failed.');
        }
      });
    });
  };

  this.merge = function ($event) {
    $event.stopPropagation();

    var modal = updateDeployment(
      $ctrl.mergeWith(),
      'Merge blueprint \'' + $ctrl.blueprint.name + '\' to deployment',
      'Which deployment should [' + $ctrl.blueprint.name + '] be merged to?',
      'Merge',
      ''
    );

    modal.result.then(function (data) {
      console.log('deployment: ' + JSON.stringify(data.deployment));
    });
  };

  this.remove = function ($event) {
    $event.stopPropagation();

    var modal = updateDeployment(
      $ctrl.removeFrom(),
      'Remove blueprint \'' + $ctrl.blueprint.name + '\' from deployment',
      'Which deployment should [' + $ctrl.blueprint.name + '] be removed from?',
      'Remove',
      'red'
    );

    modal.result.then(function (data) {
      console.log('deployment: ' + JSON.stringify(data.deployment));
    });
  };

  function showDeployment(name) {
    $location.path('deployments/view/' + name);
  }

  function updateDeployment(deployments, title, text, buttonText, buttonClass) {
    return $uibModal.open({
      animation: true,
      controller: 'UpdateDeploymentController',
      templateUrl: 'app/blueprints/updateDeployment.html',
      resolve: {
        blueprint: function () {
          return $ctrl.blueprint;
        },
        deployments: function () {
          return deployments;
        },
        title: function () {
          return title;
        },
        text: function () {
          return text;
        },
        buttonText: function () {
          return buttonText;
        },
        buttonClass: function () {
          return buttonClass;
        }
      }
    });
  }
}

/** @ngInject */
function DeployBlueprintController($scope, $uibModalInstance, blueprint) {
  $scope.blueprint = blueprint;
  $scope.deploymentName = angular.copy(blueprint.name);

  $scope.ok = function () {
    $uibModalInstance.close({deploymentName: $scope.deploymentName, blueprint: blueprint});
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
  $scope.chosenDeployment = undefined;

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
