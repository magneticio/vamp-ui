angular.module('app').component('edit', {
  restrict: 'E',
  controller: ArtifactEditController,
  templateUrl: 'app/crud/edit.html'
});

function ArtifactEditController($scope, $filter, $attrs, $state, $stateParams, $location, toastr, alert, $vamp) {
  var $ctrl = this;

  this.kind = $attrs.kind;
  this.name = $stateParams.name;
  this.title = $filter('decodeName')(this.name);

  this.headerClass = '';
  this.headerMessage = '';

  var path = '/' + this.kind + '/' + this.name;

  this.editor = {
    useWrapMode: false,
    showGutter: true,
    theme: 'chrome',
    mode: 'yaml',
    firstLineNumber: 1,
    onLoad: function (editor) {
      editor.focus();
      editor.$blockScrolling = 'Infinity';
    }
  };

  this.base = null;
  this.source = null;

  var validation = true;
  var ignoreChange = false;

  $vamp.peek(path, '', {}, 'YAML');

  $scope.$on(path, function (e, response) {
    if ($ctrl.base === null && response.status === 'OK' && response.content === 'YAML') {
      $ctrl.base = $ctrl.source = response.data;
    }
    if (response.content === 'JSON') {
      if (response.status === 'ERROR') {
        $ctrl.headerClass = 'error';
        $ctrl.headerMessage = response.data.message;
      } else {
        $ctrl.headerClass = '';
        $ctrl.headerMessage = '';
      }
    }
  });

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, $ctrl.kind + ':' + $ctrl.name)) {
      if (_.includes(response.data.tags, 'archive:delete')) {
        alert.show('Warning', '\'' + $ctrl.name + '\' has been deleted in background. If you save the content, \'' + $ctrl.name + '\' will be recreated.', 'OK');
      } else if (!ignoreChange && _.includes(response.data.tags, 'archive:update')) {
        alert.show('Warning', '\'' + $ctrl.name + '\' has been updated in background. Do you want to reload changed?', 'Reload', 'Keep', function () {
          $ctrl.base = $ctrl.source = null;
          $vamp.peek(path, '', {}, 'YAML');
        });
      }
    }
  });

  $scope.$on('$stateChangeStart', function (event, toState, toParams) {
    if (!ignoreChange && $ctrl.isModified()) {
      event.preventDefault();
      alert.show('Warning', '\'' + $ctrl.name + '\' has been changed. If you proceed, all changes will be lost.', 'Proceed', 'Cancel', function () {
        $ctrl.base = $ctrl.source = null;
        $state.go(toState, toParams);
      });
    }
  });

  this.validate = _.throttle(function (data) {
    if (validation) {
      $vamp.put(path, data, {validate_only: true}, 'JSON');
    }
  }, 1500, {trailing: true, leading: false});

  this.isModified = function () {
    return !($ctrl.base === null || $ctrl.base === $ctrl.source);
  };

  this.cancel = function () {
    if ($ctrl.isModified()) {
      alert.show('Warning', '\'' + $ctrl.name + '\' has been changed. If you proceed, all changes will be lost.', 'Proceed', 'Cancel', goBack);
    } else {
      goBack();
    }
  };

  this.save = function () {
    validation = false;
    ignoreChange = true;

    $vamp.await(function () {
      $vamp.put(path, $ctrl.source, {}, 'JSON');
    }).then(function () {
      goBack();
      toastr.success('\'' + $ctrl.name + '\' has been successfully saved.');
    }).catch(function (response) {
      validation = true;
      ignoreChange = false;

      if (response) {
        toastr.error(response.data.message, 'Save failed.');
      } else {
        toastr.error('Server timeout.', 'Save failed.');
      }
    });
  };

  function goBack() {
    validation = false;
    ignoreChange = true;
    $location.path($location.search().back || $ctrl.kind);
  }
}
