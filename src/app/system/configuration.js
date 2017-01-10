angular.module('app').component('configuration', {
  templateUrl: 'app/system/configuration.html',
  controller: ConfigurationController
});

function ConfigurationController($timeout, artifact, $vamp, alert, toastr) {
  let $ctrl = this;
  $ctrl.editor = artifact.editor;

  $ctrl.type = '';
  $ctrl.source = '';
  $ctrl.flatten = false;

  $ctrl.dynamic = {
    base: null,
    current: null
  };

  $ctrl.title = function () {
    if ($ctrl.type === 'dynamic') {
      return 'dynamic (key-value store)';
    } else if ($ctrl.type === 'system') {
      return 'system properties';
    } else if ($ctrl.type === 'environment') {
      return 'environment variables';
    } else if ($ctrl.type === 'application') {
      return 'application configuration file';
    }
    return $ctrl.type;
  };

  $ctrl.dirty = function () {
    return $ctrl.dynamic.base !== null && $ctrl.dynamic.base !== $ctrl.dynamic.current;
  };

  $ctrl.edited = function () {
    if ($ctrl.type === 'dynamic') {
      $ctrl.dynamic.current = $ctrl.source;
    }
  };

  $ctrl.setType = function (type, force) {
    if (type === 'dynamic' && $ctrl.dirty()) {
      if (force) {
        alert.show('Warning', 'If you reload dynamic configuration your curent changes will be lost.', 'Reload', 'Keep', function () {
          $ctrl.reload(type);
        });
      } else {
        $ctrl.type = 'dynamic';
        $ctrl.source = $ctrl.dynamic.current;
      }
    } else {
      $ctrl.reload(type);
    }
  };

  $ctrl.reload = function (type) {
    $ctrl.type = '';
    $ctrl.source = '';

    $vamp.await(function () {
      $vamp.peek('configuration', '', {type: type, flatten: $ctrl.flatten}, 'YAML');
    }).then(function (response) {
      $timeout(function () {
        let data = response.data || '';
        $ctrl.type = type;
        $ctrl.source = data;
        if (type === 'dynamic') {
          $ctrl.dynamic.base = data;
          $ctrl.dynamic.current = data;
        }
      }, 0);
    }).catch(function () {
      $timeout(function () {
        $ctrl.type = 'ERROR';
        $ctrl.source = '';
      }, 0);
    });
  };

  $ctrl.update = function () {
    $vamp.await(function () {
      $vamp.put('configuration', $ctrl.source, {}, 'YAML');
    }).then(function () {
      $timeout(function () {
        toastr.success('Configuration has been successfully updated. Connection with Vamp should be established again in few moments.');
        $ctrl.dynamic.base = $ctrl.dynamic.current;
      }, 0);
    }).catch(function (response) {
      $timeout(function () {
        if (response) {
          toastr.error(response.data.message, 'Updating new configuration failed.');
        } else {
          toastr.error('Server timeout.', 'Updating new configuration failed.');
        }
      }, 0);
    });
  };

  $ctrl.toggleFlatten = function () {
    $ctrl.flatten = !$ctrl.flatten;
    $ctrl.setType($ctrl.type);
  };

  $ctrl.setType('applied');
}
