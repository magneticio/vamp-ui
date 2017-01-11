angular.module('app').component('vga', {
  templateUrl: 'app/system/vga.html',
  controller: VgaController
});

function VgaController($state, $scope, $timeout, $vamp, artifact, toastr, alert) {
  var $ctrl = this;
  $ctrl.editor = artifact.editor;
  $ctrl.editor.mode = 'twig';

  $ctrl.source = '';
  $ctrl.marshallers = [];
  $ctrl.template = {
    base: null,
    current: null
  };

  var mode = 'configuration';
  var marshaller = '';
  var ignoreChange = false;

  $ctrl.title = function () {
    return marshaller ? mode + ' : ' + marshaller : '';
  };

  $ctrl.mode = function (m) {
    if (m && mode !== m) {
      mode = m;
      $ctrl.load();
    }
    return mode;
  };

  $ctrl.marshaller = function (m) {
    if (m && marshaller !== m) {
      marshaller = m;
      $ctrl.load();
    }
    return marshaller;
  };

  $ctrl.dirty = function () {
    return $ctrl.template.base !== null && $ctrl.template.base !== $ctrl.template.current;
  };

  $ctrl.edited = function () {
    if ($ctrl.mode() === 'template') {
      $ctrl.template.current = $ctrl.source;
    }
  };

  $ctrl.update = function () {
    ignoreChange = true;
    $vamp.await(function () {
      $vamp.put('vga/' + $ctrl.marshaller() + '/' + $ctrl.mode(), $ctrl.source, {}, 'YAML');
    }).then(function () {
      $timeout(function () {
        toastr.success('Template has been successfully updated.');
        $ctrl.template.base = $ctrl.template.current;
        ignoreChange = false;
      }, 0);
    }).catch(function (response) {
      $timeout(function () {
        ignoreChange = false;
        if (response) {
          toastr.error(response.data.message, 'Updating template failed.');
        } else {
          toastr.error('Server timeout.', 'Updating template failed.');
        }
      }, 0);
    });
  };

  $ctrl.load = function () {
    $vamp.await(function () {
      $vamp.peek('vga/' + $ctrl.marshaller() + '/' + $ctrl.mode(), '', {}, 'YAML');
    }).then(function (response) {
      $timeout(function () {
        var data = response.data || '';
        $ctrl.source = data;
        if ($ctrl.mode() === 'template') {
          $ctrl.template.base = data;
          $ctrl.template.current = data;
        } else {
          $ctrl.template.base = null;
          $ctrl.template.current = null;
        }
      }, 0);
    });
  };

  $vamp.await(function () {
    $vamp.peek('info?on=gateway_driver');
  }).then(function (response) {
    $timeout(function () {
      var data = response.data || {};
      var marshallers = new Set();
      for (var marshaller in data.gateway_driver.marshallers) {
        if (marshaller && data.gateway_driver.marshallers.hasOwnProperty(marshaller)) {
          marshallers.add(data.gateway_driver.marshallers[marshaller].type + '/' + marshaller);
        }
      }
      $ctrl.marshallers = Array.from(marshallers);
      if ($ctrl.marshallers) {
        $ctrl.marshaller($ctrl.marshallers[0]);
      }
    }, 0);
  });

  $scope.$on('/events/stream', function (e, response) {
    var m = marshaller.split('/', 2);
    if ($ctrl.mode() === 'configuration' && _.includes(response.data.tags, 'marshaller:configuration')) {
      if (_.includes(response.data.tags, 'type:' + m[0]) && _.includes(response.data.tags, 'name:' + m[1])) {
        $ctrl.load();
      }
    } else if (!ignoreChange && $ctrl.mode() === 'template' && _.includes(response.data.tags, 'marshaller:template')) {
      if (_.includes(response.data.tags, 'type:' + m[0]) && _.includes(response.data.tags, 'name:' + m[1])) {
        alert.show('Warning', 'Template has been updated in background. Do you want to reload changes?', 'Reload', 'Keep', function () {
          $ctrl.load();
        });
      }
    }
  });

  $scope.$on('$stateChangeStart', function (event, toState, toParams) {
    if (!ignoreChange && $ctrl.dirty()) {
      event.preventDefault();
      alert.show('Warning', 'Template has been changed. If you proceed, all changes will be lost.', 'Proceed', 'Cancel', function () {
        $ctrl.template.base = null;
        $ctrl.template.current = null;
        $state.go(toState, toParams);
      });
    }
  });
}
