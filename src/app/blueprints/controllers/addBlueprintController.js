/* eslint-disable */
angular.module('vamp-ui').controller('addBlueprintController',

function ($scope, $state, $stateParams, $vamp, artifact, $interval, toastr) {
  var $ctrl = this;

  $ctrl.kind = $scope.$resolve.model;
  var path = '/' + $ctrl.kind;
  // naive singularization
  $ctrl.singular = $stateParams.kind.substring(0, $stateParams.kind.length - 1);
  $ctrl.title = 'New ' + $ctrl.singular;

  $ctrl.blueprint = {
    name: '',
    gateways: {
      name: '',
      port: ''
    },
    breed: {
      deployable: '',
      ports: [
        {
          name: '',
          port: '',
          protocol: ""
        }
      ],
      variables: [
        {
          name: '',
          value: ''
        }
      ]
    },
    scale: {
      cpu: '',
      instances: '',
      memory: ''
    },
    dialects: {
      forceimage: false,
      params: [
        {
          key: '',
          value: ''
        }
      ]
    }
  };

  $ctrl.addPort = function () {
    var newPort = {
      name: '',
      port: '',
      protocol: ""
    };
    $ctrl.blueprint.breed.ports.push(newPort);
  };
  $ctrl.addVar = function () {
    var newVar = 	{
      name: '',
      value: ''
    };
    $ctrl.blueprint.breed.variables.push(newVar);
  };
  $ctrl.addParams = function () {
    var newParam = {
      key: '',
      value: ''
    };
    $ctrl.blueprint.dialects.params.push(newParam);
  };

  function prepareBlueprint(blueprint) {
    var finalBlueprint = {
      name: blueprint.name,
      gateways: {},
      clusters: {}
    };
    finalBlueprint.clusters[blueprint.name] = {
      services: {
        breed: {
          name: blueprint.name,
          deployable: blueprint.breed.deployable,
          ports: {},
          environment_variables: {}
        },
        scale: {
          cpu: blueprint.scale.cpu,
          memory: blueprint.scale.memory,
          instances: blueprint.scale.instances
        },
        dialects: {
          marathon: {
            container: {
              docker: {
                forcePullImage: blueprint.dialects.forceimage,
                parameters: prepareParams(blueprint.dialects.params)
              }
            }
          }
        }
      }
    };

    blueprint.breed.ports.forEach(function (port) {
      finalBlueprint.clusters[blueprint.name].services.breed.ports[port.name] = port.port + '/' + port.protocol;
    });

    function prepareParams(params) {
      if (params.length === 1) {
        if (params[0].key === "" || params[0].value === "") {
          return [];
        }
      }
      return params;
    }

    finalBlueprint.gateways[blueprint.gateways.port] = blueprint.name + '/' + blueprint.gateways.name;
    return finalBlueprint;
  }

  $ctrl.save = function () {
    var finalBlueprint = prepareBlueprint($ctrl.blueprint);
    var yaml = json2yaml(finalBlueprint);

    $vamp.post(path, yaml, {}).then(function () {
      $ctrl.goBack();
      toastr.success('New blueprint has been successfully created.');
    }).catch(function (response) {
      if (response && response.data) {
        toastr.error(response.data.message, 'Creation failed.');
      } else {
        toastr.error('Server timeout.', 'Creation failed.');
      }
    });
  };

  $ctrl.goBack = function () {
    $state.go('artifacts', {kind: $stateParams.kind});
  };
});
