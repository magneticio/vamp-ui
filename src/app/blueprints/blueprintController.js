angular.module('vamp-ui')
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

  function transformMemory(memoryString) {
    var memory = memoryString.split('MB');
    return parseInt(memory[0], 10);
  }

  /**
    * Calculates the availability based on the blueprint and the containerDriver
    * info and returns an warning message with stats if there are not enough resources available.
    */
  function getAvailability(blueprint, containerDriver) {
    if (containerDriver.type === 'marathon') {
      var availableResources = _.reduce(containerDriver.container.mesos.slaves, function (ar, slave) {
        return {
          totalMemory: ar.totalMemory + slave.unreserved_resources.mem,
          totalCPUs: ar.totalCPUs + slave.unreserved_resources.cpus
        };
      }, {totalMemory: 0, totalCPUs: 0});

      var blueprintResources = _.reduce(blueprint.clusters, function (br, cluster) {
        var scaleResources = _.reduce(cluster.services, function (sr, service) {
          var availability = null;
          if (service.scale === undefined || service.scale === null) {
            availability = {totalMemory: sr.totalMemory + 0, totalCPUs: sr.totalMemory + 0};
          } else {
            availability = {
              totalMemory: sr.totalMemory + (transformMemory(service.scale.memory) * service.scale.instances),
              totalCPUs: sr.totalCPUs + (service.scale.cpu * service.scale.instances)
            };
          }
          return availability;
        }, {totalMemory: 0, totalCPUs: 0});
        return {
          totalMemory: br.totalMemory + scaleResources.totalMemory,
          totalCPUs: br.totalCPUs + scaleResources.totalCPUs
        };
      }, {totalMemory: 0, totalCPUs: 0});

      var afterDeployment = {
        totalMemory: availableResources.totalMemory - blueprintResources.totalMemory,
        totalCPUs: availableResources.totalCPUs - blueprintResources.totalCPUs
      };

      if (afterDeployment.totalCPUs < 0 || afterDeployment.totalMemory < 0) {
        return {
          message: "The container driver probably does not have enough resources available " +
          "to successfully deploy the '" + blueprint.name + "' blueprint.",
          memory: {
            available: availableResources.totalMemory,
            needed: blueprintResources.totalMemory
          },
          cpu: {
            available: availableResources.totalCPUs,
            needed: blueprintResources.totalCPUs
          }
        };
      }
    }
  }

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
        },
        availability: function () {
          return $vamp.httpGet('/info', {on: 'container_driver'})
            .then(function (response) {
              return getAvailability($ctrl.blueprint, response.data.container_driver);
            }, function () {
              return null;
            });
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
