angular.module('vamp-ui').controller('edit',

function ArtifactEditController($scope, $filter, $state, $stateParams, $timeout, uiStatesFactory, revisionsService, $element, $vamp, artifact, snippet, toastr, alert, $authorization, $uibModal) {
  var $ctrl = this;

  this.kind = $scope.$resolve.model;
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

  $ctrl.activeRevisiton = revisionsService.activeRevision;

  this.valid = true;
  $ctrl.inEdit = false;
  var validation = true;
  var ignoreChange = false;

  $ctrl.readOnly = function () {
    return $authorization.readOnly($ctrl.kind);
  };

  $ctrl.toggleViewMode = function () {
    $state.go('artifacts.one.source-form.view');
  };

  function init() {
    if ($state.current.name === 'artifacts.one.source.view') {
      $ctrl.stopEdit();
    } else {
      $ctrl.startEdit();
    }
  }

  $scope.$on('$destroy', function () {
    uiStatesFactory.setRightPanelViewState(uiStatesFactory.STATE_ENUM.HIDDEN);
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
      uiStatesFactory.setRightPanelViewState(uiStatesFactory.STATE_ENUM.EXPANDED);
      $timeout(function () {
        $($element).find('#editor textarea').focus();
      });
    });
  };

  $ctrl.stopEdit = function () {
    $ctrl.source = $ctrl.base;
    $ctrl.inEdit = false;

    $state.go('^.view').then(function () {
      $timeout(function () {
        $ctrl.peek();
      });

      uiStatesFactory.setRightPanelViewState(uiStatesFactory.STATE_ENUM.EXPANDED);
    });
  };

  $ctrl.closeRevision = function () {
    revisionsService.clearSelected();
  };

  $ctrl.copyRevisionContent = function () {
    alertIfDirty(function () {
      if (!$ctrl.inEdit && !$ctrl.readOnly) {
        $ctrl.startEdit();
      }

      $ctrl.source = $ctrl.activeRevisiton.source;
      $ctrl.closeRevision();
    });
  };

  this.peek = function () {
    $vamp.get(path, null, 'YAML').then(function (response) {
      if ($ctrl.base === null) {
        $ctrl.valid = true;
        $ctrl.base = $ctrl.source = response.data;
      }
    });

    $vamp.peek('/events', JSON.stringify({
      tags: [
        'archive', $ctrl.kind + ':' + $ctrl.name
      ]
    }), {type: 'archive'});
  };

  this.peek();

  $scope.$on(path, function (e, response) {
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
      alertIfDirty(function () {
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
    alertIfDirty($ctrl.stopEdit);
  };

  function alertIfDirty(callback) {
    if ($ctrl.isModified()) {
      alert.show('Warning', '\'' + $ctrl.name + '\' has been changed. If you proceed, all changes will be lost.', 'Proceed', 'Cancel', callback);
    } else {
      callback();
    }
  }

  function alertConfirmation(skipConfirmation, callback) {
    if ($ctrl.kind === "deployments" && !skipConfirmation) {
      openDeploymentConfirmation();
    } else {
      callback();
    }
  }

  function openDeploymentConfirmation() {
    $uibModal.open({
      animation: true,
      backdrop: 'static',
      controller: 'DeploymentConfirmationController',
      templateUrl: 'app/deployments/templates/deploymentConfirmation.html',
      resolve: {
        deployment: function () {
          return $ctrl.source;
        },
        editor: function () {
          return $ctrl.editor;
        }
      }
    }).result.then(function (action) {
      if (action === 'save') {
        $ctrl.save(true);
      } else if (action === 'cancel') {
        goBack();
      }
    });
  }

  this.save = function (skipConfirmation) {
    validation = false;
    ignoreChange = true;
    alertConfirmation(skipConfirmation, function () {
      $vamp.httpPut(path, $ctrl.source, {}, 'JSON')
      .then(function () {
        $ctrl.base = $ctrl.source;
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
    });
  };

  function goBack() {
    validation = false;
    ignoreChange = true;

    $ctrl.stopEdit();
  }

  init();
});
