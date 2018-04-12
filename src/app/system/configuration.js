angular.module('vamp-ui').controller('configurationController', ConfigurationController);

function ConfigurationController($scope, $timeout, $element, $state, artifact, $vamp, alert, toastr) {
  var $ctrl = this;
  $ctrl.editor = artifact.editor;

  $ctrl.type = '';
  $ctrl.info = $vamp.info;
  $ctrl.source = '';
  $ctrl.flatten = false;
  $ctrl.inEdit = false;

  $ctrl.dynamic = {
    base: null,
    current: null
  };

  $ctrl.startEdit = function () {
    $ctrl.inEdit = true;
    $timeout(function () {
      $($element).find('#editor textarea').focus();
    });
  };

  $ctrl.dirty = function () {
    return $ctrl.dynamic.base !== null && $ctrl.dynamic.base !== $ctrl.dynamic.current;
  };

  $ctrl.edited = function () {
    if ($ctrl.type === 'dynamic') {
      $ctrl.dynamic.current = $ctrl.source;
    }
  };

  $ctrl.setType = function (type) {
    if ($ctrl.dirty()) {
      alert.show('Warning', 'Unsaved changes to your configuration will be lost.', 'Proceed', 'Cancel', function () {
        $ctrl.dynamic.current = $ctrl.dynamic.base;
        $ctrl.reload(type);
      });
    } else {
      $ctrl.reload(type);
    }
  };

  $ctrl.reload = function (type) {
    $ctrl.source = '';
    $ctrl.inEdit = false;

    $vamp.get('/configuration', {type: type, flatten: $ctrl.flatten}, 'YAML')
      .then(function (res) {
        $timeout(function () {
          var data = res.data || '';
          $ctrl.type = type;
          $ctrl.source = data;
          if (type === 'dynamic') {
            $ctrl.dynamic.base = data;
            $ctrl.dynamic.current = data;
          }
        }, 0);
      })
      .catch(function () {
        $timeout(function () {
          $ctrl.type = 'ERROR';
          $ctrl.source = '';
        }, 0);
      });
  };

  $ctrl.update = function () {
    $vamp.httpPut('/configuration', $ctrl.source, {}, 'YAML')
      .then(function () {
        $timeout(function () {
          toastr.success('Configuration has been successfully updated. Connection with Vamp should be established again in few moments.');
          $ctrl.dynamic.base = $ctrl.dynamic.current;
          $ctrl.reload('applied');
        }, 0);
        $timeout(function () {
          $vamp.emit('/info');
        }, 3000);
      })
      .catch(function (response) {
        $timeout(function () {
          if (response) {
            toastr.error(response.data.message, 'Updating configuration failed.');
          } else {
            toastr.error('Server timeout.', 'Updating configuration failed.');
          }
        }, 0);
      });
  };

  $ctrl.toggleFlatten = function () {
    $ctrl.flatten = !$ctrl.flatten;
    $ctrl.setType($ctrl.type);
  };

  $scope.$on('$stateChangeStart', function (event, toState, toParams) {
    if ($ctrl.dirty()) {
      event.preventDefault();
      alert.show('Warning', 'Unsaved changes to your configuration will be lost.', 'Proceed', 'Cancel', function () {
        $ctrl.dynamic.current = $ctrl.dynamic.base;
        $state.go(toState, toParams);
      });
    }
  });

  $ctrl.setType('applied');
}
