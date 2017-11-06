angular.module('vamp-ui').controller('vgaController', VgaController);

function VgaController($state, $scope, $timeout, $element, $vamp, $q, toastr, alert, artifact) {
  var $ctrl = this;
  $ctrl.editor = artifact.editor;

  $ctrl.source = '';
  $ctrl.inEdit = false;
  $ctrl.marshallers = [];
  $ctrl.template = {
    base: null,
    current: null
  };

  var mode = 'configuration';
  var marshaller = '';
  var ignoreChange = false;
  $ctrl.selectedIndex = 0;

  $ctrl.title = function () {
    return marshaller ? mode + ' : ' + marshaller : '';
  };

  $ctrl.mode = function (m) {
    if (m && mode !== m) {
      tryDiscard().then(function () {
        mode = m;
        $ctrl.load();
      });
    }
    return mode;
  };

  $ctrl.startEdit = function () {
    $ctrl.inEdit = true;
    $timeout(function () {
      $($element).find('#editor textarea').focus();
    });
  };

  $ctrl.marshaller = function (m) {
    if (m && marshaller !== m) {
      tryDiscard().then(function () {
        marshaller = m;
        $ctrl.load();
        $ctrl.selectedIndex = _.indexOf($ctrl.marshallers, marshaller);
      });
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

  $ctrl.discardChanges = function () {
    tryDiscard().then(function () {
      $ctrl.source = $ctrl.template.current = $ctrl.template.base;
      $ctrl.inEdit = false;
    });
  };

  function tryDiscard() {
    var def = $q.defer();
    if ($ctrl.dirty()) {
      alert.show('Warning', 'Template has been changed. If you proceed, all changes will be lost.', 'Proceed', 'Cancel',
      function () {
        def.resolve();
      },
      function () {
        def.reject();
      });
    } else {
      def.resolve();
    }

    return def.promise;
  }

  $ctrl.update = function () {
    ignoreChange = true;
    $vamp.httpPut('/vga/' + $ctrl.marshaller() + '/' + $ctrl.mode(), $ctrl.source, {}, 'YAML')
      .then(function () {
        $timeout(function () {
          toastr.success('Template has been successfully updated.');
          $ctrl.template.base = $ctrl.template.current;
          $ctrl.mode('configuration');
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
    $ctrl.inEdit = false;

    $vamp.get('/vga/' + $ctrl.marshaller() + '/' + $ctrl.mode(), null, 'YAML')
      .then(function (res) {
        $timeout(function () {
          var data = res.data || '';
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

  $vamp.get('/info?on=gateway_driver')
    .then(function (response) {
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
