angular.module('app')
  .controller('BlueprintController', BlueprintController);

/** @ngInject */
function BlueprintController($scope, $state, $uibModal, toastr, $vamp, $vampBlueprint) {
  var $ctrl = this;

  $ctrl.blueprint = $scope.artifact;

  this.mergeWith = [];
  this.removeFrom = [];

  function peekDeployments() {
    $vampBlueprint.mergeWithDeployments($ctrl.mergeWith, $ctrl.blueprint);
    $vampBlueprint.removeFromDeployments($ctrl.removeFrom, $ctrl.blueprint);
  }

  peekDeployments();

  $scope.$on('deployments', function () {
    peekDeployments();
  });

  $ctrl.deploy = function ($event) {
    $event.stopPropagation();

    $uibModal.open({
      animation: true,
      backdrop: 'static',
      controller: 'DeployBlueprintController',
      templateUrl: 'app/blueprints/templates/deployBlueprint.html',
      resolve: {
        blueprint: function () {
          return $ctrl.blueprint;
        }
      }
    }).result.then(function (data) {
      var deployment = data.name;
      $vamp.await(function () {
        $vamp.put('/deployments/' + deployment, angular.toJson($ctrl.blueprint));
      }).then(function () {
        gotoDeployment(deployment);
        toastr.success('\'' + $ctrl.blueprint.name + '\' has been successfully deployed as \'' + deployment + '\'.');
      }).catch(function (response) {
        if (response) {
          toastr.error(response.data.message, 'Deployment of \'' + $ctrl.blueprint.name + '\' failed.');
        } else {
          toastr.error('Server timeout.', 'Deployment of \'' + $ctrl.blueprint.name + '\' failed.');
        }
      });
    });
  };

  $ctrl.merge = function ($event) {
    $event.stopPropagation();

    var modal = updateDeployment(
      $ctrl.mergeWith,
      'Merge blueprint to deployment',
      'Which deployment should \'' + $ctrl.blueprint.name + '\' be merged to?',
      'Merge',
      ''
    );

    modal.result.then(function (data) {
      var name = data.deployment.name;
      $vamp.await(function () {
        $vamp.put('/deployments/' + name, angular.toJson($ctrl.blueprint));
      }).then(function () {
        gotoDeployment(name);
        toastr.success('\'' + $ctrl.blueprint.name + '\' has been successfully merged to \'' + name + '\'.');
      }).catch(function (response) {
        if (response) {
          toastr.error(response.data.message, 'Merge of \'' + $ctrl.blueprint.name + '\' failed.');
        } else {
          toastr.error('Server timeout.', 'Merge of \'' + $ctrl.blueprint.name + '\' failed.');
        }
      });
    });
  };

  $ctrl.remove = function ($event) {
    $event.stopPropagation();

    var modal = updateDeployment(
      $ctrl.removeFrom,
      'Remove from deployment',
      'Which deployment should \'' + $ctrl.blueprint.name + '\' be removed from?',
      'Remove',
      'red'
    );

    modal.result.then(function (data) {
      var name = data.deployment.name;
      $vamp.await(function () {
        $vamp.remove('/deployments/' + name, angular.toJson($ctrl.blueprint));
      }).then(function () {
        gotoDeployment(name);
        toastr.success('\'' + $ctrl.blueprint.name + '\' has been successfully removed from \'' + name + '\'.');
      }).catch(function (response) {
        if (response) {
          toastr.error(response.data.message, 'Removal of \'' + $ctrl.blueprint.name + '\' failed.');
        } else {
          toastr.error('Server timeout.', 'Removal of \'' + $ctrl.blueprint.name + '\' failed.');
        }
      });
    });
  };

  function gotoDeployment(name) {
    $state.go('artifacts.one', {kind: 'deployments', name: name});
  }

  function updateDeployment(deployments, title, text, buttonText, buttonClass) {
    return $uibModal.open({
      animation: true,
      backdrop: 'static',
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
