angular.module('app')
  .controller('DeploymentCtrl', DeploymentCtrl);

/** @ngInject */
function DeploymentCtrl($scope, $uibModal, $vamp, $location, toastr) {
  var $ctrl = this;
  $ctrl.deployment = $scope.artifact;

  $ctrl.exportDeployment = function ($event) {
    $event.stopPropagation();

    $uibModal.open({
      animation: true,
      backdrop: 'static',
      controller: function ($scope, $uibModalInstance, deployment) {
        $scope.deployment = deployment;
        $scope.name = angular.copy(deployment.name);
        $scope.ok = function () {
          $uibModalInstance.close({name: $scope.name, overwrite: $scope.overwrite});
        };
        $scope.cancel = $uibModalInstance.dismiss;
      },
      templateUrl: 'app/deployments/exportDeployment.html',
      resolve: {
        deployment: function () {
          return $ctrl.deployment;
        }
      }
    }).result.then(function (data) {
      function save(blueprint) {
        return $vamp.await(function () {
          $vamp.put('/blueprints/' + data.name, JSON.stringify(blueprint));
        }).then(function () {
          $location.path('blueprints/view/' + data.name);
          toastr.success('\'' + blueprint.name + '\' has been successfully exported as \'' + data.name + '\'.');
        }).catch(function (response) {
          if (response) {
            toastr.error(response.data.message, 'Export of \'' + $ctrl.deployment.name + '\' failed.');
          } else {
            toastr.error('Server timeout.', 'Export of \'' + $ctrl.deployment.name + '\' failed.');
          }
        });
      }

      $vamp.await(function () {
        $vamp.peek('/deployments/' + $ctrl.deployment.name, '', {as_blueprint: true});
      }).then(function (blueprint) {
        blueprint.data.name = data.name;
        if (data.overwrite) {
          save(blueprint.data);
        } else {
          $vamp.await(function () {
            $vamp.peek('/blueprints/' + data.name);
          }).then(function () {
            toastr.error('Blueprint \'' + data.name + '\' already exists.');
          }).catch(function (response) {
            if (response) {
              save(blueprint.data);
            } else {
              toastr.error('Server timeout.', 'Export of \'' + $ctrl.deployment.name + '\' failed.');
            }
          });
        }
      });
    });
  };
}
