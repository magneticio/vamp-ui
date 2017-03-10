angular.module('app').controller('edit',

function ArtifactEditController($scope, $filter, $state, $stateParams, $breadcrumb, $timeout, uiStatesFactory, $element, $vamp, artifact, snippet, toastr, alert) {
  var $ctrl = this;

  this.kind = $stateParams.kind;
  this.name = $stateParams.name;
  this.title = $filter('decodeName')(this.name);

  this.errorClass = '';
  this.errorMessage = '';
  $ctrl.restOfMessage = '';
  this.editor = artifact.editor;
  $ctrl.expandError = false;

  var path = '/' + this.kind + '/' + this.name;

  this.base = null;
  this.source = null;

  // $ctrl.revisions = revisionsService.revisions;
  // $ctrl.activeRevisiton = revisionsService.activeRevision;

  this.valid = true;
  $ctrl.inEdit = false;
  var validation = true;
  var ignoreChange = false;

  function init() {
    if ($state.current.name === 'artifacts.one.source.view') {
      $ctrl.stopEdit();
    } else {
      $ctrl.startEdit();
    }
  }

  $scope.$on('$destroy', function () {
    uiStatesFactory.setRightPanelViewState(false);
  });

  function transformErrorMessage(message) {
    $ctrl.errorMessage = message;

    var newLineIndex = message.indexOf('\n');
    if (newLineIndex !== -1) {
      $ctrl.errorMessage = message.substring(0, newLineIndex);
      $ctrl.restOfMessage = message.substring(newLineIndex + 1);
      $ctrl.expandError = false;
    }
  }

  $ctrl.startEdit = function () {
    $ctrl.inEdit = true;

    $state.go('^.edit').then(function () {
      uiStatesFactory.setRightPanelViewState(false);
      $timeout(function () {
        $($element).find('#editor textarea').focus();
      });
    });
  };

  $ctrl.stopEdit = function () {
    $ctrl.source = $ctrl.base;
    $ctrl.inEdit = false;

    $state.go('^.view').then(function () {
      uiStatesFactory.setRightPanelViewState(true);
    });
  };

  this.peek = function () {
    $vamp.peek(path, '', {}, 'YAML');
    $vamp.peek('/events', JSON.stringify({
      tags: [
        'archive', $ctrl.kind + ':' + $ctrl.name
      ]
    }), {type: 'archive'});
  };

  this.peek();

  $scope.$on(path, function (e, response) {
    if ($ctrl.base === null && response.status === 'OK' && response.content === 'YAML') {
      $ctrl.valid = true;
      $ctrl.base = $ctrl.source = response.data;
    }
    if (response.content === 'JSON') {
      if (response.status === 'ERROR') {
        $ctrl.valid = false;
        $ctrl.errorClass = 'error';
        transformErrorMessage(response.data.message);
        $ctrl.expandError = false;
      } else {
        $ctrl.valid = true;
        $ctrl.errorClass = '';
        $ctrl.errorMessage = '';
        $ctrl.restOfMessage = '';
        $ctrl.expandError = false;
      }
    }
  });

  $scope.$on('/events/stream', function (e, response) {
    if ($ctrl.base && _.includes(response.data.tags, $ctrl.kind + ':' + $ctrl.name)) {
      if (_.includes(response.data.tags, 'archive:delete')) {
        alert.show('Warning', '\'' + $ctrl.name + '\' has been deleted in background. If you save the content, \'' + $ctrl.name + '\' will be recreated.', 'OK');
      } else if (!ignoreChange && _.includes(response.data.tags, 'archive:update')) {
        alert.show('Warning', '\'' + $ctrl.name + '\' has been updated in background. Do you want to reload changes?', 'Reload', 'Keep', function () {
          $ctrl.base = $ctrl.source = null;
          $ctrl.peek();
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

  $scope.$on('$vamp:connection', function (event, connection) {
    if (connection === 'opened') {
      $ctrl.peek();
    }
  });

  this.validate = function () {
    artifact.validate(path, $ctrl.source, validation);
  };

  this.isModified = function () {
    return !($ctrl.base === null || $ctrl.base === $ctrl.source);
  };

  this.fullErrorMessage = function () {
    snippet.show('Error message', artifact.transformErrorMessage($ctrl.errorMessage), 'lg');
  };

  this.cancel = function () {
    if ($ctrl.isModified()) {
      alert.show('Warning', '\'' + $ctrl.name + '\' has been changed. If you proceed, all changes will be lost.', 'Proceed', 'Cancel', $ctrl.stopEdit);
    } else {
      $ctrl.stopEdit();
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
        toastr.error(response.data.message, 'Save of \'' + $ctrl.name + '\'failed.');
      } else {
        toastr.error('Server timeout.', 'Save of \'' + $ctrl.name + '\'failed.');
      }
    });
  };

  function goBack() {
    validation = false;
    ignoreChange = true;
    $state.go('^');
  }

  init();
});
